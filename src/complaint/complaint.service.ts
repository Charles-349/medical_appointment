import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIComplaint, ComplaintsTable } from "../Drizzle/schema";

// Create Complaint
export const createComplaintService = async (complaint: TIComplaint) => {
  await db.insert(ComplaintsTable).values(complaint);
  return "Complaint created successfully";
};

// Get all Complaints
export const getComplaintsService = async () => {
  const complaints = await db.query.ComplaintsTable.findMany();
  return complaints;
};

// Get Complaint by ID
export const getComplaintByIdService = async (id: number) => {
  const complaint = await db.query.ComplaintsTable.findFirst({
    where: eq(ComplaintsTable.complaintID, id)
  });
  return complaint;
};

// Get Complaints by UserID
export const getComplaintsByUserIdService = async (userID: number) => {
  const complaints = await db.query.ComplaintsTable.findMany({
    where: eq(ComplaintsTable.userID, userID)
  });
  return complaints;
};

// Get Complaints by AppointmentID
export const getComplaintsByAppointmentIdService = async (appointmentID: number) => {
  const complaints = await db.query.ComplaintsTable.findMany({
    where: eq(ComplaintsTable.relatedAppointmentID, appointmentID)
  });
  return complaints;
};

// Update Complaint
export const updateComplaintService = async (id: number, complaint: TIComplaint) => {
  const updatedComplaint = await db.update(ComplaintsTable)
    .set(complaint)
    .where(eq(ComplaintsTable.complaintID, id))
    .returning();

  if (updatedComplaint.length === 0) {
    return null;
  }
  return "Complaint updated successfully";
};

// Delete Complaint
export const deleteComplaintService = async (id: number) => {
  const deletedComplaint = await db.delete(ComplaintsTable)
    .where(eq(ComplaintsTable.complaintID, id))
    .returning();

  if (deletedComplaint.length === 0) {
    return null;
  }
  return "Complaint deleted successfully";
};
