"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import {
  Loader2,
  FileText,
  Edit,
  Eye,
  Trash2,
  History,
  Receipt,
} from "lucide-react";
import { InvoiceFormUI } from "@/components/invoice/invoice-form-ui";
import { SimpleMinimalTemplate } from "@/components/invoice/templates/simple-minimal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { InvoiceApi } from "@/services/invoice-api";
import { invoiceSchema, InvoiceFormValues } from "@/schemas/invoice.schema";
import { format } from "date-fns";
import {
  InvoiceHistoryItem,
  useAuthInvoiceStore,
} from "@/store/auth-invoice-store";
import { DashboardLayout } from "@/components/dashboard-layout";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { AuthBottomNav } from "@/components/auth-bottom-nav";
import { useAuthStore } from "@/store/auth-store";
import PreviewTabSwitcher from "@/components/preview-tab-switcher";

const DEFAULT_INVOICE_VALUES: InvoiceFormValues = {
  invoiceNumber: "",
  issueDate: new Date(),
  dueDate: null,
  senderDetails: { name: "", address: "", email: "", phone: "" },
  clientDetails: { name: "", address: "", email: "", phone: "" },
  items: [
    { id: uuidv4(), description: "Service Charge", quantity: 1, unitPrice: 0 },
  ],
  currency: "INR",
  taxRate: 0,
  discount: 0,
  shipping: 0,
  logo: null,
  bankDetails: {
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
  },
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
  const [mobilePreviewTab, setMobilePreviewTab] = useState<"form" | "preview">(
    "form",
  );

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const {
    activeInvoice,
    setActiveInvoice,
    invoiceList,
    setInvoiceList,
    addInvoiceToList,
    resetActiveInvoice,
    resetInvoiceKey,
  } = useAuthInvoiceStore();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: activeInvoice,
    mode: "onChange",
  });

  const { watch, setValue, reset } = form;

  const handleResetMode = () => {
    setEditingId(null);
    setLogoFile(null);
    resetActiveInvoice();
    reset(DEFAULT_INVOICE_VALUES);
  };

  useEffect(() => {
    const subscription = watch((value) => {
      const safeValues = {
        ...value,
        items: value.items ? [...value.items] : [],
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
    if (file) setLogoFile(file);
  };

  const handleLogoRemove = () => {
    setValue("logo", null);
    setLogoFile(null);
  };

  const triggerPdfDownload = (data: InvoiceFormValues) => {
    setTimeout(async () => {
      try {
        const blob = await pdf(
          <SimpleMinimalTemplate data={data} removeBranding={true} />,
        ).toBlob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${data.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("PDF generation failed:", err);
        toast.error("PDF download failed. Please try again.");
      }
    }, 100);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const data = form.getValues();
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fix form errors before saving");
        return;
      }

      if (logoFile) {
        toast.info("Uploading logo...");
        const logoUrl = await InvoiceApi.uploadLogo(logoFile);
        data.logo = logoUrl;
      }

      let savedInvoice: InvoiceHistoryItem;

      if (editingId) {
        const res = await InvoiceApi.updateInvoice(editingId, data);
        savedInvoice = res.invoice;
        const updateList = invoiceList.map((i) =>
          i.id === editingId ? savedInvoice : i,
        );
        setInvoiceList(updateList);
        toast.success("Invoice updated successfully");
      } else {
        const res = await InvoiceApi.createInvoice(data);
        savedInvoice = res.invoice;
        addInvoiceToList(savedInvoice);
        toast.success("Invoice created successfully");
      }

      handleResetMode();
      reset(DEFAULT_INVOICE_VALUES);

      triggerPdfDownload(data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save invoice");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (invoice: any) => {
    const data =
      typeof invoice.invoiceData === "string"
        ? JSON.parse(invoice.invoiceData)
        : invoice.invoiceData;

    data.issueDate = new Date(data.issueDate);
    if (data.dueDate) data.dueDate = new Date(data.dueDate);

    reset(data);
    setActiveInvoice(data);
    setEditingId(invoice.id);
    setLogoFile(null);

    setCurrentTab("create");
    toast.info(`Editing invoice: ${data.invoiceNumber}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      await InvoiceApi.deleteInvoice(id);
      setInvoiceList(invoiceList.filter((i) => i.id !== id));
      toast.success("Invoice deleted!");
    } catch (error) {
      toast.error("Failed to delete invoice");
    }
  };

  const handleViewPDF = async (invoice: any) => {
    toast.info("Generating PDF...");
    try {
      const data =
        typeof invoice.invoiceData === "string"
          ? JSON.parse(invoice.invoiceData)
          : invoice.invoiceData;

      data.issueDate = new Date(data.issueDate);
      if (data.dueDate) data.dueDate = new Date(data.dueDate);

      const blob = await pdf(
        <SimpleMinimalTemplate data={data} removeBranding={true} />,
      ).toBlob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <DashboardLayout>
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="w-full space-y-6 p-4 sm:p-0"
      >
        <TabsContent
          value="create"
          className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-xl font-semibold text-neutral-800">
              {editingId ? "Edit Invoice" : "New Invoice"}
            </h2>

            {editingId && (
              <Button variant={"ghost"} size={"sm"} onClick={handleResetMode}>
                Cancel Edit
              </Button>
            )}
          </div>

          <PreviewTabSwitcher
            mobilePreviewTab={mobilePreviewTab}
            setMobilePreviewTab={setMobilePreviewTab}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pb-10">
            <div
              className={cn(
                "space-y-4",
                mobilePreviewTab === "preview" ? "hidden lg:block" : "block",
              )}
            >
              <InvoiceFormUI
                key={resetInvoiceKey}
                form={form}
                logo={activeInvoice.logo}
                onLogoUpload={(base64, file) => {
                  handleLogoSelect(base64, file);
                }}
                onLogoRemove={handleLogoRemove}
              />
            </div>

            <div
              className={cn(
                "space-y-4 lg:sticky lg:top-8",
                mobilePreviewTab === "form" ? "hidden lg:block" : "block",
              )}
            >
              <InvoicePreview data={activeInvoice} removeBranding={true} />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="history"
          className="pb-10  w-full max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-10 lg:mb-14 mt-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-linear-to-br from-dark-blue to-blue flex items-center justify-center shadow-sm">
                <History className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-neutral-900 leading-tight">
                  Invoice History
                </h2>
                <p className="text-xs text-neutral-400 leading-tight">
                  Your saved & generated invoices
                </p>
              </div>
            </div>
            {invoiceList.length > 0 && (
              <span className="text-xs font-medium bg-neutral-100 text-neutral-500 px-2.5 py-1 rounded-full">
                {invoiceList.length}{" "}
                {invoiceList.length === 1 ? "invoice" : "invoices"}
              </span>
            )}
          </div>

          {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <Loader2 className="w-7 h-7 animate-spin mb-3" />
              <p className="text-sm font-medium">Loading invoices…</p>
            </div>
          ) : invoiceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <div className="h-16 w-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8 opacity-30" />
              </div>
              <p className="font-medium text-sm text-neutral-500">
                No invoices yet
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Create your first invoice to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {invoiceList.map((inv) => {
                const dateObj = inv.createdAt ? new Date(inv.createdAt) : null;
                const dateString =
                  dateObj && !isNaN(dateObj.getTime())
                    ? format(dateObj, "dd MMM yyyy")
                    : "N/A";

                const statusStyles: Record<string, string> = {
                  PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
                  DRAFT: "bg-slate-50 text-slate-500 border-slate-100",
                  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
                  OVERDUE: "bg-red-50 text-red-600 border-red-100",
                };
                const statusClass =
                  statusStyles[inv.status] ??
                  "bg-neutral-50 text-neutral-500 border-neutral-100";

                return (
                  <div
                    key={inv.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-3.5 border border-blue/30 bg-blue/2 sm:border-neutral-200 rounded-xl sm:hover:border-blue/30 sm:hover:bg-blue/2 sm:hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-linear-to-br from-dark-blue to-blue flex items-center justify-center shrink-0 shadow-sm">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-neutral-900 truncate">
                            {inv.invoiceNumber}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-medium px-1.5 py-0.5 rounded-md border capitalize leading-none",
                              statusClass,
                            )}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {inv.customerName}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {dateString}
                        </p>
                      </div>
                    </div>

                    {/* Right — amount + actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pl-12 sm:pl-0">
                      <p className="font-bold text-sm text-neutral-900 tabular-nums">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(Number(inv.totalAmount))}
                      </p>

                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(inv)}
                          title="Edit"
                          className="h-8 w-8 rounded-lg text-neutral-400 hover:text-blue hover:bg-blue/10"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewPDF(inv)}
                          title="View PDF"
                          className="h-8 w-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(inv.id)}
                          title="Delete"
                          className="h-8 w-8 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
