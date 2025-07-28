// import { eq } from "drizzle-orm";
// import db from "../Drizzle/db";
// import { TIPayment, PaymentsTable, AppointmentsTable } from "../Drizzle/schema";
// import type { UpdatePayment } from "../Drizzle/schema";

// // Create Payment
// export const createPaymentService = async (payment: TIPayment) => {
//   const inserted = await db.insert(PaymentsTable).values(payment).returning();

//   if (inserted.length) {
//     await db
//       .update(AppointmentsTable)
//       .set({ appointmentStatus: "Confirmed" })
//       .where(eq(AppointmentsTable.appointmentID, payment.appointmentID));
//   }

//   return inserted[0];
// };

// // Get all Payments
// export const getPaymentsService = async () => {
//   const payments = await db.query.PaymentsTable.findMany();
//   return payments;
// };

// // Get Payment by ID
// export const getPaymentByIdService = async (id: number) => {
//   const payment = await db.query.PaymentsTable.findFirst({
//     where: eq(PaymentsTable.paymentID, id)
//   });
//   return payment;
// };

// // Get Payment by AppointmentID
// export const getPaymentByAppointmentIdService = async (appointmentID: number) => {
//   const payment = await db.query.PaymentsTable.findFirst({
//     where: eq(PaymentsTable.appointmentID, appointmentID)
//   });
//   return payment;
// };





// export const updatePaymentService = async (id: number, payment: UpdatePayment) => {
//   //Remove undefined or null fields from the payload
//   const cleaned = Object.fromEntries(
//     Object.entries(payment).filter(([_, v]) => v !== undefined && v !== null)
//   );

//   // Add updatedAt every time
//   const validFields: UpdatePayment = {
//     ...cleaned,
//     updatedAt: new Date(),
//   };

//   // skip if updatedAt is the only field left
//   if (Object.keys(validFields).length === 1) {
//     throw new Error("No valid fields to update");
//   }

//   const updatedPayment = await db
//     .update(PaymentsTable)
//     .set(validFields)
//     .where(eq(PaymentsTable.paymentID, id))
//     .returning();

//   if (updatedPayment.length === 0) {
//     return null;
//   }

//   return "Payment updated successfully";
// };



// // Delete Payment
// export const deletePaymentService = async (id: number) => {
//   const deletedPayment = await db.delete(PaymentsTable)
//     .where(eq(PaymentsTable.paymentID, id))
//     .returning();

//   if (deletedPayment.length === 0) {
//     return null;
//   }
//   return "Payment deleted successfully";
// };


import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIPayment, PaymentsTable, AppointmentsTable } from "../Drizzle/schema";
import type { UpdatePayment } from "../Drizzle/schema";

//Import MPESA utils
import { getAccessToken, generatePassword } from "../utils/helper";
import axios from "axios";
import {normalizePhoneNumber} from "../utils/normalizePhoneNumber";

// Create Payment — with STK Push
export const createPaymentService = async (payment: TIPayment & { phoneNumber: string }) => {
  const inserted = await db.insert(PaymentsTable).values({
    appointmentID: payment.appointmentID,
    amount: payment.amount,
    paymentStatus: "Pending",
    paymentDate: payment.paymentDate,
    
  }).returning();

  if (!inserted.length) return null;

  // Initiate STK Push
  const token = await getAccessToken();
  const { password, timestamp } = generatePassword();
  const normalizedPhone = normalizePhoneNumber(payment.phoneNumber);

  await axios.post(
    `https://${process.env.MPESA_ENV === "sandbox" ? "sandbox" : "api"}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: payment.amount,
      PartyA: normalizedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: `${process.env.MPESA_CALLBACK_URL}?paymentID=${inserted[0].paymentID}`,
      AccountReference: "AppointmentBooking",
      TransactionDesc: "Appointment Payment",
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return inserted[0];
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

// Update Payment 
export const updatePaymentService = async (id: number, payment: UpdatePayment) => {
  const cleaned = Object.fromEntries(
    Object.entries(payment).filter(([_, v]) => v !== undefined && v !== null)
  );

  const validFields: UpdatePayment = {
    ...cleaned,
    updatedAt: new Date(),
  };

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

