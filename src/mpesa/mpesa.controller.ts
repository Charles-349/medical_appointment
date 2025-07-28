// import { Request, Response } from "express";
// import { handleMpesaCallbackService, initiateStkPushService } from "./mpesa.service";

// // Initiate STK Push Controller
// export const initiateStkPushController = async (req: Request, res: Response) => {
//   try {
//     const { phoneNumber, amount, paymentID } = req.body;

//     if (!phoneNumber || !amount || !paymentID) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     const data = await initiateStkPushService({
//       phoneNumber,
//       amount: Number(amount),
//       paymentID: Number(paymentID),
//     });

//     return res.status(200).json({
//       success: true,
//       data,
//     });
//   } catch (error: any) {
//     console.error("STK Push Error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "STK Push failed",
//     });
//   }
// };

// // MPESA Callback Controller
// export const mpesaCallbackController = async (req: Request, res: Response) => {
//   try {
//     const paymentIDParam = req.query.paymentID;
//     const paymentID = Number(paymentIDParam);

//     if (isNaN(paymentID)) {
//       return res.status(400).json({
//         message: "Invalid or missing paymentID",
//       });
//     }

//     await handleMpesaCallbackService(paymentID, req.body);

//     return res.status(200).json({
//       message: "Callback processed successfully",
//     });
//   } catch (error: any) {
//     console.error("Callback Error:", error.message);
//     return res.status(500).json({
//       message: "Failed to handle callback",
//     });
//   }
// };


import { Request, Response, RequestHandler } from "express";
import {
  initiateStkPush,
  handleMpesaCallback,
} from "./mpesa.service";
// console.log("LOADED: mpesa.controller.ts");


// STK Push Controller
export const stkPushController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    console.log("stkPushController called!");
  try {
    const { phoneNumber, amount, paymentID } = req.body;
    console.log("Missing field. Returning 400");

    if (!phoneNumber || !amount || !paymentID) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const data = await initiateStkPush({
      phoneNumber,
      amount: Number(amount),
      paymentID: Number(paymentID),
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error("STK Push Error:", (error as Error).message);
    res.status(500).json({ success: false, message: "STK push failed" });
  }
};

export const mpesaCallbackController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentIDParam = req.query.paymentID;
    const paymentID = Number(paymentIDParam);

    if (isNaN(paymentID)) {
      res.status(400).json({ message: "Invalid or missing payment_id" });
      return;
    }

    await handleMpesaCallback(paymentID, req.body);

    res.status(200).json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Callback Error:", (error as Error).message);
    res.status(500).json({ message: "Failed to handle callback" });
  }
};


