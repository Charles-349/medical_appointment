// import { Express } from "express";
// import {
//   createPaymentController,
//   getPaymentsController,
//   getPaymentByIdController,
//   getPaymentByAppointmentIdController,
//   updatePaymentController,
//   deletePaymentController
// } from "./payment.controller";

// const payment = (app: Express) => {
//   app.route("/payment").post(async (req, res, next) => {
//     try {
//       await createPaymentController(req, res);
//     } catch (error) {
//       next(error);
//     }
//   });

//   app.route("/payment").get(async (req, res, next) => {
//     try {
//       await getPaymentsController(req, res);
//     } catch (error) {
//       next(error);
//     }
//   });

//   app.route("/payment/:id").get(async (req, res, next) => {
//     try {
//       await getPaymentByIdController(req, res);
//     } catch (error) {
//       next(error);
//     }
//   });

//   app.route("/payment/appointment/:appointmentID").get(async (req, res, next) => {
//     try {
//       await getPaymentByAppointmentIdController(req, res);
//     } catch (error) {
//       next(error);
//     }
//   });

//   app.route("/payment/:id").put(async (req, res, next) => {
//     try {
//       await updatePaymentController(req, res);
//     } catch (error) {
//       next(error);
//     }
//   });

//   app.route("/payment/:id").delete(async (req, res, next) => {
//     try {
//       await deletePaymentController(req, res);
//     } catch (error) {
//       next(error);
//     }
//   });
// };

// export default payment;



import { Express } from "express";
import {
  createPaymentController,
  getPaymentsController,
  getPaymentByIdController,
  getPaymentByAppointmentIdController,
  updatePaymentController,
  deletePaymentController
} from "./payment.controller";

const payment = (app: Express) => {
  app.route("/payment").post(async (req, res, next) => {
    try {
      await createPaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/payment").get(async (req, res, next) => {
    try {
      await getPaymentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/payment/:id").get(async (req, res, next) => {
    try {
      await getPaymentByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/payment/appointment/:appointmentID").get(async (req, res, next) => {
    try {
      await getPaymentByAppointmentIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/payment/:id").put(async (req, res, next) => {
    try {
      await updatePaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/payment/:id").delete(async (req, res, next) => {
    try {
      await deletePaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default payment;

