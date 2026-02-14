"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGuestStore } from "@/store/guest-store";
import { invoiceSchema, InvoiceFormValues } from "@/schemas/invoice.schema";
import { InvoiceFormUI } from "./invoice/invoice-form-ui";
import { toast } from "sonner";
import { SimpleMinimalTemplate } from "./invoice/templates/simple-minimal";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { GuestBottomNav } from "./guest-bottom-nav";

export default function GuestInvoiceFormContainer() {
    const { currentDraft, setDraft, setLogo } = useGuestStore();
    const [isDownloading, setIsDownloading] = useState(false);

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: {
            ...currentDraft,
            issueDate: new Date(currentDraft.issueDate),
            dueDate: currentDraft.dueDate ? new Date(currentDraft.dueDate) : null
        },
        mode: "onChange",
    });

    const { watch, setValue, trigger, getValues } = form;

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

    const handleLogoUpload = (base64: string) => {
        setLogo(base64);
        setValue("logo", base64);
    };

    const handleLogoRemove = () => {
        setLogo(null);
        setValue("logo", null);
    };

    const handleDownload = async () => {
        const isValid = await trigger();
        if (!isValid) {
            toast.error("Please fix form errors before downloading");
            return;
        }

        setIsDownloading(true);
        toast.info("Generating PDF...");

        try {
            const validData = getValues();

            const Template = SimpleMinimalTemplate;

            const blob = await pdf(<Template data={validData}/>).toBlob();
            saveAs(blob, `${validData.invoiceNumber || "invoice"}.pdf`);
            toast.success("PDF downloaded successfully");
            } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF");
            } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <InvoiceFormUI 
                form={form} 
                logo={currentDraft.logo}
                onLogoUpload={handleLogoUpload}
                onLogoRemove={handleLogoRemove}
            />

            <GuestBottomNav
                onDownload={handleDownload}
                isDownloading={isDownloading}
            />
        </>
    );
}
