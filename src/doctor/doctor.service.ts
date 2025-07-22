import { eq, sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIDoctor, DoctorsTable } from "../Drizzle/schema";

// create doctor
export const createDoctorService = async (doctor: TIDoctor) => {
  const [newDoctor] = await db.insert(DoctorsTable).values(doctor).returning();
  return newDoctor;
};

// get doctor by specialization
export const getDoctorBySpecializationService = async (specialization: string) => {
  return await db.query.DoctorsTable.findMany({
    where: sql`${DoctorsTable.specialization} = ${specialization}`,
  });
};

// get all doctors
export const getDoctorsService = async () => {
  const doctors = await db.query.DoctorsTable.findMany();
  return doctors;
};

// get doctor by ID
export const getDoctorByIdService = async (id: number) => {
  const doctor = await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.doctorID, id),
  });
  return doctor;
};

// update doctor
export const updateDoctorService = async (id: number, doctor: TIDoctor) => {
  const updatedDoctor = await db
    .update(DoctorsTable)
    .set(doctor)
    .where(eq(DoctorsTable.doctorID, id))
    .returning();

  if (updatedDoctor.length === 0) {
    return null;
  }
  return "Doctor updated successfully";
};

// delete doctor
export const deleteDoctorService = async (id: number) => {
  const deletedDoctor = await db
    .delete(DoctorsTable)
    .where(eq(DoctorsTable.doctorID, id))
    .returning();

  if (deletedDoctor.length === 0) {
    return null;
  }
  return "Doctor deleted successfully";
};

export const getDoctorPatientsService = async (id: number) => {
  return await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.doctorID, id),
    with: {
      appointments: {
        columns: {
          appointmentID: true,
        },
        with: {
          user: {
            columns: {
              userID: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const getDoctorPrescriptionsService = async (id: number) => {
  return await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.doctorID, id),
    with: {
      prescriptions: true,
    },
  });
};
