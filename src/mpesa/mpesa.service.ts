// import axios from "axios";
// import { eq } from "drizzle-orm";
// import db from "../Drizzle/db";
// import { PaymentsTable } from "../Drizzle/schema";
// import normalizePhoneNumber  from "../utils/normalizePhoneNumber";
// import { generatePassword, getAccessToken } from "../utils/mpesa.helper";

// // Initiate STK Push
// export const initiateStkPushService = async ({
//   phoneNumber,
//   amount,
//   paymentID,
// }: {
//   phoneNumber: string;
//   amount: number;
//   paymentID: number;
// }) => {
//   const normalizedPhone = normalizePhoneNumber(phoneNumber);

//   const token = await getAccessToken();
//   const { password, timestamp } = generatePassword();

//   const response = await axios.post(
//     `https://${process.env.MPESA_ENV === "sandbox" ? "sandbox" : "api"}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
//     {
//       BusinessShortCode: process.env.MPESA_SHORTCODE,
//       Password: password,
//       Timestamp: timestamp,
//       TransactionType: "CustomerPayBillOnline",
//       Amount: amount,
//       PartyA: normalizedPhone,
//       PartyB: process.env.MPESA_SHORTCODE,
//       PhoneNumber: normalizedPhone,
//       CallBackURL: `${process.env.MPESA_CALLBACK_URL}?paymentID=${paymentID}`,
//       AccountReference: "AppointmentBooking",
//       TransactionDesc: "Appointment Payment",
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data;
// };

// // Handle MPESA Callback
// export const handleMpesaCallbackService = async (
//   paymentID: number,
//   callbackBody: any
// ) => {
//   const stkCallback = callbackBody.Body?.stkCallback;

//   if (!stkCallback || stkCallback.ResultCode !== 0) return;

//   const mpesaReceipt = stkCallback.CallbackMetadata?.Item.find(
//     (item: any) => item.Name === "MpesaReceiptNumber"
//   )?.Value;

//   await db
//     .update(PaymentsTable)
//     .set({
//       paymentStatus: "Paid",
//       transactionID: mpesaReceipt,
//       updatedAt: new Date(),
//     })
//     .where(eq(PaymentsTable.paymentID, paymentID));
// };

import axios from "axios";
import { eq } from "drizzle-orm";
import { normalizePhoneNumber } from "../utils/normalizePhoneNumber";
import { AppointmentsTable, PaymentsTable } from "../Drizzle/schema";
import db from "../Drizzle/db";
import {getAccessToken, generatePassword} from "../utils/helper"

// console.log("Type of getAccessToken:", typeof getAccessToken);
// console.log("Type of generatePassword:", typeof generatePassword);


export const initiateStkPush = async ({
  phoneNumber,
  amount,
  paymentID,
}: {
  phoneNumber: string;
  amount: number;
  paymentID: number;
}) => {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  const token = await getAccessToken();
  const { password, timestamp } = generatePassword();
 try {
    const response = await axios.post(
      `https://${process.env.MPESA_ENV === "sandbox" ? "sandbox" : "api"}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: normalizedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: normalizedPhone,
        CallBackURL: `${process.env.MPESA_CALLBACK_URL}?paymentID=${paymentID}`,
        AccountReference: "AppointmentBooking",
        TransactionDesc: "Appointment Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error: any) {
    console.error("Safaricom STK Error:", error?.response?.data || error);
    throw error;
  }
};

export const handleMpesaCallback = async (
  paymentID: number,
  callbackBody: any
) => {
  const stkCallback = callbackBody.Body?.stkCallback;

  if (!stkCallback || stkCallback.ResultCode !== 0) return;

  const mpesaReceipt = stkCallback.CallbackMetadata?.Item.find(
    (item: any) => item.Name === "MpesaReceiptNumber"
  )?.Value;

  await db
    .update(PaymentsTable)
    .set({
      paymentStatus: "Paid",
      transactionID: mpesaReceipt,
      updatedAt: new Date(),
    })
    .where(eq(PaymentsTable.paymentID, paymentID));

    const payment = await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.paymentID, paymentID),
  });

  if (!payment) {
    console.error(`Payment ${paymentID} not found!`);
    return;
  }

  const appointmentID = payment.appointmentID;

  // Update the appointment status to "Confirmed"
  await db
    .update(AppointmentsTable)
    .set({
      appointmentStatus: "Confirmed",
      updatedAt: new Date(),
    })
    .where(eq(AppointmentsTable.appointmentID, appointmentID));

  console.log(
    `Payment ${paymentID} marked Paid, appointment ${appointmentID} Confirmed`
  );
};