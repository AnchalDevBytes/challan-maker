import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { invoiceSchema } from "../schemas/invoice.schema";
import { InvoiceService } from "../services/invoice.service";
import { ApiResponse } from "../utils/ApiResponse";

export const uploadLogo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) throw new AppError("Unauthorized", 401);
    if (!file) throw new AppError("No image file provided", 400);

    const result = await InvoiceService.uploadLogo(userId, file.buffer);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { url: result.url, publicId: result.publicId },
          "Logo uploaded successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const bodyData = req.body;

    if (!userId) throw new AppError("Unauthorized", 401);
    if (!bodyData) throw new AppError("Invoice data is required", 400);

    const result = await InvoiceService.createInvoice(userId, bodyData);

    if (result.deleteInvoiceId) {
      return {
        message: `Invoice created successfully. Oldest invoice (ID: ${result.deleteInvoiceId}) deleted to maintain limit of 5 invoices.`,
      };
    }

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { invoice: result.invoice },
          "Invoice created successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const invoiceId = req.params.id as string;
    const bodyData = req.body;

    if (!userId) throw new AppError("Unauthorized", 401);
    if (!invoiceId) throw new AppError("Invoice ID is required", 400);

    const updateInvoice = await InvoiceService.updateInvoice(
      userId,
      invoiceId,
      bodyData,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { invoice: updateInvoice },
          "Invoice updated successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const invoiceId = req.params.id as string;

    if (!userId) throw new AppError("Unauthorized", 401);
    if (!invoiceId) throw new AppError("Invoice ID is required", 400);

    await InvoiceService.deleteInvoice(userId, invoiceId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Invoice deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) throw new AppError("Unauthorized", 401);

    const invoices = await InvoiceService.getUserInvoices(userId);

    res
      .status(200)
      .json(
        new ApiResponse(200, { invoices }, "Invoices fetched successfully"),
      );
  } catch (error) {
    next(error);
  }
};
