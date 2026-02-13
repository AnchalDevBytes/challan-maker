"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGuestStore } from "@/store/guest-store";
import { invoiceSchema, InvoiceFormValues } from "@/schemas/invoice.schema";
import { InvoiceFormUI } from "./invoice/invoice-form-ui";

export default function GuestInvoiceFormContainer() {
    const { currentDraft, setDraft, setLogo, uiSettings } = useGuestStore();

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: {
            ...currentDraft,
            issueDate: new Date(currentDraft.issueDate),
            dueDate: currentDraft.dueDate ? new Date(currentDraft.dueDate) : null
        },
        mode: "onChange",
    });

    const { watch, setValue } = form;

    useEffect(() => {
        const subscription = watch((value) => {
            const safeValues = {
                ...value,
                items: value.items ? [...value.items] : []
            };
            setDraft(safeValues as Partial<InvoiceFormValues>); 
        });
        return () => subscription.unsubscribe();
    }, [watch, setDraft]);

    useEffect(() => {
        if (!uiSettings.showTax) setValue("taxRate", 0);
        if (!uiSettings.showDiscount) setValue("discount", 0);
        if (!uiSettings.showShipping) setValue("shipping", 0);
        if(!uiSettings.showBankDetails) {
            setValue("bankDetails.bankName", "");
            setValue("bankDetails.accountName", "");
            setValue("bankDetails.accountNumber", "");
            setValue("bankDetails.ifscCode", "");
        }
    }, [uiSettings, setValue]);

    const handleLogoUpload = (base64: string) => {
        setLogo(base64);
        setValue("logo", base64);
    };

    const handleLogoRemove = () => {
        setLogo(null);
        setValue("logo", null);
    };

    return (
        <InvoiceFormUI 
            form={form} 
            logo={currentDraft.logo}
            onLogoUpload={handleLogoUpload}
            onLogoRemove={handleLogoRemove}
            uiSettings={uiSettings}
        />
    );
}
