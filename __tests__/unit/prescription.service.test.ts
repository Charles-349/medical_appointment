import {
  createPrescriptionService,
  getPrescriptionsService,
  getPrescriptionByIdService,
  getPrescriptionsByAppointmentIdService,
  getPrescriptionsByDoctorIdService,
  getPrescriptionsByUserIdService,
  updatePrescriptionService,
  deletePrescriptionService
} from "../../src/prescription/prescription.service";

import db from "../../src/Drizzle/db";
import { PrescriptionsTable, TIPrescription } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis()
  })),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    PrescriptionsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

describe("prescription service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPrescriptionService", () => {
    it("should insert a prescription and return success", async () => {
      const prescription: TIPrescription = {
        appointmentID: 1,
        doctorID: 1,
        userID: 1,
        notes: "Take one pill daily"
      };
      const result = await createPrescriptionService(prescription);
      expect(db.insert).toHaveBeenCalled();
      expect(result).toBe("Prescription created successfully");
    });
  });

  describe("getPrescriptionsService", () => {
    it("should return all prescriptions", async () => {
      const mockPrescriptions = [{ prescriptionID: 1 }, { prescriptionID: 2 }];
      (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce(mockPrescriptions);
      const result = await getPrescriptionsService();
      expect(result).toEqual(mockPrescriptions);
    });

    it("should return empty if none found", async () => {
      (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getPrescriptionsService();
      expect(result).toEqual([]);
    });
  });

  describe("getPrescriptionByIdService", () => {
    it("should return prescription by ID", async () => {
      const mockPrescription = { prescriptionID: 1 };
      (db.query.PrescriptionsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockPrescription);
      const result = await getPrescriptionByIdService(1);
      expect(result).toEqual(mockPrescription);
    });

    it("should return undefined if not found", async () => {
      (db.query.PrescriptionsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getPrescriptionByIdService(1);
      expect(result).toBeUndefined();
    });
  });

  describe("getPrescriptionsByAppointmentIdService", () => {
    it("should return prescriptions by appointment ID", async () => {
      const mockPrescriptions = [{ prescriptionID: 1 }];
      (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce(mockPrescriptions);
      const result = await getPrescriptionsByAppointmentIdService(1);
      expect(result).toEqual(mockPrescriptions);
    });
  });

  describe("getPrescriptionsByDoctorIdService", () => {
    it("should return prescriptions by doctor ID", async () => {
      const mockPrescriptions = [{ prescriptionID: 1 }];
      (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce(mockPrescriptions);
      const result = await getPrescriptionsByDoctorIdService(1);
      expect(result).toEqual(mockPrescriptions);
    });
  });

  describe("getPrescriptionsByUserIdService", () => {
    it("should return prescriptions by user ID", async () => {
      const mockPrescriptions = [{ prescriptionID: 1 }];
      (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce(mockPrescriptions);
      const result = await getPrescriptionsByUserIdService(1);
      expect(result).toEqual(mockPrescriptions);
    });
  });

  describe("updatePrescriptionService", () => {
    it("should update prescription and return success", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{}])
          })
        })
      });
      const result = await updatePrescriptionService(1, {
        appointmentID: 1,
        doctorID: 1,
        userID: 1,
        notes: "Updated notes"
      });
      expect(db.update).toHaveBeenLastCalledWith(PrescriptionsTable);
      expect(result).toBe("Prescription updated successfully");
    });

    it("should return null if no rows updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([])
          })
        })
      });
      const result = await updatePrescriptionService(1, {
        appointmentID: 1,
        doctorID: 1,
        userID: 1,
        notes: "No Update"
      });
      expect(result).toBeNull();
    });
  });

  describe("deletePrescriptionService", () => {
    it("should delete prescription and return success", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{}])
        })
      });
      const result = await deletePrescriptionService(1);
      expect(db.delete).toHaveBeenLastCalledWith(PrescriptionsTable);
      expect(result).toBe("Prescription deleted successfully");
    });

    it("should return null if no rows deleted", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([])
        })
      });
      const result = await deletePrescriptionService(1);
      expect(result).toBeNull();
    });
  });
});
