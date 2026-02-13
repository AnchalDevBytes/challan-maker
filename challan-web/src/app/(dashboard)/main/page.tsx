"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import { Loader2, Plus, History, Save, FileText, ExternalLink } from "lucide-react";
import { InvoiceFormUI } from "@/components/invoice/invoice-form-ui";
import { SimpleMinimalTemplate } from "@/components/invoice/templates/simple-minimal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvoiceApi } from "@/services/invoice-api";
import { invoiceSchema, InvoiceFormValues } from "@/schemas/invoice.schema";
import { format } from "date-fns";
import { useAuthInvoiceStore } from "@/store/auth-invoice-store";
import { DashboardLayout } from "@/components/dashboard-layout";
import InvoicePreview from "@/components/invoice/invoice-preview";

export default function DashboardPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    
    const { 
        activeInvoice, 
        setActiveInvoice, 
        invoiceList, 
        setInvoiceList, 
        addInvoiceToList 
    } = useAuthInvoiceStore();

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: activeInvoice,
        mode: "onChange"
    });

    const { watch, setValue } = form;

    useEffect(() => {
        const subscription = watch((value) => {
            const safeValues = {
                ...value,
                items: value.items ? [...value.items] : []
            };
            setActiveInvoice(safeValues as Partial<InvoiceFormValues>);
        });
        return () => subscription.unsubscribe();
    }, [watch, setActiveInvoice]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const invoices = await InvoiceApi.getUserInvoices();
                setInvoiceList(invoices);
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Failed to load invoice history");
            } finally {
                setIsLoadingHistory(false);
            }
        };
        loadHistory();
    }, [setInvoiceList]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const isValid = await form.trigger();
            if (!isValid) {
                toast.error("Please fix form errors before saving");
                return;
            }

            const data = form.getValues();
            const blob = await pdf(<SimpleMinimalTemplate data={data} removeBranding={true} />).toBlob();

            const { invoice, message } = await InvoiceApi.createInvoice(data, blob);

            addInvoiceToList(invoice);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${invoice.invoiceNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(message || "Invoice saved successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save invoice");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = (base64: string) => setValue("logo", base64);
    const handleLogoRemove = () => setValue("logo", null);

    return (
        <DashboardLayout>
            <Tabs defaultValue="create" className="w-full space-y-6">
                <div className="flex justify-between items-center">
                    <TabsList className="grid w-75 grid-cols-2">
                        <TabsTrigger value="create" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> New Invoice
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <History className="w-4 h-4" /> History
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={isSaving} className="bg-blue hover:bg-dark-blue text-white shadow-sm">
                            {isSaving ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> Save & Generate</>
                            )}
                        </Button>
                    </div>
                </div>

                <TabsContent value="create" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <InvoiceFormUI 
                                form={form}
                                logo={activeInvoice.logo}
                                onLogoUpload={handleLogoUpload}
                                onLogoRemove={handleLogoRemove}
                                uiSettings={{ showTax: true, showDiscount: true, showShipping: true, showBankDetails: true }}
                            />
                        </div>

                        <div className="block sticky top-24 space-y-4">
                            <InvoicePreview data={activeInvoice} removeBranding={true} /> 
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardContent className="p-6">
                            {isLoadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                    <p>Loading invoices...</p>
                                </div>
                            ) : invoiceList.length === 0 ? (
                                <div className="text-center py-12 text-neutral-500">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No invoices found. Create your first one!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {invoiceList.map((inv) => {
                                        const dateObj = inv.createdAt ? new Date(inv.createdAt) : new Date();
                                        const dateString = !isNaN(dateObj.getTime()) 
                                            ? format(dateObj, "dd MMM yyyy, hh:mm a") 
                                            : "N/A";
                                        return (
                                            <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-neutral-900">{inv.invoiceNumber}</span>
                                                            <Badge variant="outline" className="text-[10px] px-1.5 h-5 text-neutral-500">
                                                                {inv.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-neutral-500">{inv.customerName}</p>
                                                        <p className="text-xs text-neutral-400 mt-1">
                                                            {dateString}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 sm:text-right">
                                                    <div className="mr-4">
                                                        <p className="font-bold text-neutral-900">
                                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(inv.totalAmount))}
                                                        </p>
                                                    </div>
                                                    
                                                    {inv.pdfUrl ? (
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                                View PDF
                                                            </a>
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-red-400">PDF Unavailable</span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}
