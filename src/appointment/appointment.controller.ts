import { Request, Response } from "express";
import {
  createAppointmentService,
  getAppointmentsService,
  getAppointmentByIdService,
  getAppointmentsByUserIdService,
  getAppointmentsByDoctorIdService,
  updateAppointmentService,
  deleteAppointmentService,
} from "./appointment.service";

// Create Appointment
export const createAppointmentController = async (req: Request, res: Response) => {
  try {
    const appointment = req.body;

    if (!appointment.userID || !appointment.doctorID || !appointment.appointmentDate || !appointment.timeSlot) {
      return res.status(400).json({
        message: "UserID, DoctorID, Appointment Date, and Time Slot are required"
      });
    }

    const created = await createAppointmentService(appointment);
    if (!created) {
      return res.status(400).json({ message: "Appointment not created" });
    }

    return res.status(201).json({ message: created });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all Appointments
export const getAppointmentsController = async (_req: Request, res: Response) => {
  try {
    const appointments = await getAppointmentsService();

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    return res.status(200).json({ message: "Appointments retrieved successfully", appointments });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Appointment by ID
export const getAppointmentByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = await getAppointmentByIdService(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({ message: "Appointment retrieved successfully", appointment });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Appointments by UserID
export const getAppointmentsByUserIdController = async (req: Request, res: Response) => {
  try {
    const userID = parseInt(req.params.userID);

    if (isNaN(userID)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const appointments = await getAppointmentsByUserIdService(userID);
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this user" });
    }

    return res.status(200).json({ message: "Appointments retrieved successfully", appointments });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Appointments by DoctorID
export const getAppointmentsByDoctorIdController = async (req: Request, res: Response) => {
  try {
    const doctorID = parseInt(req.params.doctorID);

    if (isNaN(doctorID)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const appointments = await getAppointmentsByDoctorIdService(doctorID);
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this doctor" });
    }

    return res.status(200).json({ message: "Appointments retrieved successfully", appointments });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Appointment
export const updateAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = req.body;

    const existing = await getAppointmentByIdService(id);
    if (!existing) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const updated = await updateAppointmentService(id, appointment);
    if (!updated) {
      return res.status(400).json({ message: "Appointment not updated" });
    }

    return res.status(200).json({ message: updated });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete Appointment
export const deleteAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const existing = await getAppointmentByIdService(id);
    if (!existing) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const deleted = await deleteAppointmentService(id);
    if (!deleted) {
      return res.status(400).json({ message: "Appointment not deleted" });
    }

    return res.status(200).json({ message: deleted });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
