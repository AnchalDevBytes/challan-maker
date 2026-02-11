import { InvoiceFormValues } from "@/schemas/invoice.schema";
import { v4 as uuidv4 } from 'uuid';
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GuestState {
    currentDraft: InvoiceFormValues;

    uiSettings: {
        showTax: boolean;
        showDiscount: boolean;
        showShipping: boolean;
        showBankDetails: boolean;
    };
    resetKey: number;

    setDraft: (data: Partial<InvoiceFormValues>) => void;
    toggleUiSetting: (key: keyof GuestState['uiSettings']) => void;
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

            uiSettings: {
                showTax: false,
                showDiscount: false,
                showShipping: false,
                showBankDetails: false
            },
            resetKey: 0,

            setDraft: (data) => 
                set((state) => ({
                    currentDraft: { ...state.currentDraft, ...data }, 
                })),


            toggleUiSetting: (key) => 
                set((state) => {
                    const isTurningOff = state.uiSettings[key];
                    const updates: Partial<InvoiceFormValues> = {};

                    if(isTurningOff) {
                        if(key === "showTax") updates.taxRate = 0;
                        if(key === "showDiscount") updates.discount = 0;
                        if(key === "showShipping") updates.shipping = 0;
                        if(key === "showBankDetails") {
                            updates.bankDetails = { bankName: "", accountName: "", accountNumber: "", ifscCode: "" };
                        }
                    }

                    return {
                        uiSettings: { ...state.uiSettings, [key]: !state.uiSettings[key] },
                        currentDraft: { ...state.currentDraft, ...updates },
                    };
                }),

            resetDraft: () => 
                set((state) => ({ 
                    currentDraft: DEFAULT_INVOICE,
                    uiSettings: { showTax: false, showDiscount: false, showShipping: false, showBankDetails: false },
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
                    state.currentDraft.issueDate = new Date(state.currentDraft.issueDate);
                    if(state.currentDraft.dueDate) state.currentDraft.dueDate = new Date(state.currentDraft.dueDate);
                }
            }
        }
    )
);
