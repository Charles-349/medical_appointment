
import { Request, Response } from "express";
import { createContactService } from "./contact.service";

export const createContactController = async (req: Request, res: Response) => {
  try {
    const contact = req.body;

    if (!contact.name || !contact.email || !contact.phone || !contact.message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await createContactService(contact);

    return res
      .status(201)
      .json({ message: "Message received! We'll get back to you shortly." });
      
  } catch (error: any) {
    console.error("Contact creation error:", error);
    return res.status(500).json({ message: error.message || "Server error." });
  }
};








