import { z } from "zod";

const detailsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    address: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
});

const itemSchema = z.object({
    id: z.string().optional(),
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
    
    // Coerce date strings to Date objects if coming from JSON
    issueDate: z.coerce.date(),
    dueDate: z.coerce.date().nullable().optional(),

    senderDetails: detailsSchema,
    clientDetails: detailsSchema,

    items: z.array(itemSchema).min(1, "Add at least one item"),

    currency: z.string().default("INR"),
    taxRate: z.number().min(0).max(100).default(0),
    discount: z.number().min(0).default(0),
    shipping: z.number().min(0).default(0),

    notes: z.string().optional().default(""),
    terms: z.string().optional().default(""),

    logo: z.string().nullable().optional(),

    bankDetails: bankDetailsSchema.optional(),

    status: z.enum(["DRAFT", "PENDING", "PAID", "OVERDUE"]).default("DRAFT"),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof itemSchema>;
