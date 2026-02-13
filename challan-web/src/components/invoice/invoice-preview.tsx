"use client";
import { useGuestStore } from "@/store/guest-store";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { InvoiceFormValues } from "@/schemas/invoice.schema";

interface PreviewProps {
  data?: InvoiceFormValues;
  removeBranding?: boolean;
}

export default function InvoicePreview({ data, removeBranding }: PreviewProps) {
  const store = useGuestStore();
  const currentDraft = data || store.currentDraft;

  const showBranding = removeBranding === undefined ? !data : !removeBranding;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currentDraft.currency || 'INR',
    }).format(amount);
  };

  const subTotal = currentDraft.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = (subTotal * (currentDraft.taxRate || 0)) / 100;
  const discountAmount = currentDraft.discount || 0;
  const shippingAmount = currentDraft.shipping || 0;
  const total = subTotal + taxAmount + shippingAmount - discountAmount;

  return (
    <div className="w-full bg-white shadow-lg border border-neutral-200 min-h-250 p-8 md:p-12 text-sm text-neutral-800 font-sans relative overflow-hidden">
      {showBranding && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03]">
          <span className="text-9xl font-bold -rotate-45 text-black text-center">CHALLAN MAKER</span>
        </div>
      )}

      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">{currentDraft.senderDetails.name}</h1>
            
            <div className="text-neutral-500 whitespace-pre-line text-xs max-w-48">
              {currentDraft.senderDetails.address}
              {currentDraft.senderDetails.email && <div>{currentDraft.senderDetails.email}</div>}
              {currentDraft.senderDetails.phone && <div>{currentDraft.senderDetails.phone}</div>}
            </div>
          </div>

          <div className="text-right">
            {currentDraft.logo &&
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentDraft.logo} alt="Logo" className="w-32 h-auto object-contain mb-4" /> 
            }
          </div>
        </div>

        <h2 className="text-2xl font-medium text-neutral-900 uppercase tracking-wide mb-8 text-center">
            INVOICE
        </h2>

        <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
              {(currentDraft.clientDetails.name || currentDraft.clientDetails.address) && <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Bill To :</h3>}
              <p className="font-semibold text-sm">{currentDraft.clientDetails.name}</p>
              <div className="text-neutral-500 whitespace-pre-line text-xs leading-relaxed">
                  {currentDraft.clientDetails.address}
                  {currentDraft.clientDetails.email && <div>{currentDraft.clientDetails.email}</div>}
                  {currentDraft.clientDetails.phone && <div>{currentDraft.clientDetails.phone}</div>}
              </div>
            </div>

          <div className="text-right">
            <div className="space-y-1">
              {currentDraft.invoiceNumber && (
                <div className="flex justify-between gap-8">
                  <span className="text-neutral-500 font-medium">Invoice No:</span>
                  <span className="font-semibold">{currentDraft.invoiceNumber}</span>
                </div>
              )}
              {currentDraft.issueDate && (
                <div className="flex justify-between gap-8">
                  <span className="text-neutral-500 font-medium">Issue Date:</span>
                  <span>{format(new Date(currentDraft.issueDate), "dd MMM yyyy")}</span>
                </div>
              )}
              {currentDraft.dueDate && (
                <div className="flex justify-between gap-8">
                  <span className="text-neutral-500 font-medium">Due Date:</span>
                  <span>{currentDraft.dueDate && format(new Date(currentDraft.dueDate), "dd MMM yyyy")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-neutral-900 text-xs uppercase tracking-wider">
              <th className="py-3 font-bold text-neutral-900">Description</th>
              <th className="py-3 text-right font-bold text-neutral-900">Qty</th>
              <th className="py-3 text-right font-bold text-neutral-900">Price</th>
              <th className="py-3 text-right font-bold text-neutral-900">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {currentDraft.items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 pr-4 align-top">{item.description || "Item Name"}</td>
                <td className="py-3 text-right align-top">{item.quantity}</td>
                <td className="py-3 text-right align-top">          {formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-right font-medium align-top">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            {currentDraft.taxRate > 0 && (
              <div className="flex justify-between text-neutral-500">
                <span>Tax ({currentDraft.taxRate}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
            )}
            {currentDraft.discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
             {currentDraft.shipping > 0 && (
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>{formatCurrency(shippingAmount)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold text-neutral-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
          <div>
            {(currentDraft.bankDetails?.accountNumber || currentDraft.bankDetails?.bankName || currentDraft.bankDetails?.ifscCode || currentDraft.bankDetails?.accountName) && (
              <h4 className="font-bold text-xs uppercase text-neutral-500 mb-1">Bank Details</h4>
            )}
            <div className="text-xs text-neutral-600 space-y-0.5">
              {currentDraft.bankDetails?.bankName && <p><span className="font-medium">Bank:</span> {currentDraft.bankDetails?.bankName}</p>}
              
              {currentDraft.bankDetails?.accountNumber && <p><span className="font-medium">Account:</span> {currentDraft.bankDetails?.accountNumber}</p>}
              
              {currentDraft.bankDetails?.accountName && <p><span className="font-medium">Name:</span> {currentDraft.bankDetails?.accountName}</p>}

              {currentDraft.bankDetails?.ifscCode && <p><span className="font-medium">IFSC:</span> {currentDraft.bankDetails?.ifscCode}</p>}
            </div>
          </div>

          <div className="text-right">
             <h4 className="font-bold text-xs uppercase text-neutral-500 mb-1">Notes</h4>
             <p className="text-xs text-neutral-600 whitespace-pre-line">{currentDraft.notes}</p>
             {currentDraft.terms && 
              <>
                <h4 className="font-bold text-xs uppercase text-neutral-500 mt-5">Terms</h4>
                <p className="text-xs text-neutral-500 whitespace-pre-line mt-1">{currentDraft.terms}</p>
              </>
             }
          </div>
        </div>
      </div>
    </div>
  );
}
