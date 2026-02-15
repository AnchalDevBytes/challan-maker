import api from "@/lib/api"
import { InvoiceFormValues } from "@/schemas/invoice.schema";
import { InvoiceHistoryItem } from "@/store/auth-invoice-store"


export const InvoiceApi = {
    async getUserInvoices(): Promise<InvoiceHistoryItem[]> {
        const response = await api.get("/invoice");
        return Array.isArray(response.data.data.invoices) ? response.data.data.invoices : [];
    },

    async uploadLogo(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/invoice/upload-logo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.data.url;
    },

    async createInvoice(data: InvoiceFormValues): Promise<{ invoice: InvoiceHistoryItem, message: string}> {
        const response = await api.post("/invoice", data);

        return {
            invoice: response.data.data.invoice,
            message: response.data.message
        };
    },

    async updateInvoice(id: string, data: Partial<InvoiceFormValues>) {
        const response = await api.patch(`/invoice/${id}`, data);
        return {
            invoice: response.data.data.invoice,
            message: response.data.message
        };
    },

    async deleteInvoice(id: string) {
        await api.delete(`/invoice/${id}`);
    }
};
