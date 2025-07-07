import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  PaymentsTable,
  AppointmentsTable,
  UsersTable,
  DoctorsTable
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

describe("Payment API Integration Tests", () => {
  let tempUserId: number;
  let tempDoctorId: number;
  let tempAppointmentId: number;
  let tempPaymentId: number;

  beforeAll(async () => {
    await db.select().from(UsersTable).limit(1).execute();
  });

  beforeEach(async () => {
    // Clear tables
    await db.delete(PaymentsTable).execute();
    await db.delete(AppointmentsTable).execute();
    await db.delete(DoctorsTable).execute();
    await db.delete(UsersTable).execute();

    // Seed User
    const [user] = await db.insert(UsersTable).values({
      firstName: "Jane",
      lastName: "Doe",
      email: `jane${Date.now()}@test.com`,
      password: "hashed",
      isVerified: true
    }).returning();
    tempUserId = user.userID;

    // Seed Doctor
    const [doctor] = await db.insert(DoctorsTable).values({
      firstName: "Dr.",
      lastName: "House",
      specialization: "Dermatology"
    }).returning();
    tempDoctorId = doctor.doctorID;

    // Seed Appointment
    const [appointment] = await db.insert(AppointmentsTable).values({
      userID: tempUserId,
      doctorID: tempDoctorId,
      appointmentDate: new Date().toISOString(),
      timeSlot: "09:00:00"
    }).returning();
    tempAppointmentId = appointment.appointmentID;

    // Seed Payment
    const [payment] = await db.insert(PaymentsTable).values({
      appointmentID: tempAppointmentId,
      amount: "100.00",
      paymentDate: new Date().toISOString()
    }).returning();
    tempPaymentId = payment.paymentID;
  });

  afterAll(async () => {
    await db.$client.end();
  });

  it("should create a payment for a fresh appointment", async () => {
    // Make a new appointment for this test
    const [newAppointment] = await db.insert(AppointmentsTable).values({
      userID: tempUserId,
      doctorID: tempDoctorId,
      appointmentDate: new Date().toISOString(),
      timeSlot: "10:00:00"
    }).returning();

    const res = await request(app).post("/payment").send({
      appointmentID: newAppointment.appointmentID,
      amount: "200.00",
      paymentDate: new Date().toISOString()
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Payment created successfully");
  });

  it("should fail to create payment with missing fields", async () => {
    const res = await request(app).post("/payment").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/AppointmentID/i);
  });

  it("should fail to create a duplicate payment for same appointment", async () => {
    const res = await request(app).post("/payment").send({
      appointmentID: tempAppointmentId,
      amount: "999.00",
      paymentDate: new Date().toISOString()
    });
    expect([400, 500]).toContain(res.statusCode);
  });

  it("should get all payments", async () => {
    const res = await request(app).get("/payment");
    expect(res.statusCode).toBe(200);
    expect(res.body.payments.length).toBeGreaterThan(0);
  });

  it("should get payment by ID", async () => {
    const res = await request(app).get(`/payment/${tempPaymentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.payment).toBeDefined();
  });

  it("should fail to get payment with invalid ID", async () => {
    const res = await request(app).get("/payment/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should get payment by appointment ID", async () => {
    const res = await request(app).get(`/payment/appointment/${tempAppointmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.payment).toBeDefined();
  });

  it("should update a payment", async () => {
    const res = await request(app).put(`/payment/${tempPaymentId}`).send({
      amount: "500.00"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Payment updated successfully");

    const [updated] = await db
      .select()
      .from(PaymentsTable)
      .where(eq(PaymentsTable.paymentID, tempPaymentId))
      .execute();
    expect(updated.amount).toBe("500.00");
  });

  it("should fail to update with no payload", async () => {
    const res = await request(app).put(`/payment/${tempPaymentId}`).send({});
    expect(res.statusCode).toBe(400);
  });

  it("should fail to update non-existent payment", async () => {
    const res = await request(app).put("/payment/99999").send({
      amount: "1000"
    });
    expect(res.statusCode).toBe(404);
  });

  it("should delete a payment", async () => {
    const res = await request(app).delete(`/payment/${tempPaymentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Payment deleted successfully");

    const [deleted] = await db
      .select()
      .from(PaymentsTable)
      .where(eq(PaymentsTable.paymentID, tempPaymentId))
      .execute();
    expect(deleted).toBeUndefined();
  });

  it("should fail to delete non-existent payment", async () => {
    const res = await request(app).delete("/payment/99999");
    expect(res.statusCode).toBe(404);
  });
});
