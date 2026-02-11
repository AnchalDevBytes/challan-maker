import { z } from "zod";

const detailsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    address: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
});

const itemSchema = z.object({
    id: z.string(),
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Price cannot be negative"),
});

const bankDetailsSchema = z.object({
    bankName: z.string().optional(),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().optional()
});

export const invoiceSchema = z.object({
    invoiceNumber: z.string().min(1, "Invoice No. is required"),

    issueDate: z.date().refine((date) => date instanceof Date, "Issue Date is required"),
    dueDate: z.date().nullable().optional().default(null),

    senderDetails: detailsSchema,
    clientDetails: detailsSchema,

    items: z.array(itemSchema).min(1, "Add at least one item"),

    currency: z.string().default("INR"),
    taxRate: z.number().min(0).max(100).default(0),
    discount: z.number().min(0).default(0),
    shipping: z.number().min(0).default(0),

    notes: z.string().default(""),
    terms: z.string().default(""),

    logo: z.string().nullable().default(null),

    bankDetails: bankDetailsSchema.optional(),

    status: z.enum(["DRAFT", "GENERATED"]).default("DRAFT"),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof itemSchema>;
