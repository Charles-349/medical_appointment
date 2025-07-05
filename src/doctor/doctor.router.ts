import {
  createDoctorController,
  getDoctorsController,
  getDoctorByIdController,
  getDoctorBySpecializationController,
  updateDoctorController,
  deleteDoctorController,
  getDoctorPatientsController,
  getDoctorPrescriptionsController
} from "./doctor.controller";
import { Express } from "express";

const doctor = (app: Express) => {
  app.route("/doctor").post(async (req, res, next) => {
    try {
      await createDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/doctor").get(async (req, res, next) => {
    try {
      await getDoctorsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/doctor/:id").get(async (req, res, next) => {
    try {
      await getDoctorByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/doctor/specialization/:specialization").get(async (req, res, next) => {
    try {
      await getDoctorBySpecializationController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/doctor/:id").put(async (req, res, next) => {
    try {
      await updateDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/doctor/:id").delete(async (req, res, next) => {
    try {
      await deleteDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

    app.route("/doctor/:id/patients").get(async (req, res, next) => {
    try {
      await getDoctorPatientsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/doctor/:id/prescriptions").get(async (req, res, next) => {
    try {
      await getDoctorPrescriptionsController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default doctor;
