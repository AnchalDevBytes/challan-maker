import { InvoiceFormValues } from "@/schemas/invoice.schema";
import { v4 as uuidv4 } from 'uuid';
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GuestState {
    currentDraft: InvoiceFormValues;
    resetKey: number;

    setDraft: (data: Partial<InvoiceFormValues>) => void;
    resetDraft: () => void;

    addItem: () => void;
    removeItem: (id: string) => void;
    updateItem: (index: number, item: Partial<InvoiceFormValues['items'][0]>) => void; 

    setLogo: (base64: string | null) => void;
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

export const useGuestStore = create<GuestState>()(
    persist(
        (set) => ({
            currentDraft: DEFAULT_INVOICE,
            resetKey: 0,

            setDraft: (data) => 
                set((state) => ({
                    currentDraft: { ...state.currentDraft, ...data }, 
                })),

            resetDraft: () => 
                set((state) => ({ 
                    currentDraft: DEFAULT_INVOICE,
                    resetKey: state.resetKey + 1 
                })),

            addItem: () => 
                set((state) => ({
                    currentDraft: { 
                        ...state.currentDraft, 
                        items: [
                            ...state.currentDraft.items,
                            { id: uuidv4(), description: "", quantity: 1, unitPrice: 0 }
                        ]
                    }
                })),

            removeItem: (id) => 
                set((state) => ({
                    currentDraft: { 
                        ...state.currentDraft, 
                        items: state.currentDraft.items.filter(item => item.id !== id)
                    }
                })),

            updateItem: (index, itemData) => 
                set((state) => {
                    const newItems = [...state.currentDraft.items];
                    newItems[index] = { ...newItems[index], ...itemData };
                    return {
                        currentDraft: { ...state.currentDraft, items: newItems }
                    };
                }),

            setLogo: (base64) => 
                set((state) => ({
                    currentDraft: { ...state.currentDraft, logo: base64 }
                })),
    
        }),
        {
            name: "guest-invoice-storage",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state: GuestState | undefined) => {
                if(state) {
                    if(state.currentDraft.issueDate) {
                        state.currentDraft.issueDate = new Date(state.currentDraft.issueDate);
                    } else {
                        state.currentDraft.issueDate = new Date();
                    }
                    
                    if(state.currentDraft.dueDate) state.currentDraft.dueDate = new Date(state.currentDraft.dueDate);
                }
            }
        }
    )
);
