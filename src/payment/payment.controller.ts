import { Request, Response } from "express";
import {
  createPaymentService,
  getPaymentsService,
  getPaymentByIdService,
  getPaymentByAppointmentIdService,
  updatePaymentService,
  deletePaymentService
} from "./payment.service";
import { TIPayment, UpdatePayment } from "../Drizzle/schema";

// Create Payment
export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const payment = req.body;

    if (!payment.appointmentID || !payment.amount || !payment.paymentDate) {
      return res.status(400).json({
        message: "AppointmentID, Amount, and Payment Date are required"
      });
    }

    const created = await createPaymentService(payment);
    if (!created) {
      return res.status(400).json({ message: "Payment not created" });
    }

    return res.status(201).json({ message: "Payment created successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all Payments
export const getPaymentsController = async (_req: Request, res: Response) => {
  try {
    const payments = await getPaymentsService();

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments found" });
    }

    return res.status(200).json({ message: "Payments retrieved successfully", payments });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Payment by ID
export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }

    const payment = await getPaymentByIdService(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({ message: "Payment retrieved successfully", payment });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Payment by Appointment ID
export const getPaymentByAppointmentIdController = async (req: Request, res: Response) => {
  try {
    const appointmentID = parseInt(req.params.appointmentID);

    if (isNaN(appointmentID)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const payment = await getPaymentByAppointmentIdService(appointmentID);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found for this appointment" });
    }

    return res.status(200).json({ message: "Payment retrieved successfully", payment });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePaymentController = async (req: Request, res: Response) => {
  try {
    
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }

   
    const payment: UpdatePayment = req.body;
     if (!payment || Object.keys(payment).length === 0) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    const existingPayment = await getPaymentByIdService(id);
    if (!existingPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    const result = await updatePaymentService(id, payment);

    if (!result) {
      return res.status(400).json({ message: "Payment not updated" });
    }
    return res.status(200).json({ message: result });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Delete Payment
export const deletePaymentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }

    const existing = await getPaymentByIdService(id);
    if (!existing) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const deleted = await deletePaymentService(id);
    if (!deleted) {
      return res.status(400).json({ message: "Payment not deleted" });
    }

    return res.status(200).json({ message: deleted });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
