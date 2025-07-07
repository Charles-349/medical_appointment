import {
  createPaymentService,
  getPaymentsService,
  getPaymentByIdService,
  getPaymentByAppointmentIdService,
  updatePaymentService,
  deletePaymentService
} from "../../src/payment/payment.service";

import db from "../../src/Drizzle/db";
import { PaymentsTable, TIPayment } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis()
  })),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    PaymentsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

describe("payment service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPaymentService", () => {
    it("should insert a payment and return success", async () => {
      const payment: TIPayment = {
        appointmentID: 1,
        amount: "200.00",
        paymentStatus: "Paid",
        transactionID: "TXN123",
        paymentDate: new Date().toISOString()
      };
      const result = await createPaymentService(payment);
      expect(db.insert).toHaveBeenCalled();
      expect(result).toBe("Payment created successfully");
    });
  });

  describe("getPaymentsService", () => {
    it("should return all payments", async () => {
      const mockPayments = [{ paymentID: 1 }, { paymentID: 2 }];
      (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockPayments);
      const result = await getPaymentsService();
      expect(result).toEqual(mockPayments);
    });

    it("should return empty if none found", async () => {
      (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getPaymentsService();
      expect(result).toEqual([]);
    });
  });

  describe("getPaymentByIdService", () => {
    it("should return payment by ID", async () => {
      const mockPayment = { paymentID: 1 };
      (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockPayment);
      const result = await getPaymentByIdService(1);
      expect(result).toEqual(mockPayment);
    });

    it("should return undefined if not found", async () => {
      (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getPaymentByIdService(1);
      expect(result).toBeUndefined();
    });
  });

  describe("getPaymentByAppointmentIdService", () => {
    it("should return payment by appointment ID", async () => {
      const mockPayment = { paymentID: 1 };
      (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockPayment);
      const result = await getPaymentByAppointmentIdService(1);
      expect(result).toEqual(mockPayment);
    });
  });

  describe("updatePaymentService", () => {
    it("should update payment and return success", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{}])
          })
        })
      });
      const result = await updatePaymentService(1, {
        paymentStatus: "Updated"
      });
      expect(db.update).toHaveBeenLastCalledWith(PaymentsTable);
      expect(result).toBe("Payment updated successfully");
    });

    it("should throw if only updatedAt present", async () => {
      await expect(updatePaymentService(1, {})).rejects.toThrow("No valid fields to update");
    });

    it("should return null if no rows updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([])
          })
        })
      });
      const result = await updatePaymentService(1, {
        paymentStatus: "NoUpdate"
      });
      expect(result).toBeNull();
    });
  });

  describe("deletePaymentService", () => {
    it("should delete payment and return success", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{}])
        })
      });
      const result = await deletePaymentService(1);
      expect(db.delete).toHaveBeenLastCalledWith(PaymentsTable);
      expect(result).toBe("Payment deleted successfully");
    });

    it("should return null if no rows deleted", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([])
        })
      });
      const result = await deletePaymentService(999);
      expect(result).toBeNull();
    });
  });
});
