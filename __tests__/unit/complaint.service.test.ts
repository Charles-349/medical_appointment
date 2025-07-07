import {
  createComplaintService,
  getComplaintsService,
  getComplaintByIdService,
  getComplaintsByUserIdService,
  getComplaintsByAppointmentIdService,
  updateComplaintService,
  deleteComplaintService
} from "../../src/complaint/complaint.service";

import db from "../../src/Drizzle/db";
import { ComplaintsTable, TIComplaint } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis()
  })),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    ComplaintsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

describe("complaint service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createComplaintService", () => {
    it("should insert a complaint and return success message", async () => {
      const complaint: TIComplaint = {
        userID: 1,
        relatedAppointmentID: 1,
        subject: "Late appointment",
        description: "Doctor was late",
        status: "Open"
      };
      const result = await createComplaintService(complaint);
      expect(db.insert).toHaveBeenCalled();
      expect(result).toBe("Complaint created successfully");
    });
  });

  describe("getComplaintsService", () => {
    it("should return all complaints", async () => {
      const mockComplaints = [{ complaintID: 1 }, { complaintID: 2 }];
      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce(mockComplaints);
      const result = await getComplaintsService();
      expect(result).toEqual(mockComplaints);
    });

    it("should return empty array if none", async () => {
      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getComplaintsService();
      expect(result).toEqual([]);
    });
  });

  describe("getComplaintByIdService", () => {
    it("should return complaint by ID", async () => {
      const mockComplaint = { complaintID: 1 };
      (db.query.ComplaintsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockComplaint);
      const result = await getComplaintByIdService(1);
      expect(result).toEqual(mockComplaint);
    });

    it("should return undefined if not found", async () => {
      (db.query.ComplaintsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getComplaintByIdService(1);
      expect(result).toBeUndefined();
    });
  });

  describe("getComplaintsByUserIdService", () => {
    it("should return complaints by user ID", async () => {
      const mockComplaints = [{ complaintID: 1 }];
      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce(mockComplaints);
      const result = await getComplaintsByUserIdService(1);
      expect(result).toEqual(mockComplaints);
    });
  });

  describe("getComplaintsByAppointmentIdService", () => {
    it("should return complaints by appointment ID", async () => {
      const mockComplaints = [{ complaintID: 1 }];
      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce(mockComplaints);
      const result = await getComplaintsByAppointmentIdService(1);
      expect(result).toEqual(mockComplaints);
    });
  });

  describe("updateComplaintService", () => {
    it("should update complaint and return success", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{}])
          })
        })
      });
      const result = await updateComplaintService(1, {
        userID: 1,
        relatedAppointmentID: 1,
        subject: "Updated Subject",
        description: "Updated description",
        status: "In Progress"
      });
      expect(db.update).toHaveBeenLastCalledWith(ComplaintsTable);
      expect(result).toBe("Complaint updated successfully");
    });

    it("should return null if no rows updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([])
          })
        })
      });
      const result = await updateComplaintService(1, {
        userID: 1,
        relatedAppointmentID: 1,
        subject: "None",
        description: "None",
        status: "Closed"
      });
      expect(result).toBeNull();
    });
  });

  describe("deleteComplaintService", () => {
    it("should delete complaint and return success", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{}])
        })
      });
      const result = await deleteComplaintService(1);
      expect(db.delete).toHaveBeenLastCalledWith(ComplaintsTable);
      expect(result).toBe("Complaint deleted successfully");
    });

    it("should return null if no rows deleted", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([])
        })
      });
      const result = await deleteComplaintService(1);
      expect(result).toBeNull();
    });
  });
});
