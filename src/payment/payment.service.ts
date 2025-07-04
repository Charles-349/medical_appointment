import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIPayment, PaymentsTable } from "../Drizzle/schema";
// Import or define UpdatePayment type
import type { UpdatePayment } from "../Drizzle/schema";

// Create Payment
export const createPaymentService = async (payment: TIPayment) => {
  await db.insert(PaymentsTable).values(payment);
  return "Payment created successfully";
};

// Get all Payments
export const getPaymentsService = async () => {
  const payments = await db.query.PaymentsTable.findMany();
  return payments;
};

// Get Payment by ID
export const getPaymentByIdService = async (id: number) => {
  const payment = await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.paymentID, id)
  });
  return payment;
};

// Get Payment by AppointmentID
export const getPaymentByAppointmentIdService = async (appointmentID: number) => {
  const payment = await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.appointmentID, appointmentID)
  });
  return payment;
};





export const updatePaymentService = async (id: number, payment: UpdatePayment) => {
  // ✅ Remove undefined or null fields from the payload
  const cleaned = Object.fromEntries(
    Object.entries(payment).filter(([_, v]) => v !== undefined && v !== null)
  );

  // ✅ Add updatedAt every time
  const validFields: UpdatePayment = {
    ...cleaned,
    updatedAt: new Date(),
  };

  // ✅ If updatedAt is the only field left → skip
  if (Object.keys(validFields).length === 1) {
    throw new Error("No valid fields to update");
  }

  const updatedPayment = await db
    .update(PaymentsTable)
    .set(validFields)
    .where(eq(PaymentsTable.paymentID, id))
    .returning();

  if (updatedPayment.length === 0) {
    return null;
  }

  return "Payment updated successfully";
};



// Delete Payment
export const deletePaymentService = async (id: number) => {
  const deletedPayment = await db.delete(PaymentsTable)
    .where(eq(PaymentsTable.paymentID, id))
    .returning();

  if (deletedPayment.length === 0) {
    return null;
  }
  return "Payment deleted successfully";
};
