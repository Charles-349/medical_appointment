import { Request, Response } from 'express';
import {
  createDoctorService,
  getDoctorsService,
  getDoctorByIdService,
  getDoctorBySpecializationService,
  updateDoctorService,
  deleteDoctorService,
  getDoctorPatientsService,
  getDoctorPrescriptionsService
} from './doctor.service';

// Create doctor
export const createDoctorController = async (req: Request, res: Response) => {
  try {
    const doctor = req.body;

    if (!doctor.firstName || !doctor.lastName || !doctor.specialization) {
      return res.status(400).json({
        message: "First name, last name, and specialization are required"  });   
    }

    const created = await createDoctorService(doctor);

    if (!created) {
      return res.status(400).json({ message: "Doctor not created" });
    }

    return res.status(201).json({ message: created });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all doctors
export const getDoctorsController = async (_req: Request, res: Response) => {
  try {
    const doctors = await getDoctorsService();

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    return res.status(200).json({ message: "Doctors retrieved successfully", doctors });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get doctor by ID
export const getDoctorByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const doctor = await getDoctorByIdService(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ message: "Doctor retrieved successfully", doctor });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get doctor by specialization
export const getDoctorBySpecializationController = async (req: Request, res: Response) => {
  try {
    const specialization = req.params.specialization;

    if (!specialization) {
      return res.status(400).json({ message: "Specialization is required" });
    }

    const doctors = await getDoctorBySpecializationService(specialization);

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found for this specialization" });
    }

    return res.status(200).json({
      message: "Doctors retrieved successfully",
      doctors
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update doctor
export const updateDoctorController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const doctor = req.body;
     if (!doctor || Object.keys(doctor).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const existing = await getDoctorByIdService(id);
    if (!existing) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const updated = await updateDoctorService(id, doctor);
    if (!updated) {
      return res.status(400).json({ message: "Doctor not updated" });
    }

    return res.status(200).json({ message: updated });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete doctor
export const deleteDoctorController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const existing = await getDoctorByIdService(id);
    if (!existing) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const deleted = await deleteDoctorService(id);
    if (!deleted) {
      return res.status(400).json({ message: "Doctor not deleted" });
    }

    return res.status(200).json({ message: deleted });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};


// Get doctor with patients 
export const getDoctorPatientsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid doctor ID" });

    const data = await getDoctorPatientsService(id);
    if (!data) return res.status(404).json({ message: "Doctor or patients not found" });

    return res.status(200).json({ message: "Doctor patients retrieved successfully", data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get doctor with prescriptions
export const getDoctorPrescriptionsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid doctor ID" });

    const data = await getDoctorPrescriptionsService(id);
    if (!data) return res.status(404).json({ message: "Doctor or prescriptions not found" });

    return res.status(200).json({ message: "Doctor prescriptions retrieved successfully", data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
