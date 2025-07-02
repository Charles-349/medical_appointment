import { Request, Response } from "express";
import {
  createPrescriptionService,
  getPrescriptionsService,
  getPrescriptionByIdService,
  getPrescriptionsByAppointmentIdService,
  getPrescriptionsByDoctorIdService,
  getPrescriptionsByUserIdService,
  updatePrescriptionService,
  deletePrescriptionService
} from "./prescription.service";

// Create Prescription
export const createPrescriptionController = async (req: Request, res: Response) => {
  try {
    const prescription = req.body;

    if (!prescription.appointmentID || !prescription.doctorID || !prescription.userID) {
      return res.status(400).json({
        message: "AppointmentID, DoctorID, and UserID are required"
      });
    }

    const created = await createPrescriptionService(prescription);
    if (!created) {
      return res.status(400).json({ message: "Prescription not created" });
    }

    return res.status(201).json({ message: created });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all Prescriptions
export const getPrescriptionsController = async (_req: Request, res: Response) => {
  try {
    const prescriptions = await getPrescriptionsService();

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found" });
    }

    return res.status(200).json({ message: "Prescriptions retrieved successfully", prescriptions });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Prescription by ID
export const getPrescriptionByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prescription ID" });
    }

    const prescription = await getPrescriptionByIdService(id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    return res.status(200).json({ message: "Prescription retrieved successfully", prescription });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Prescriptions by AppointmentID
export const getPrescriptionsByAppointmentIdController = async (req: Request, res: Response) => {
  try {
    const appointmentID = parseInt(req.params.appointmentID);

    if (isNaN(appointmentID)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const prescriptions = await getPrescriptionsByAppointmentIdService(appointmentID);
    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for this appointment" });
    }

    return res.status(200).json({ message: "Prescriptions retrieved successfully", prescriptions });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Prescriptions by DoctorID
export const getPrescriptionsByDoctorIdController = async (req: Request, res: Response) => {
  try {
    const doctorID = parseInt(req.params.doctorID);

    if (isNaN(doctorID)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const prescriptions = await getPrescriptionsByDoctorIdService(doctorID);
    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for this doctor" });
    }

    return res.status(200).json({ message: "Prescriptions retrieved successfully", prescriptions });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Prescriptions by UserID
export const getPrescriptionsByUserIdController = async (req: Request, res: Response) => {
  try {
    const userID = parseInt(req.params.userID);

    if (isNaN(userID)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const prescriptions = await getPrescriptionsByUserIdService(userID);
    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for this user" });
    }

    return res.status(200).json({ message: "Prescriptions retrieved successfully", prescriptions });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Prescription
export const updatePrescriptionController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prescription ID" });
    }

    const prescription = req.body;

    const existing = await getPrescriptionByIdService(id);
    if (!existing) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const updated = await updatePrescriptionService(id, prescription);
    if (!updated) {
      return res.status(400).json({ message: "Prescription not updated" });
    }

    return res.status(200).json({ message: updated });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete Prescription
export const deletePrescriptionController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prescription ID" });
    }

    const existing = await getPrescriptionByIdService(id);
    if (!existing) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const deleted = await deletePrescriptionService(id);
    if (!deleted) {
      return res.status(400).json({ message: "Prescription not deleted" });
    }

    return res.status(200).json({ message: deleted });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
