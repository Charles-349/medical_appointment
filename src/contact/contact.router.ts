import { Express } from "express";
import { createContactController } from "./contact.controller";

const contact = (app: Express) => {
  app.route("/api/contact").post(async (req, res, next) => {
    try {
      await createContactController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default contact;
