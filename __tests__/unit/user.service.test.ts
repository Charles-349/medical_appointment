import {
  createUserService,
  userLoginService,
  getUserByEmailService,
  verifyUserService,
  updateVerificationCodeService,
  getUserService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  getUserWithAppointmentsService,
  getUserWithAppointmentsAndPaymentsService,
  getUserWithPrescriptionsService,
  getUserWithComplaintsService,
  getUserWithAppointmentsAndDoctorsService
} from "../../src/user/user.service";
import db from "../../src/Drizzle/db";
import { UsersTable, TIUser } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis()
  })),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    UsersTable: {
      findFirst: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

describe("user service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUserService", () => {
    it("should insert a user and return success message", async () => {
      const user: TIUser = {
        firstName: "Test",
        lastName: "User",
        email: "test@gmail.com",
        password: "hashed"
      } as TIUser;
      const result = await createUserService(user);
      expect(db.insert).toHaveBeenCalled();
      expect(result).toBe("User created successfully");
    });
  });

  describe("userLoginService", () => {
    it("should return user data if found", async () => {
      const mockUser = {
        userID: 1,
        firstName: "Test",
        lastName: "User",
        email: "test@gmail.com",
        password: "hashed"
      };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
      const result = await userLoginService({ email: "test@gmail.com" } as TIUser);
      expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserByEmailService", () => {
    it("should get a user by email", async () => {
      const mockUser = { email: "test@gmail.com" };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
      const result = await getUserByEmailService("test@gmail.com");
      expect(result).toEqual(mockUser);
    });
  });

  describe("verifyUserService", () => {
    it("should verify a user", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValueOnce(undefined)
        })
      });
      await verifyUserService("test@gmail.com");
      expect(db.update).toHaveBeenCalledWith(UsersTable);
    });
  });

  describe("updateVerificationCodeService", () => {
    it("should update the verification code", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValueOnce(undefined)
        })
      });
      await updateVerificationCodeService("test@gmail.com", "123456", new Date());
      expect(db.update).toHaveBeenCalledWith(UsersTable);
    });
  });

  describe("getUserService", () => {
    it("should return all users", async () => {
      const users = [{ email: "a@gmail.com" }, { email: "b@gmail.com" }];
      (db.query.UsersTable.findMany as jest.Mock).mockResolvedValueOnce(users);
      const result = await getUserService();
      expect(result).toEqual(users);
    });
  });

  describe("getUserByIdService", () => {
    it("should return a user by id", async () => {
      const user = { userID: 1, email: "a@gmail.com" };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(user);
      const result = await getUserByIdService(1);
      expect(result).toEqual(user);
    });
  });

  describe("updateUserService", () => {
    it("should update a user and return success", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{}])
          })
        })
      });
      const result = await updateUserService(1, { email: "update@gmail.com" } as TIUser);
      expect(result).toBe("User updated successfully");
    });

    it("should return null if no user updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([])
          })
        })
      });
      const result = await updateUserService(999, { email: "nope@gmail.com" } as TIUser);
      expect(result).toBeNull();
    });
  });

  describe("deleteUserService", () => {
    it("should delete a user and return success", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{}])
        })
      });
      const result = await deleteUserService(1);
      expect(result).toBe("User deleted successfully");
    });

    it("should return null if no user deleted", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([])
        })
      });
      const result = await deleteUserService(999);
      expect(result).toBeNull();
    });
  });

  describe("getUserWithAppointmentsService", () => {
    it("should return user with appointments", async () => {
      const mockData = { userID: 1, appointments: [{ appointmentID: 1 }] };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getUserWithAppointmentsService(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getUserWithAppointmentsAndPaymentsService", () => {
    it("should return user with appointments and payments", async () => {
      const mockData = { userID: 1, appointments: [{ appointmentID: 1, payment: {} }] };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getUserWithAppointmentsAndPaymentsService(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getUserWithPrescriptionsService", () => {
    it("should return user with prescriptions", async () => {
      const mockData = { userID: 1, prescriptions: [{ prescriptionID: 1 }] };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getUserWithPrescriptionsService(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getUserWithComplaintsService", () => {
    it("should return user with complaints", async () => {
      const mockData = { userID: 1, complaints: [{ complaintID: 1 }] };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getUserWithComplaintsService(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getUserWithAppointmentsAndDoctorsService", () => {
    it("should return user with appointments and doctors", async () => {
      const mockData = { userID: 1, appointments: [{ appointmentID: 1, doctor: {} }] };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getUserWithAppointmentsAndDoctorsService(1);
      expect(result).toEqual(mockData);
    });
  });

});
