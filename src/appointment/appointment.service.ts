import { eq, sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIAppointment, AppointmentsTable } from "../Drizzle/schema";

// Create Appointment
export const createAppointmentService = async (appointment: TIAppointment) => {
  await db.insert(AppointmentsTable).values(appointment);
  return "Appointment created successfully";
};

// Get all Appointments
export const getAppointmentsService = async () => {
  const appointments = await db.query.AppointmentsTable.findMany();
  return appointments;
};

// Get Appointment by ID
export const getAppointmentByIdService = async (id: number) => {
  const appointment = await db.query.AppointmentsTable.findFirst({
    where: eq(AppointmentsTable.appointmentID, id),
  });
  return appointment;
};

// Get Appointments by User ID
export const getAppointmentsByUserIdService = async (userID: number) => {
  return await db.query.AppointmentsTable.findMany({
    where: sql`${AppointmentsTable.userID} = ${userID}`,
  });
};

// Get Appointments by Doctor ID
export const getAppointmentsByDoctorIdService = async (doctorID: number) => {
  return await db.query.AppointmentsTable.findMany({
    where: sql`${AppointmentsTable.doctorID} = ${doctorID}`,
  });
};

// Update Appointment
export const updateAppointmentService = async (id: number, appointment: TIAppointment) => {
  const updatedAppointment = await db
    .update(AppointmentsTable)
    .set(appointment)
    .where(eq(AppointmentsTable.appointmentID, id))
    .returning();

  if (updatedAppointment.length === 0) {
    return null;
  }
  return "Appointment updated successfully";
};

// Delete Appointment
export const deleteAppointmentService = async (id: number) => {
  const deletedAppointment = await db
    .delete(AppointmentsTable)
    .where(eq(AppointmentsTable.appointmentID, id))
    .returning();

  if (deletedAppointment.length === 0) {
    return null;
  }
  return "Appointment deleted successfully";
};

//Get Appointment with Doctor 
export const getAppointmentWithDoctorService = async (id: number) => {
  return await db.query.AppointmentsTable.findFirst({
    where: eq(AppointmentsTable.appointmentID, id),
    with: {
      doctor: {
        columns: {
          doctorID: true,
          firstName: true,
          lastName: true,
          specialization: true,
          contactPhone: true
        }
      }
    }
  });
};

//Get Appointment with User 
export const getAppointmentWithUserService = async (id: number) => {
  return await db.query.AppointmentsTable.findFirst({
    where: eq(AppointmentsTable.appointmentID, id),
    with: {
      user: {
        columns: {
          userID: true,
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true,
          address: true
        }
      }
    }
  });
};

//Get all Appointments with Doctor and User 
export const getAppointmentsWithDoctorAndUserService = async () => {
  return await db.query.AppointmentsTable.findMany({
    with: {
      doctor: {
        columns: {
          doctorID: true,
          firstName: true,
          lastName: true,
          specialization: true,
          contactPhone: true
        }
      },
      user: {
        columns: {
          userID: true,
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true,
          address: true
        }
      }
    }
  });
};

// Get appointment with payment 
export const getAppointmentWithPaymentService = async (id: number) => {
  return await db.query.AppointmentsTable.findFirst({
    where: eq(AppointmentsTable.appointmentID, id),
    with: {
      payment: {
        columns: {
          paymentID: true,
          amount: true,
          paymentStatus: true,
          transactionID: true,
          paymentDate: true,
          createdAt: true,
          updatedAt: true,
        }
      }
    }
  });
};

