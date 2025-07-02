import { Express } from "express";
import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentByIdController,
  getAppointmentsByUserIdController,
  getAppointmentsByDoctorIdController,
  updateAppointmentController,
  deleteAppointmentController
} from "./appointment.controller";

const appointment = (app: Express) => {
  app.route("/appointment").post(async (req, res, next) => {
    try {
      await createAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/appointment").get(async (req, res, next) => {
    try {
      await getAppointmentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/appointment/:id").get(async (req, res, next) => {
    try {
      await getAppointmentByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/appointment/user/:userID").get(async (req, res, next) => {
    try {
      await getAppointmentsByUserIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/appointment/doctor/:doctorID").get(async (req, res, next) => {
    try {
      await getAppointmentsByDoctorIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/appointment/:id").put(async (req, res, next) => {
    try {
      await updateAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/appointment/:id").delete(async (req, res, next) => {
    try {
      await deleteAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default appointment;
