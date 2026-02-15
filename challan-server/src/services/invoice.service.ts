import type { InvoiceStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { StorageProvider } from "../providers/storage.provider";
import type { InvoiceFormValues, InvoiceItem } from "../schemas/invoice.schema";
import { AppError } from "../utils/AppError";

const MAX_INVOICES = 5;

export class InvoiceService {
    private static storage = new StorageProvider();

    static async uploadLogo(userId: string, logoBuffer: Buffer) {
        const uploadResult = await this.storage.uploadFile(logoBuffer, `logos/${userId}`);
        
        return {
            url: uploadResult.url,
            publicId: uploadResult.publicId
        };
    }

    static async createInvoice(userId: string, data: InvoiceFormValues) {
        return await prisma.$transaction(async (tx) => {
            const count = await tx.invoice.count({ where: { userId }});

            let deleteInvoiceId = null;

            if(count >= MAX_INVOICES) {
                const oldestInvoice = await tx.invoice.findFirst({
                    where: { userId },
                    orderBy: { createdAt: 'asc' },
                    select: { id: true, pdfPublicId: true } // we are using pdfPublicId for logo publicId
                });

                if(oldestInvoice) {
                    await tx.invoice.delete({ where: { id: oldestInvoice.id }});

                    if(oldestInvoice.pdfPublicId) {
                        await this.storage.deleteFile(oldestInvoice.pdfPublicId);
                    }

                    deleteInvoiceId = oldestInvoice.id;
                }
            }

            const logoPublicId = data.logo ? this.extractPublicIdFromUrl(data.logo) : null;

            const newInvoice = await tx.invoice.create({
                data: {
                    userId,
                    invoiceNumber: data.invoiceNumber,
                    customerName: data.clientDetails.name,
                    totalAmount: this.calculateTotal(data.items, data.taxRate, data.discount, data.shipping),
                    status: data.status as InvoiceStatus,
                    issueDate: new Date(data.issueDate),
                    dueDate: data.dueDate ? new Date(data.dueDate) : null,
                    currency: data.currency,
                    pdfUrl: data.logo || null,
                    pdfPublicId: logoPublicId,
                    invoiceData: data as any,
                },
            });

            return { invoice: newInvoice, deleteInvoiceId };
        });
    }

    static async updateInvoice(userId: string, invoiceId: string, data: Partial<InvoiceFormValues>) {
        const existingInvoice = await prisma.invoice.findFirst({
            where: { id: invoiceId, userId }
        });

        if(!existingInvoice) throw new AppError("Invoice not found", 404);

        const currentJson = existingInvoice.invoiceData as unknown as InvoiceFormValues;
        const updatedJson = { ...currentJson, ...data };

        let newLogoPublicId = existingInvoice.pdfPublicId;
        if(data.logo && data.logo !== existingInvoice.pdfUrl) {
            if(existingInvoice.pdfPublicId) {
                await this.storage.deleteFile(existingInvoice.pdfPublicId);
            }

            newLogoPublicId = this.extractPublicIdFromUrl(data.logo);
        }

        return await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                invoiceNumber: updatedJson.invoiceNumber,
                customerName: updatedJson.clientDetails.name,
                totalAmount: this.calculateTotal(updatedJson.items, updatedJson.taxRate, updatedJson.discount, updatedJson.shipping),
                status: updatedJson.status as InvoiceStatus,
                issueDate: new Date(updatedJson.issueDate),
                dueDate: updatedJson.dueDate ? new Date(updatedJson.dueDate) : null,
                currency: updatedJson.currency,
                pdfUrl: updatedJson.logo || null,
                pdfPublicId: newLogoPublicId,
                invoiceData: updatedJson as any,
            }
        });
    }

    static async deleteInvoice(userId: string, invoiceId: string) {
        const invoice = await prisma.invoice.findFirst({
            where: { id: invoiceId, userId },
            select: { id: true, pdfPublicId: true }
        });

        if(!invoice) throw new AppError("Invoice not found", 404);

        await prisma.invoice.delete({ where: { id: invoiceId }});

        if(invoice.pdfPublicId) {
            await this.storage.deleteFile(invoice.pdfPublicId);
        }

        return { message: "Invoice deleted successfully", success: true };
    }


    static async getUserInvoices(userId: string) {
        const invoices = await prisma.invoice.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: MAX_INVOICES,
        });

        return invoices;
    }


    private static calculateTotal(items: InvoiceItem[] , taxRate: number, discount: number, shipping: number) {
        const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const taxAmount = (subTotal * taxRate) / 100;
        return subTotal + taxAmount + shipping - discount;
    }

    private static extractPublicIdFromUrl(url: string) : string | null {
        try {
            const parts = url.split('/');
            const filename = parts.pop()?.split('.')[0];
            const folder = parts.pop();
            const parentFolder = parts.pop();

            if(filename && folder && parentFolder === 'logos') {
                return `logos/${folder}/${filename}`;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}
