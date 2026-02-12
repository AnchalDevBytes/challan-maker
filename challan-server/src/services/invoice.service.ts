import type { InvoiceStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { StorageProvider } from "../providers/storage.provider";
import type { InvoiceFormValues, InvoiceItem } from "../schemas/invoice.schema";

const MAX_INVOICES = 5;

export class InvoiceService {
    private static storage = new StorageProvider();

    static async createInvoice(userId: string, data: InvoiceFormValues, fileBuffer: Buffer) {
        const { url, publicId } = await this.storage.uploadFile(fileBuffer, `invoices/${userId}`);

        return await prisma.$transaction(async (tx) => {
            const count = await tx.invoice.count({ where: { userId }});

            let deleteInvoiceId = null;

            if(count >= MAX_INVOICES) {
                const oldestInvoice = await tx.invoice.findFirst({
                    where: { userId },
                    orderBy: { createdAt: 'asc' },
                    select: { id: true, pdfPublicId: true }
                });

                if(oldestInvoice) {
                    await tx.invoice.delete({ where: { id: oldestInvoice.id }});

                    if(oldestInvoice.pdfPublicId) {
                        await this.storage.deleteFile(oldestInvoice.pdfPublicId);
                    }

                    deleteInvoiceId = oldestInvoice.id;
                }
            }

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
                    pdfUrl: url,
                    pdfPublicId: publicId,
                    invoiceData: data as any,
                },
            });

            return { invoice: newInvoice, deleteInvoiceId };
        });
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
}
