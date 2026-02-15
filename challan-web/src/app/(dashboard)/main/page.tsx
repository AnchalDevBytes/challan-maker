"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import { Loader2, FileText, Edit, Eye, Trash2 } from "lucide-react";
import { InvoiceFormUI } from "@/components/invoice/invoice-form-ui";
import { SimpleMinimalTemplate } from "@/components/invoice/templates/simple-minimal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvoiceApi } from "@/services/invoice-api";
import { invoiceSchema, InvoiceFormValues } from "@/schemas/invoice.schema";
import { format } from "date-fns";
import { InvoiceHistoryItem, useAuthInvoiceStore } from "@/store/auth-invoice-store";
import { DashboardLayout } from "@/components/dashboard-layout";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { AuthBottomNav } from "@/components/auth-bottom-nav";
import { useAuthStore } from "@/store/auth-store";

const DEFAULT_INVOICE_VALUES: InvoiceFormValues = {
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

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [currentTab, setCurrentTab] = useState("create");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const { 
        activeInvoice, 
        setActiveInvoice, 
        invoiceList, 
        setInvoiceList, 
        addInvoiceToList,
        resetActiveInvoice 
    } = useAuthInvoiceStore();

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: activeInvoice,
        mode: "onChange"
    });

    const { watch, setValue, reset } = form;

    const handleResetMode = () => {
        setEditingId(null);
        setLogoFile(null);
        resetActiveInvoice();
        reset(DEFAULT_INVOICE_VALUES);
    }

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

    const handleLogoSelect = (base64: string, file?: File) => {
        setValue("logo", base64);
        if(file) setLogoFile(file);
    };

    const handleLogoRemove = () => {
        setValue("logo", null);
        setLogoFile(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const isValid = await form.trigger();
            if (!isValid) {
                toast.error("Please fix form errors before saving");
                return;
            }

            const data = form.getValues();
            if(logoFile) {
                toast.info("Uploading logo...");
                const logoUrl = await InvoiceApi.uploadLogo(logoFile);
                data.logo = logoUrl;
            }

            let savedInvoice: InvoiceHistoryItem;

            if(editingId) {
                const res = await InvoiceApi.updateInvoice(editingId, data);
                savedInvoice = res.invoice;

                const updateList = invoiceList.map((i) => i.id === editingId ? savedInvoice : i);
                setInvoiceList(updateList);
                toast.success("Invoice updated successfully");
            } else {
                const res = await InvoiceApi.createInvoice(data);
                savedInvoice = res.invoice;
                addInvoiceToList(savedInvoice);
                toast.success("Invoice created successfully");
            }

            const blob = await pdf(<SimpleMinimalTemplate data={data} removeBranding={true} />).toBlob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${data.invoiceNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            if(!editingId) {
                resetActiveInvoice();
                reset(activeInvoice);
                setLogoFile(null);
            } else {
                setEditingId(null);
                resetActiveInvoice();
                reset(activeInvoice);
                setLogoFile(null);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save invoice");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (invoice: any) => {
        const data = typeof invoice.invoiceData === "string" ? JSON.parse(invoice.invoiceData) : invoice.invoiceData;

        data.issueDate = new Date(data.issueDate);
        if(data.dueDate) data.dueDate = new Date(data.dueDate);

        reset(data);
        setActiveInvoice(data);
        setEditingId(invoice.id);
        setLogoFile(null);

        setCurrentTab("create");
        toast.info(`Editing invoice: ${data.invoiceNumber}`);
    }

    const handleDelete = async (id: string) => {
        if(!confirm("Are you sure you want to delete this invoice?")) return;

        try {
            await InvoiceApi.deleteInvoice(id);
            setInvoiceList(invoiceList.filter((i) => i.id !== id));
            toast.success("Invoice deleted!");
        } catch (error) {
            toast.error("Failed to delete invoice");
        }
    }

    const handleViewPDF = async (invoice: any) => {
        toast.info("Generating PDF...");
        try {
            const data = typeof invoice.invoiceData === "string" ? JSON.parse(invoice.invoiceData) : invoice.invoiceData;

            data.issueDate = new Date(data.issueDate);
            if(data.dueDate) data.dueDate = new Date(data.dueDate);

            const blob = await pdf(<SimpleMinimalTemplate data={data} removeBranding={true} />).toBlob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <DashboardLayout>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full space-y-6">
                <TabsContent value="create" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-neutral-800">
                            {editingId ? "Edit Invoice" : "New Invoice"}
                        </h2>

                        {editingId && (
                            <Button 
                                variant={"ghost"} 
                                size={"sm"} 
                                onClick={() => {
                                    setEditingId(null);
                                    resetActiveInvoice();
                                    reset(activeInvoice);
                                    setLogoFile(null);
                                }}
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <InvoiceFormUI 
                                form={form}
                                logo={activeInvoice.logo}
                                onLogoUpload={(base64, file) => {
                                    handleLogoSelect(base64, file);
                                }}
                                onLogoRemove={handleLogoRemove}
                            />
                        </div>

                        <div className="block sticky top-8 space-y-4">
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
                                        const dateObj = inv.createdAt ? new Date(inv.createdAt) : null;
                                        const dateString = dateObj && !isNaN(dateObj.getTime()) 
                                            ? format(dateObj, "dd MMM yyyy") 
                                            : "N/A";
                                        return (
                                            <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-10 w-10 bg-blue-50 text-blue rounded-full flex items-center justify-center shrink-0">
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
                                                    
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(inv)} title="Edit">
                                                        <Edit className="w-4 h-4 text-blue" />
                                                    </Button>
                                                    
                                                    <Button variant="ghost" size="icon" onClick={() => handleViewPDF(inv)} title="View PDF">
                                                        <Eye className="w-4 h-4 text-neutral-600" />
                                                    </Button>

                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)} title="Delete">
                                                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                                                    </Button>
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

            <AuthBottomNav
                onSave={handleSave}
                onReset={handleResetMode}
                isSaving={isSaving}
                activeTab={currentTab}
                onTabChange={setCurrentTab}
                userEmail={user?.email}
            />
        </DashboardLayout>
    );
}
