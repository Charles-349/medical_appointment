import { adminRoleAuth } from "../middleware/bearAuth";
import { createUserController,updateUserController,deleteUserController,getUserWithComplaintsController,getUserWithPrescriptionsController,getUserWithAppointmentsAndDoctorsController,getUserWithAppointmentsAndPaymentsController ,getUserWithAppointmentsController,getUserController,getUserByIdController, verifyUserController,userLoginController, resendVerificationCodeController } from "./user.controller";
import {Express} from "express";

const user = (app:Express) => {
    app.route("/user").post(async (req, res, next) =>{
        try {
            await createUserController(req, res);
            
        } catch (error) {
            next(error);
            
        }
    })
      //verify user route
    app.route("/user/verify").post(async (req, res, next) => {
        try {
            await verifyUserController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )

    //resend verification code route
    app.route("/user/resend-verification").post(async (req, res, next) => {
        try {
            await resendVerificationCodeController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )
     app.route("/user/login").post(async (req, res, next) => {
        try {
            await userLoginController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )
    app.route("/user").get(adminRoleAuth, async (req, res, next) => {
        try {
            await getUserController(req, res);
        } catch (error) {
            next(error);
        }
    })
    app.route("/user/:id").get(async (req, res, next) => {
        try {
            await getUserByIdController(req, res);
        } catch (error) {
            next(error);
        }
        
    });
    app.route("/user/:id").put(async (req, res, next) => {
        try {
            await updateUserController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )

    //delete user by id
    app.route("/user/:id").delete(async (req, res, next) => {
        try {
            await deleteUserController(req, res);
        } catch (error) {
            next(error);
        }
    }
    )

    // JOINS: Appointments
  app.route("/user/:id/appointments").get(async (req, res, next) => {
    try {
      await getUserWithAppointmentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //Appointments with Payments
  app.route("/user/:id/appointments-payments").get(async (req, res, next) => {
    try {
      await getUserWithAppointmentsAndPaymentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //Appointments with Doctors
  app.route("/user/:id/appointments-doctors").get(async (req, res, next) => {
    try {
      await getUserWithAppointmentsAndDoctorsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  //Prescriptions
  app.route("/user/:id/prescriptions").get(async (req, res, next) => {
    try {
      await getUserWithPrescriptionsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Complaints
  app.route("/user/:id/complaints").get(async (req, res, next) => {
    try {
      await getUserWithComplaintsController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default user;