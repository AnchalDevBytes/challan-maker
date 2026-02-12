import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { invoiceSchema } from "../schemas/invoice.schema";
import { InvoiceService } from "../services/invoice.service";
import { ApiResponse } from "../utils/ApiResponse";

export const createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const file = req.file;
        const bodyData = req.body.data;

        if(!userId) throw new AppError("Unauthorized", 401);
        if(!file) throw new AppError("Invoice PDF is required", 400);
        if(!bodyData) throw new AppError("Invoice data is required", 400); 

        let parsedData;

        try {
            parsedData = JSON.parse(bodyData);
            invoiceSchema.parse(parsedData);
        } catch (error) {
            throw new AppError("Invalid invoice data format", 400);
        }

        const result = await InvoiceService.createInvoice(userId, parsedData, file.buffer);

        if(result.deleteInvoiceId) {
            message: `Invoice created successfully. Oldest invoice (ID: ${result.deleteInvoiceId}) deleted to maintain limit of 5 invoices.`
        }

        res.status(201).json(
            new ApiResponse(201, { invoice: result.invoice }, "Invoice created successfully")
        )
        
    } catch (error) {
        next(error);
    }
};

export const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        
        if(!userId) throw new AppError("Unauthorized", 401);

        const invoices = await InvoiceService.getUserInvoices(userId);

        res.status(200).json(
            new ApiResponse(200, { invoices }, "Invoices fetched successfully")
        );
    } catch (error) {
        next(error);
    }
};
