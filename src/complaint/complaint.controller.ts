import { Request, Response } from "express";
import {
  createComplaintService,
  getComplaintsService,
  getComplaintByIdService,
  getComplaintsByUserIdService,
  getComplaintsByAppointmentIdService,
  updateComplaintService,
  deleteComplaintService
} from "./complaint.service";

// Create Complaint
export const createComplaintController = async (req: Request, res: Response) => {
  try {
    const complaint = req.body;

    if (!complaint.userID || !complaint.subject) {
      return res.status(400).json({
        message: "UserID and Subject are required"
      });
    }

    const created = await createComplaintService(complaint);
    if (!created) {
      return res.status(400).json({ message: "Complaint not created" });
    }

    return res.status(201).json({ message: created });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all Complaints
export const getComplaintsController = async (_req: Request, res: Response) => {
  try {
    const complaints = await getComplaintsService();

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found" });
    }

    return res.status(200).json({ message: "Complaints retrieved successfully", complaints });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Complaint by ID
export const getComplaintByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    const complaint = await getComplaintByIdService(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json({ message: "Complaint retrieved successfully", complaint });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Complaints by UserID
export const getComplaintsByUserIdController = async (req: Request, res: Response) => {
  try {
    const userID = parseInt(req.params.userID);

    if (isNaN(userID)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const complaints = await getComplaintsByUserIdService(userID);
    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this user" });
    }

    return res.status(200).json({ message: "Complaints retrieved successfully", complaints });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Complaints by AppointmentID
export const getComplaintsByAppointmentIdController = async (req: Request, res: Response) => {
  try {
    const appointmentID = parseInt(req.params.appointmentID);

    if (isNaN(appointmentID)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const complaints = await getComplaintsByAppointmentIdService(appointmentID);
    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this appointment" });
    }

    return res.status(200).json({ message: "Complaints retrieved successfully", complaints });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Complaint
export const updateComplaintController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    const complaint = req.body;
       if (!complaint || Object.keys(complaint).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const existing = await getComplaintByIdService(id);
    if (!existing) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const updated = await updateComplaintService(id, complaint);
    if (!updated) {
      return res.status(400).json({ message: "Complaint not updated" });
    }

    return res.status(200).json({ message: updated });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete Complaint
export const deleteComplaintController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    const existing = await getComplaintByIdService(id);
    if (!existing) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const deleted = await deleteComplaintService(id);
    if (!deleted) {
      return res.status(400).json({ message: "Complaint not deleted" });
    }

    return res.status(200).json({ message: deleted });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
