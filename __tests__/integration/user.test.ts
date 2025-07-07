import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  UsersTable,
  AppointmentsTable,
  ComplaintsTable,
  PrescriptionsTable,
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

// Mock mailer
jest.mock("../../src/mailer/mailer", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe("User API Integration Tests", () => {
  let tempUserId: number;
  let tempEmail: string;

  beforeAll(async () => {
    await db.select().from(UsersTable).limit(1).execute();
  });

  beforeEach(async () => {
    await db.delete(ComplaintsTable).execute();
    await db.delete(PrescriptionsTable).execute();
    await db.delete(AppointmentsTable).execute();
    await db.delete(UsersTable).execute();

    tempEmail = `test${Date.now()}@example.com`;
    const res = await request(app).post("/user").send({
      email: tempEmail,
      password: "password123",
      firstName: "Test",
      lastName: "User",
    });
    expect(res.statusCode).toBe(201);

    const [user] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, tempEmail))
      .execute();
    tempUserId = user.userID;
    expect(tempUserId).toBeDefined();
  });

  afterAll(async () => {
    await db.$client.end();
  });

  it("should fail to create user with missing password", async () => {
    const res = await request(app).post("/user").send({
      email: `noPass${Date.now()}@example.com`,
    });
    expect(res.statusCode).toBe(400);
  });

  it("should create a user with valid data", async () => {
    const res = await request(app).post("/user").send({
      email: `create${Date.now()}@example.com`,
      password: "goodpass123",
      firstName: "Create",
      lastName: "User",
    });
    expect(res.statusCode).toBe(201);
  });

  it("should fail to create duplicate user", async () => {
    const res = await request(app).post("/user").send({
      email: tempEmail,
      password: "password123",
      firstName: "Dup",
      lastName: "User",
    });
    expect([400, 500]).toContain(res.statusCode); // will depend on whether you catch it
  });

  it("should get user by valid ID", async () => {
    const res = await request(app).get(`/user/${tempUserId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get user with bad ID", async () => {
    const res = await request(app).get("/user/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should fail to get user that does not exist", async () => {
    const res = await request(app).get("/user/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should update existing user", async () => {
    const res = await request(app).put(`/user/${tempUserId}`).send({
      firstName: "Updated",
    });
    expect(res.statusCode).toBe(200);
  });

  it("should fail to update with bad ID", async () => {
    const res = await request(app).put("/user/abc").send({
      firstName: "Updated",
    });
    expect(res.statusCode).toBe(404);
  });

  it("should fail to update non-existent user", async () => {
    const res = await request(app).put("/user/99999").send({
      firstName: "Updated",
    });
    expect(res.statusCode).toBe(404);
  });

  it("should delete user", async () => {
    const res = await request(app).delete(`/user/${tempUserId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to delete non-existent user", async () => {
    const res = await request(app).delete("/user/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should verify user with valid code", async () => {
    const [user] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.userID, tempUserId))
      .execute();
    const res = await request(app).post("/user/verify").send({
      email: tempEmail,
      code: user.verificationCode,
    });
    expect(res.statusCode).toBe(200);
  });

  it("should fail verify with wrong code", async () => {
    const res = await request(app).post("/user/verify").send({
      email: tempEmail,
      code: "000000",
    });
    expect([400, 404]).toContain(res.statusCode);
  });

  it("should fail verify with expired code", async () => {
    await db
      .update(UsersTable)
      .set({ verificationCodeExpiresAt: new Date(Date.now() - 1000) })
      .where(eq(UsersTable.userID, tempUserId))
      .execute();
    const [user] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.userID, tempUserId))
      .execute();
    const res = await request(app).post("/user/verify").send({
      email: tempEmail,
      code: user.verificationCode,
    });
    expect(res.statusCode).toBe(400);
  });

  it("should fail verify with non-existent user", async () => {
    const res = await request(app).post("/user/verify").send({
      email: "nouser@example.com",
      code: "123456",
    });
    expect(res.statusCode).toBe(404);
  });

  it("should resend verification code", async () => {
    const res = await request(app).post("/user/resend-verification").send({
      email: tempEmail,
    });
    expect(res.statusCode).toBe(200);
  });

  it("should fail resend for verified user", async () => {
    await db
      .update(UsersTable)
      .set({ isVerified: true })
      .where(eq(UsersTable.userID, tempUserId))
      .execute();
    const res = await request(app).post("/user/resend-verification").send({
      email: tempEmail,
    });
    expect(res.statusCode).toBe(400);
  });

  it("should fail resend for non-existent user", async () => {
    const res = await request(app).post("/user/resend-verification").send({
      email: "nouser@example.com",
    });
    expect(res.statusCode).toBe(404);
  });

  it("should fail resend with no email", async () => {
    const res = await request(app).post("/user/resend-verification").send({});
    expect(res.statusCode).toBe(400);
  });

  it("should login successfully", async () => {
    await db
      .update(UsersTable)
      .set({ isVerified: true })
      .where(eq(UsersTable.userID, tempUserId))
      .execute();
    const res = await request(app).post("/user/login").send({
      email: tempEmail,
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
  });

  it("should fail login with bad password", async () => {
    const res = await request(app).post("/user/login").send({
      email: tempEmail,
      password: "badpass",
    });
    expect(res.statusCode).toBe(401);
  });

  it("should fail login with bad email", async () => {
    const res = await request(app).post("/user/login").send({
      email: "none@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(404);
  });

  // Joins - user with relations
  it("should get user with appointments (likely 404)", async () => {
    const res = await request(app).get(`/user/${tempUserId}/appointments`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should get user with complaints (likely 404)", async () => {
    const res = await request(app).get(`/user/${tempUserId}/complaints`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should get user with prescriptions (likely 404)", async () => {
    const res = await request(app).get(`/user/${tempUserId}/prescriptions`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should get user with appointments-payments (likely 404)", async () => {
    const res = await request(app).get(`/user/${tempUserId}/appointments-payments`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should get user with appointments-doctors (likely 404)", async () => {
    const res = await request(app).get(`/user/${tempUserId}/appointments-doctors`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should fail join routes with bad ID", async () => {
    const res1 = await request(app).get("/user/abc/appointments");
    expect(res1.statusCode).toBe(400);

    const res2 = await request(app).get("/user/abc/complaints");
    expect(res2.statusCode).toBe(400);
  });

  
  it("should fail to get all users without auth", async () => {
    const res = await request(app).get("/user");
    expect([401, 403]).toContain(res.statusCode); 
  });
});
