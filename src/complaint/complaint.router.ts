import { Express } from "express";
import {
  createComplaintController,
  getComplaintsController,
  getComplaintByIdController,
  getComplaintsByUserIdController,
  getComplaintsByAppointmentIdController,
  updateComplaintController,
  deleteComplaintController
} from "./complaint.controller";

const complaint = (app: Express) => {
  app.route("/complaint").post(async (req, res, next) => {
    try {
      await createComplaintController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/complaint").get(async (req, res, next) => {
    try {
      await getComplaintsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/complaint/:id").get(async (req, res, next) => {
    try {
      await getComplaintByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/complaint/user/:userID").get(async (req, res, next) => {
    try {
      await getComplaintsByUserIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/complaint/appointment/:appointmentID").get(async (req, res, next) => {
    try {
      await getComplaintsByAppointmentIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/complaint/:id").put(async (req, res, next) => {
    try {
      await updateComplaintController(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.route("/complaint/:id").delete(async (req, res, next) => {
    try {
      await deleteComplaintController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default complaint;
