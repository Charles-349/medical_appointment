// import { Express } from "express";
// import { initiateStkPushController, mpesaCallbackController } from "./mpesa.controller";

// const mpesa= (app: Express) => {
//   // Initiate STK Push
//   app.route("/mpesa/stk-push").post(async (req, res, next) => {
//     try {
//       await initiateStkPushController(req, res);
//     } catch (error) {
//       next(error);
//     }
//   });

//   // Safaricom Callback
//   app.route("/mpesa/callback").post(async (req, res, next) => {
//     try {
//       await mpesaCallbackController(req, res);
//     } catch (error) {
//       next(error);
//     }
//   });
// };

// export default mpesa;

import { Express } from "express";
import {
  stkPushController,
  mpesaCallbackController,
} from "./mpesa.controller";

console.log("Type of stkPushController:", typeof stkPushController);


export default (app: Express) => {
  //  console.log("Registering MPESA routes...");
  app.post("/mpesa/stk-push", stkPushController);
  app.post("/mpesa/callback", mpesaCallbackController);
};
