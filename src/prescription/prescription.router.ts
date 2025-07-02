import { Express } from "express";
import {
  createPrescriptionController,
  getPrescriptionsController,
  getPrescriptionByIdController,
  getPrescriptionsByAppointmentIdController,
  getPrescriptionsByDoctorIdController,
  getPrescriptionsByUserIdController,
  updatePrescriptionController,
  deletePrescriptionController
} from "./prescription.controller";

const prescription = (app: Express) => {
  app.route("/prescription").post(async (req, res, next) => {
    try {
      await createPrescriptionController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/prescription").get(async (req, res, next) => {
    try {
      await getPrescriptionsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/prescription/:id").get(async (req, res, next) => {
    try {
      await getPrescriptionByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/prescription/appointment/:appointmentID").get(async (req, res, next) => {
    try {
      await getPrescriptionsByAppointmentIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/prescription/doctor/:doctorID").get(async (req, res, next) => {
    try {
      await getPrescriptionsByDoctorIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/prescription/user/:userID").get(async (req, res, next) => {
    try {
      await getPrescriptionsByUserIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/prescription/:id").put(async (req, res, next) => {
    try {
      await updatePrescriptionController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/prescription/:id").delete(async (req, res, next) => {
    try {
      await deletePrescriptionController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default prescription;
