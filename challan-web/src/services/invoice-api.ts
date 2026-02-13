import api from "@/lib/api"
import { InvoiceFormValues } from "@/schemas/invoice.schema";
import { InvoiceHistoryItem } from "@/store/auth-invoice-store"


export const InvoiceApi = {
    async getUserInvoices(): Promise<InvoiceHistoryItem[]> {
        const response = await api.get("/invoice");
        return Array.isArray(response.data.data.invoices) ? response.data.data.invoices : [];
    },

    async createInvoice(data: InvoiceFormValues, pdfBlob: Blob): Promise<{ invoice: InvoiceHistoryItem, message: string}> {
        const formData = new FormData();

        formData.append("data", JSON.stringify(data));

        formData.append("file", pdfBlob, `invoice-${data.invoiceNumber || 'draft'}.pdf`);

        const response = await api.post("/invoice", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const responseData = response.data.data.invoice;

        return {
            invoice: responseData,
            message: response.data.message
        };
    }
};
