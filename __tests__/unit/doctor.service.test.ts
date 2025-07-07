import {
  createDoctorService,
  getDoctorBySpecializationService,
  getDoctorsService,
  getDoctorByIdService,
  updateDoctorService,
  deleteDoctorService,
  getDoctorPatientsService,
  getDoctorPrescriptionsService
} from "../../src/doctor/doctor.service";
import db from "../../src/Drizzle/db";
import { DoctorsTable, TIDoctor } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis()
  })),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    DoctorsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

describe("doctor service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createDoctorService", () => {
    it("should insert a doctor and return success message", async () => {
      const doctor: TIDoctor = {
        firstName: "John",
        lastName: "Doe",
        specialization: "Cardiology"
      };
      const result = await createDoctorService(doctor);
      expect(db.insert).toHaveBeenCalled();
      expect(result).toBe("Doctor created successfully");
    });
  });

  describe("getDoctorBySpecializationService", () => {
    it("should return doctors matching specialization", async () => {
      const mockDoctors = [{ doctorID: 1, specialization: "Cardiology" }];
      (db.query.DoctorsTable.findMany as jest.Mock).mockResolvedValueOnce(mockDoctors);

      const result = await getDoctorBySpecializationService("Cardiology");
      expect(db.query.DoctorsTable.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockDoctors);
    });
  });

  describe("getDoctorsService", () => {
    it("should return all doctors", async () => {
      const mockDoctors = [
        { doctorID: 1, firstName: "John" },
        { doctorID: 2, firstName: "Jane" }
      ];
      (db.query.DoctorsTable.findMany as jest.Mock).mockResolvedValueOnce(mockDoctors);

      const result = await getDoctorsService();
      expect(result).toEqual(mockDoctors);
    });

    it("should return empty array if none", async () => {
      (db.query.DoctorsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getDoctorsService();
      expect(result).toEqual([]);
    });
  });

  describe("getDoctorByIdService", () => {
    it("should return a doctor if found", async () => {
      const doctor = { doctorID: 1, firstName: "John" };
      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(doctor);

      const result = await getDoctorByIdService(1);
      expect(result).toEqual(doctor);
    });

    it("should return undefined if not found", async () => {
      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getDoctorByIdService(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updateDoctorService", () => {
    it("should update a doctor and return success message", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{}])
          })
        })
      });
      const result = await updateDoctorService(1, {
        firstName: "Updated",
        lastName: "Doctor",
        specialization: "Neurology"
      });
      expect(result).toBe("Doctor updated successfully");
    });

    it("should return null if no doctor was updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([])
          })
        })
      });
      const result = await updateDoctorService(999, {
        firstName: "None",
        lastName: "Doctor",
        specialization: "Ghost"
      });
      expect(result).toBeNull();
    });
  });

  describe("deleteDoctorService", () => {
    it("should delete a doctor and return success message", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{}])
        })
      });
      const result = await deleteDoctorService(1);
      expect(result).toBe("Doctor deleted successfully");
    });

    it("should return null if no doctor was deleted", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([])
        })
      });
      const result = await deleteDoctorService(999);
      expect(result).toBeNull();
    });
  });

  describe("getDoctorPatientsService", () => {
    it("should return doctor with patients", async () => {
      const mockDoctorPatients = {
        doctorID: 1,
        appointments: [
          {
            appointmentID: 1,
            user: {
              userID: 1,
              firstName: "Patient",
              lastName: "One",
              email: "p1@example.com"
            }
          }
        ]
      };
      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDoctorPatients);
      const result = await getDoctorPatientsService(1);
      expect(result).toEqual(mockDoctorPatients);
    });
  });

  describe("getDoctorPrescriptionsService", () => {
    it("should return doctor with prescriptions", async () => {
      const mockDoctorPrescriptions = {
        doctorID: 1,
        prescriptions: [
          {
            prescriptionID: 1,
            notes: "Take 1 daily"
          }
        ]
      };
      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDoctorPrescriptions);
      const result = await getDoctorPrescriptionsService(1);
      expect(result).toEqual(mockDoctorPrescriptions);
    });
  });
});
