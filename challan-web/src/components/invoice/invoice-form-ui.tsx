"use client";
import { useRef } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Trash2, Plus, Upload, X, Landmark, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { InvoiceFormValues } from "@/schemas/invoice.schema";
import { cn } from "@/lib/utils";

interface InvoiceFormUIProps {
    form: UseFormReturn<InvoiceFormValues>;
    logo: string | null;
    onLogoUpload: (base64: string) => void;
    onLogoRemove: () => void;
    uiSettings: {
        showTax: boolean;
        showDiscount: boolean;
        showShipping: boolean;
        showBankDetails: boolean;
    };
}

export function InvoiceFormUI({ form, logo, onLogoUpload, onLogoRemove, uiSettings }: InvoiceFormUIProps) {
    const { register, control, watch, setValue, formState: { errors } } = form;
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.warning("File size too large. Max 1MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onLogoUpload(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        onLogoRemove();
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const watchedItems = watch("items");
    const subTotal = watchedItems?.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0) || 0;
    
    const getVal = (key: any) => Number(watch(key) || 0);
    
    const taxRate = uiSettings.showTax ? getVal("taxRate") : 0;
    const taxAmount = (subTotal * taxRate) / 100;
    const discount = uiSettings.showDiscount ? getVal("discount") : 0;
    const shipping = uiSettings.showShipping ? getVal("shipping") : 0;
    const grandTotal = subTotal + taxAmount + shipping - discount;
    const currency = watch("currency");

    return (
        <Card className="w-full bg-white shadow-sm border-neutral-200 overflow-hidden">
            <div className="p-8 sm:p-10 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between gap-8">
                    <div className="flex-1 space-y-4 sm:text-left">
                        <div className="flex flex-col sm:items-start gap-1">
                            <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Invoice No. <span className="text-red-500">*</span></Label>
                            <Input 
                                {...register("invoiceNumber")} 
                                className={cn(
                                    "w-full sm:w-48 text-left font-mono font-medium",
                                    errors.invoiceNumber &&  "border-red-500 focus-visible:ring-red-500"
                                )}
                                placeholder="INV-001" 
                            />
                            {errors.invoiceNumber && (
                                <span className="text-[10px] text-red-500 font-medium">{errors.invoiceNumber.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col sm:items-start gap-1">
                            <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Invoice Date <span className="text-red-500">*</span></Label>
                            <Input  
                                type="date" 
                                {...register("issueDate", { valueAsDate: true })} 
                                className={cn(
                                    "w-full sm:w-48 text-left block",
                                    errors.issueDate && "border-red-500 focus-visible:ring-red-500"
                                )} 
                            />
                            {errors.issueDate && (
                                <span className="text-[10px] text-red-500 font-medium">{errors.issueDate.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col sm:items-start gap-1">
                            <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Due Date</Label>
                            <Input type="date" {...register("dueDate")} className="w-full sm:w-48 text-left block" />
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Company Logo</Label>
                        {logo ? (
                            <div className="relative w-32 h-32 group">
                                <img src={logo} alt="Company Logo" className="w-full h-full object-contain rounded-lg border border-neutral-100" />
                                <button type="button" onClick={handleRemoveLogo} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                            </div>
                        ) : (
                            <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors">
                                <Upload className="text-neutral-300 mb-2" size={24} />
                                <span className="text-xs text-neutral-400 font-medium">Upload Logo</span>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">Bill From</h3>
                        <div className="space-y-3">
                            <div>
                                <Input 
                                    {...register("senderDetails.name")} placeholder="Company Name" 
                                    className={cn(errors.senderDetails?.name && "border-red-500 focus-visible:ring-red-500")}
                                />
                                {errors.senderDetails?.name && (
                                    <span className="text-[10px] text-red-500 font-medium">{errors.senderDetails.name.message}</span>
                                )}
                            </div>
                            <Textarea {...register("senderDetails.address")} placeholder="Street Address, City, Zip" rows={3} className="resize-none" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">Bill To</h3>
                        <div className="space-y-3">
                            <div>
                                <Input 
                                    {...register("clientDetails.name")}
                                    placeholder="Client Name" 
                                    className={cn(errors.clientDetails?.name && "border-red-500 focus-visible:ring-red-500")}
                                />
                                {errors.clientDetails?.name && <span className="text-[10px] text-red-500 ml-1">{errors.clientDetails.name.message}</span>}
                            </div>

                            <Textarea {...register("clientDetails.address")} placeholder="Client Address" rows={3} className="resize-none" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                        <span>Items</span>
                        {errors.items && !Array.isArray(errors.items) && (
                            <span className="text-xs text-red-500 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {(errors.items as any).message}
                            </span>
                        )}
                    </h3>
                    <div 
                        className={cn(
                            "border rounded-lg overflow-hidden",
                            errors.items && !Array.isArray(errors.items) ? "border-red-300" : "border-neutral-200"
                        )}
                    >
                        <div className="grid grid-cols-12 bg-neutral-50 border-b border-neutral-200 px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            <div className="col-span-5">Description</div>
                            <div className="col-span-2 text-right">Qty</div>
                            <div className="col-span-3 text-right">Price</div>
                            <div className="col-span-2"></div>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 px-4 py-3 items-center gap-4 hover:bg-neutral-50/50">
                                    <input type="hidden" {...register(`items.${index}.id`)} />
                                    
                                    <div className="col-span-6">
                                        <Input 
                                            {...register(`items.${index}.description`)} 
                                            placeholder="Item description"
                                            className={cn(
                                                "border-transparent bg-transparent px-2 h-9",
                                                errors.items?.[index]?.description && "border-red-300 focus-visible:ring-red-300 bg-red-50"
                                            )} 
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Input 
                                            type="number" 
                                            {...register(`items.${index}.quantity`, { valueAsNumber: true })} 
                                            className={cn(
                                                "text-right border-transparent bg-transparent px-2 h-9",
                                                errors.items?.[index]?.quantity && "border-red-300 focus-visible:ring-red-300 bg-red-50"
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <Input 
                                            type="number" 
                                            {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} 
                                            className={cn(
                                                "text-right border-transparent bg-transparent px-2 h-9",
                                                errors.items?.[index]?.unitPrice && "border-red-300 focus-visible:ring-red-300 bg-red-50"
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-1 text-right">
                                        <button type="button" onClick={() => remove(index)} className="text-neutral-300 hover:text-red-500 p-1" disabled={fields.length === 1}>
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
                                className="text-blue"
                            >
                                <Plus size={14} className="mr-2" /> 
                                Add Line Item
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex-1" />
                    <div className="flex-1 md:w-80 space-y-3">
                        <div className="flex justify-between text-sm py-2">
                            <span className="text-neutral-500">Subtotal</span>
                            <span className="font-medium text-neutral-900">{subTotal.toFixed(2)}</span>
                        </div>

                        {uiSettings.showTax && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500">Tax (%)</span>
                                <div className="flex items-center gap-2">
                                    {taxRate > 0 && <span className="text-xs text-neutral-400 font-mono">(+ {currency} {taxAmount.toFixed(2)})</span>}
                                    <Input type="number" {...register("taxRate", { valueAsNumber: true })} className="w-20 text-right h-8" />
                                </div>
                            </div>
                        )}

                        {uiSettings.showDiscount && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500">Discount</span>
                                <Input type="number" {...register("discount", { valueAsNumber: true })} className="w-20 text-right h-8" />
                            </div>
                        )}

                        {uiSettings.showShipping && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500">Shipping</span>
                                <Input type="number" {...register("shipping", { valueAsNumber: true })} className="w-20 text-right h-8" />
                            </div>
                        )}

                        <Separator className="my-2" />

                        <div className="flex justify-between items-center bg-blue text-white p-4 rounded-lg shadow-lg">
                            <span className="font-medium">Total</span>
                            <span className="text-lg font-bold">{currency} {grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div>
                    {uiSettings.showBankDetails && (
                        <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
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
                        <Textarea {...register("notes")} className="resize-none h-20 bg-neutral-50/50" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label className="text-xs font-semibold text-neutral-500 uppercase">Terms</Label>
                        <Textarea {...register("terms")} className="h-20 resize-none bg-neutral-50/50" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
