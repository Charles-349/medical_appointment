/* istanbul ignore file */
import request from "supertest";
import app from "../../src/index";
import * as mailer from "../../src/mailer/mailer";
import db from "../../src/Drizzle/db";
import { UsersTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

jest.mock("../../src/mailer/mailer", () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));

describe("Mailer usage for user controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send verification email when creating a user", async () => {
    const email = `test${Date.now()}@example.com`;

    const res = await request(app).post("/user").send({
      email,
      password: "password123",
      firstName: "Tester",
      lastName: "McTest",
      contactPhone: "123456789",
      address: "123 Test St"
    });

    expect(res.statusCode).toBe(201);

    expect(mailer.sendEmail).toHaveBeenCalledTimes(1);
    const [to, subject, text, html] = (mailer.sendEmail as jest.Mock).mock.calls[0];

    expect(to).toBe(email);
    expect(subject.toLowerCase()).toContain("verify");
    expect(text.toLowerCase()).toContain("verification code");
    expect(html).toContain("<div>");
  });

  it("should send a new verification email when resending verification code", async () => {
    const email = `resend${Date.now()}@example.com`;

    
    await request(app).post("/user").send({
      email,
      password: "password123",
      firstName: "Resendy",
      lastName: "Tester",
      contactPhone: "987654321",
      address: "456 Test Blvd"
    });

    // Should have called mailer once during create
    expect(mailer.sendEmail).toHaveBeenCalledTimes(1);

   
    jest.clearAllMocks();

  
    const [created] = await db.select().from(UsersTable).where(eq(UsersTable.email, email)).execute();
    expect(created.isVerified).toBe(false);


    const res = await request(app).post("/user/resend-verification").send({
      email
    });

    expect(res.statusCode).toBe(200);

    expect(mailer.sendEmail).toHaveBeenCalledTimes(1);

    const [to, subject, text, html] = (mailer.sendEmail as jest.Mock).mock.calls[0];

    expect(to).toBe(email);
    expect(subject.toLowerCase()).toContain("verification");
    expect(text.toLowerCase()).toContain("verification code");
    expect(html).toContain("<div>");
  });
});
