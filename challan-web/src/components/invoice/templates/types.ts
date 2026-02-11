import { InvoiceFormValues } from "@/schemas/invoice.schema";

export interface InvoiceTemplateProps {
    data: InvoiceFormValues;
}

export type TemplateId  = 'simple-minimal' | 'modern-bold' | 'corporate-blue';
