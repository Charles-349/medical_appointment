import {
  createAppointmentService,
  getAppointmentsService,
  getAppointmentByIdService,
  getAppointmentsByUserIdService,
  getAppointmentsByDoctorIdService,
  updateAppointmentService,
  deleteAppointmentService,
  getAppointmentWithDoctorService,
  getAppointmentWithUserService,
  getAppointmentsWithDoctorAndUserService,
  getAppointmentWithPaymentService
} from "../../src/appointment/appointment.service";
import db from "../../src/Drizzle/db";
import { AppointmentsTable, TIAppointment } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis()
  })),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    AppointmentsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

describe("appointment service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createAppointmentService", () => {
    it("should insert an appointment and return success message", async () => {
      const appointment: TIAppointment = {
        userID: 1,
        doctorID: 2,
        appointmentDate: new Date().toISOString(),
        timeSlot: "10:00:00",
        totalAmount: "200.00"
      };
      const result = await createAppointmentService(appointment);
      expect(db.insert).toHaveBeenCalled();
      expect(result).toBe("Appointment created successfully");
    });
  });

  describe("getAppointmentsService", () => {
    it("should return all appointments", async () => {
      const mockAppointments = [{ appointmentID: 1 }, { appointmentID: 2 }];
      (db.query.AppointmentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockAppointments);
      const result = await getAppointmentsService();
      expect(result).toEqual(mockAppointments);
    });

    it("should return empty if none found", async () => {
      (db.query.AppointmentsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getAppointmentsService();
      expect(result).toEqual([]);
    });
  });

  describe("getAppointmentByIdService", () => {
    it("should return an appointment if found", async () => {
      const appointment = { appointmentID: 1 };
      (db.query.AppointmentsTable.findFirst as jest.Mock).mockResolvedValueOnce(appointment);
      const result = await getAppointmentByIdService(1);
      expect(result).toEqual(appointment);
    });

    it("should return undefined if not found", async () => {
      (db.query.AppointmentsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getAppointmentByIdService(1);
      expect(result).toBeUndefined();
    });
  });

  describe("getAppointmentsByUserIdService", () => {
    it("should return appointments by user ID", async () => {
      const mockData = [{ appointmentID: 1 }];
      (db.query.AppointmentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getAppointmentsByUserIdService(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getAppointmentsByDoctorIdService", () => {
    it("should return appointments by doctor ID", async () => {
      const mockData = [{ appointmentID: 1 }];
      (db.query.AppointmentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getAppointmentsByDoctorIdService(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("updateAppointmentService", () => {
    it("should update an appointment and return success message", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{}])
          })
        })
      });
      const result = await updateAppointmentService(1, {
        userID: 1,
        doctorID: 2,
        appointmentDate: new Date().toISOString(),
        timeSlot: "10:00:00",
        totalAmount: "200.00"
      });
      expect(result).toBe("Appointment updated successfully");
    });

    it("should return null if not updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([])
          })
        })
      });
      const result = await updateAppointmentService(999, {
        userID: 1,
        doctorID: 2,
        appointmentDate: new Date().toISOString(),
        timeSlot: "10:00:00",
        totalAmount: "200.00"
      });
      expect(result).toBeNull();
    });
  });

  describe("deleteAppointmentService", () => {
    it("should delete an appointment and return success", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{}])
        })
      });
      const result = await deleteAppointmentService(1);
      expect(result).toBe("Appointment deleted successfully");
    });

    it("should return null if not deleted", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([])
        })
      });
      const result = await deleteAppointmentService(999);
      expect(result).toBeNull();
    });
  });

  describe("getAppointmentWithDoctorService", () => {
    it("should return appointment with doctor", async () => {
      const mockData = {
        appointmentID: 1,
        doctor: {
          doctorID: 1,
          firstName: "Doc",
          lastName: "Tor",
          specialization: "Eye"
        }
      };
      (db.query.AppointmentsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getAppointmentWithDoctorService(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getAppointmentWithUserService", () => {
    it("should return appointment with user", async () => {
      const mockData = {
        appointmentID: 1,
        user: {
          userID: 1,
          firstName: "Patient"
        }
      };
      (db.query.AppointmentsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getAppointmentWithUserService(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getAppointmentsWithDoctorAndUserService", () => {
    it("should return appointments with doctor and user", async () => {
      const mockData = [
        {
          appointmentID: 1,
          doctor: {
            doctorID: 1,
            firstName: "Doc"
          },
          user: {
            userID: 1,
            firstName: "Patient"
          }
        }
      ];
      (db.query.AppointmentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getAppointmentsWithDoctorAndUserService();
      expect(result).toEqual(mockData);
    });
  });

  describe("getAppointmentWithPaymentService", () => {
    it("should return appointment with payment", async () => {
      const mockData = {
        appointmentID: 1,
        payment: {
          paymentID: 1,
          amount: "200.00",
          paymentStatus: "Paid"
        }
      };
      (db.query.AppointmentsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getAppointmentWithPaymentService(1);
      expect(result).toEqual(mockData);
    });
  });
});
