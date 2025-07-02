import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIPrescription, PrescriptionsTable } from "../Drizzle/schema";

// Create Prescription
export const createPrescriptionService = async (prescription: TIPrescription) => {
  await db.insert(PrescriptionsTable).values(prescription);
  return "Prescription created successfully";
};

// Get all Prescriptions
export const getPrescriptionsService = async () => {
  const prescriptions = await db.query.PrescriptionsTable.findMany();
  return prescriptions;
};

// Get Prescription by ID
export const getPrescriptionByIdService = async (id: number) => {
  const prescription = await db.query.PrescriptionsTable.findFirst({
    where: eq(PrescriptionsTable.prescriptionID, id)
  });
  return prescription;
};

// Get Prescriptions by AppointmentID
export const getPrescriptionsByAppointmentIdService = async (appointmentID: number) => {
  const prescriptions = await db.query.PrescriptionsTable.findMany({
    where: eq(PrescriptionsTable.appointmentID, appointmentID)
  });
  return prescriptions;
};

// Get Prescriptions by DoctorID
export const getPrescriptionsByDoctorIdService = async (doctorID: number) => {
  const prescriptions = await db.query.PrescriptionsTable.findMany({
    where: eq(PrescriptionsTable.doctorID, doctorID)
  });
  return prescriptions;
};

// Get Prescriptions by UserID
export const getPrescriptionsByUserIdService = async (userID: number) => {
  const prescriptions = await db.query.PrescriptionsTable.findMany({
    where: eq(PrescriptionsTable.userID, userID)
  });
  return prescriptions;
};

// Update Prescription
export const updatePrescriptionService = async (id: number, prescription: TIPrescription) => {
  const updatedPrescription = await db.update(PrescriptionsTable)
    .set(prescription)
    .where(eq(PrescriptionsTable.prescriptionID, id))
    .returning();

  if (updatedPrescription.length === 0) {
    return null;
  }
  return "Prescription updated successfully";
};

// Delete Prescription
export const deletePrescriptionService = async (id: number) => {
  const deletedPrescription = await db.delete(PrescriptionsTable)
    .where(eq(PrescriptionsTable.prescriptionID, id))
    .returning();

  if (deletedPrescription.length === 0) {
    return null;
  }
  return "Prescription deleted successfully";
};
