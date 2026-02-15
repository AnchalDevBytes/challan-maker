import { InvoiceFormValues } from "@/schemas/invoice.schema";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

export interface InvoiceHistoryItem {
    id: string;
    invoiceNumber: string;
    customerName: string;
    totalAmount: number | string;
    status: "DRAFT" | "SENT" | "PAID" | "OVERDUE";
    createdAt: string | Date;
    pdfUrl: string;
}

interface AuthInvoiceState {
    activeInvoice: InvoiceFormValues;
    invoiceList: InvoiceHistoryItem[];

    resetInvoiceKey: number;

    setActiveInvoice: (data: Partial<InvoiceFormValues>) => void;
    setInvoiceList: (list: InvoiceHistoryItem[]) => void;
    addInvoiceToList: (item: InvoiceHistoryItem) => void;
    resetActiveInvoice: () => void;
}

const DEFAULT_INVOICE: InvoiceFormValues = {
    invoiceNumber: "",
    issueDate: new Date(),
    dueDate: null,
    senderDetails: { name: "", address: "", email: "", phone: "" },
    clientDetails: { name: "", address: "", email: "", phone: "" },
    items: [{ id: uuidv4(), description: "Service Charge", quantity: 1, unitPrice: 0 }],
    currency: "INR",
    taxRate: 0,
    discount: 0,
    shipping: 0,
    logo: null,
    bankDetails: { bankName: "", accountName: "", accountNumber: "", ifscCode: "" },
    status: "DRAFT",
    notes: "Thank you for your business!",
    terms: "",
};

export const useAuthInvoiceStore = create<AuthInvoiceState>((set) => ({
    activeInvoice: DEFAULT_INVOICE,
    invoiceList: [],

    resetInvoiceKey: 0,

    setActiveInvoice: (data) => set((state) => ({
        activeInvoice: { ...state.activeInvoice, ...data },
    })),

    setInvoiceList: (list) => set({ invoiceList: list }),

    addInvoiceToList: (invoice) => set((state) => {
        const newList = [invoice, ...state.invoiceList];
        if(newList.length > 5) {
            newList.pop();
        }

        return { invoiceList: newList };
    }),

    resetActiveInvoice: () => 
        set((state) => ({
            activeInvoice: DEFAULT_INVOICE,
            resetInvoiceKey: state.resetInvoiceKey + 1,
        })),
}));
