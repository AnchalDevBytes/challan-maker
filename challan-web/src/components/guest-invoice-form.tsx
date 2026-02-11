"use client";
import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, Upload, X, Landmark } from "lucide-react";
import { useGuestStore } from "@/store/guest-store";
import { invoiceSchema, InvoiceFormValues } from "@/schemas/invoice.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function GuestInvoiceForm() {
    const { currentDraft, setDraft, setLogo, uiSettings } = useGuestStore();
  
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: {
        ...currentDraft,
        issueDate: new Date(currentDraft.issueDate),
        dueDate: currentDraft.dueDate ? new Date(currentDraft.dueDate) : null
        },
        mode: "onChange",
    });

    const { register, control, watch, setValue, formState: { errors } } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    useEffect(() => {
        const subscription = watch((value) => {
            const safeValues = {
                ...value,
                items: value.items ? [...value.items] : []
            };
            // @ts-ignore - Partial update is safe here
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

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        if (file.size > 1024 * 1024) {
            toast.warning("File size too large. Max 1MB for guest.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setLogo(base64);
            setValue("logo", base64);
        };
        reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogo(null);
        setValue("logo", null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const watchedItems = watch("items");
    const subTotal = watchedItems?.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0) || 0;

    const taxRate = uiSettings.showTax ? (watch("taxRate") || 0) : 0;
    const taxAmount = (subTotal * taxRate) / 100;

    const discount = uiSettings.showDiscount ? (watch("discount") || 0) : 0;
    const shipping = uiSettings.showShipping ? (watch("shipping") || 0) : 0;

    const grandTotal = subTotal + taxAmount + shipping - discount;

  return (
    <Card className="w-full bg-white shadow-sm border-neutral-200 overflow-hidden">
        <div className="p-8 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between gap-8">
                <div className="flex-1 space-y-4 sm:text-left">
                    <div className="flex flex-col sm:items-start gap-1">
                        <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Invoice No.
                        </Label>
                        <Input 
                            {...register("invoiceNumber")} 
                            className="w-full sm:w-48 text-left font-mono font-medium" 
                            placeholder="INV-001"
                        />
                    </div>

                    <div className="flex flex-col sm:items-start gap-1">
                        <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Invoice Date
                        </Label>
                        <Input 
                            type="date" 
                            {...register("issueDate", { valueAsDate: true })} 
                            className="w-full sm:w-48 text-left block" 
                        />
                    </div>

                    <div className="flex flex-col sm:items-start gap-1">
                        <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Due Date
                        </Label>
                        <Input 
                            type="date" 
                            {...register("dueDate", { valueAsDate: true })} 
                            className="w-full sm:w-48 text-left block" 
                        />
                    </div>
                </div>


                <div className="flex flex-col items-end">
                    <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">
                        Company Logo
                    </Label>
                    {currentDraft.logo ? (
                        <div className="relative w-32 h-32 group">
                            <img 
                                src={currentDraft.logo} 
                                alt="Company Logo" 
                                className="w-full h-full object-contain rounded-lg border border-neutral-100" 
                            />
                            <button 
                                onClick={removeLogo}
                                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors"
                        >
                            <Upload className="text-neutral-300 mb-2" size={24} />
                            <span className="text-xs text-neutral-400 font-medium">Upload Logo</span>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleLogoUpload} 
                                accept="image/*" 
                                className="hidden" 
                            />
                        </div>
                    )}
                </div>                
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                        Bill From
                    </h3>
                    <div className="space-y-3">
                        <Input {...register("senderDetails.name")} placeholder="Company Name" />
                        <Textarea 
                            {...register("senderDetails.address")} 
                            placeholder="Street Address, City, Zip" 
                            rows={3} 
                            className="resize-none"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                        Bill To
                    </h3>
                    <div className="space-y-3">
                        <Input {...register("clientDetails.name")} placeholder="Client Name" />
                        <Textarea 
                            {...register("clientDetails.address")} 
                            placeholder="Client Address" 
                            rows={3} 
                            className="resize-none"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Items</h3>
                
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-neutral-50 border-b border-neutral-200 px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        <div className="col-span-5">Description</div>
                        <div className="col-span-2 text-right">Qty</div>
                        <div className="col-span-3 text-right">Price</div>
                        <div className="col-span-2"></div>
                    </div>

                    <div className="divide-y divide-neutral-100">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 px-4 py-3 items-center gap-4 hover:bg-neutral-50/50 transition-colors group">
                                <input type="hidden" {...register(`items.${index}.id`)} />
                            
                                <div className="col-span-6">
                                    <Input 
                                        {...register(`items.${index}.description`)} 
                                        placeholder="Item description" 
                                        className="border-transparent hover:border-neutral-200 focus:border-blue bg-transparent px-2 h-9"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input 
                                        type="number" 
                                        {...register(`items.${index}.quantity`, { valueAsNumber: true })} 
                                        className="text-right border-transparent hover:border-neutral-200 focus:border-blue bg-transparent px-2 h-9"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Input 
                                        type="number" 
                                        {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} 
                                        className="text-right border-transparent hover:border-neutral-200 focus:border-blue bg-transparent px-2 h-9"
                                    />
                                </div>
                                <div className="col-span-1 text-right">
                                    <button 
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-2 border-t border-neutral-100 bg-neutral-50/30">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => append({ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 })}
                            className="text-blue hover:text-dark-blue hover:bg-blue-50"
                        >
                            <Plus size={14} className="mr-2" />
                            Add Line Item
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-10">
                <div className="flex-1"/>
                <div className="flex-1 md:w-80 space-y-3">
                    <div className="flex justify-between text-sm py-2">
                        <span className="text-neutral-500">Subtotal</span>
                        <span className="font-medium text-neutral-900">{subTotal.toFixed(2)}</span>
                    </div>

                    {uiSettings.showTax && (
                        <div className="flex justify-between items-center text-sm animate-in slide-in-from-right-4 fade-in duration-300">
                            <span className="text-neutral-500">Tax (%)</span>
                            <div className="flex items-center gap-2">
                                {taxRate > 0 && (
                                    <span className="text-xs text-neutral-400 font-mono">
                                    (+ {watch("currency")} {taxAmount.toFixed(2)})
                                    </span>
                                )}
                                <Input 
                                    type="number" 
                                    {...register("taxRate", { valueAsNumber: true })} 
                                    className="w-20 text-right h-8" 
                                />
                            </div>
                            
                        </div>
                    )}

                    {uiSettings.showDiscount && (
                        <div className="flex justify-between items-center text-sm animate-in slide-in-from-right-4 fade-in duration-300">
                            <span className="text-neutral-500">Discount</span>
                            <Input type="number" {...register("discount", { valueAsNumber: true })} className="w-20 text-right h-8" />
                        </div>
                    )}

                    {uiSettings.showShipping && (
                        <div className="flex justify-between items-center text-sm animate-in slide-in-from-right-4 fade-in duration-300">
                            <span className="text-neutral-500">Shipping</span>
                            <Input type="number" {...register("shipping", { valueAsNumber: true })} className="w-20 text-right h-8" />
                        </div>
                    )}

                    <Separator className="my-2" />

                    <div className="flex justify-between items-center bg-blue text-white p-4 rounded-lg shadow-lg shadow-neutral-200">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-bold">
                            {watch("currency")} {grandTotal.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                {uiSettings.showBankDetails && (
                    <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-100 animate-in slide-in-from-top-2 duration-300">
                        <Label className="text-xs font-semibold text-neutral-500 uppercase flex items-center gap-2">
                        <Landmark className="w-3 h-3" /> Bank Details
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <Input {...register("bankDetails.bankName")} placeholder="Bank Name" className="bg-white h-8 text-sm" />
                            <Input {...register("bankDetails.accountName")} placeholder="Account Holder" className="bg-white h-8 text-sm" />
                            <Input {...register("bankDetails.accountNumber")} placeholder="Account No." className="bg-white h-8 text-sm" />
                            <Input {...register("bankDetails.ifscCode")} placeholder="IFSC / SWIFT" className="bg-white h-8 text-sm" />
                        </div>
                    </div>
                )}
            </div>

            
            <div className="flex justify-between space-x-4">
                <div className="flex-1 space-y-2">
                    <Label className="text-xs font-semibold text-neutral-500 uppercase">Notes</Label>
                    <Textarea 
                        {...register("notes")} 
                        placeholder="Thanks for your business..." 
                        className="resize-none h-20 bg-neutral-50/50"
                    />
                </div>

                <div className="flex-1 space-y-2">
                    <Label className="text-xs font-semibold text-neutral-500 uppercase">Terms</Label>
                    <Textarea {...register("terms")} placeholder="Payment terms..." className="h-20 resize-none bg-neutral-50/50" />
                </div>
            </div>
        </div>
    </Card>
  );
}
