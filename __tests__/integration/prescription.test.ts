import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  UsersTable,
  DoctorsTable,
  AppointmentsTable,
  PrescriptionsTable
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

describe("Prescription API Integration Tests", () => {
  let tempUserId: number;
  let tempDoctorId: number;
  let tempAppointmentId: number;
  let tempPrescriptionId: number;

  beforeAll(async () => {
    await db.select().from(UsersTable).limit(1).execute();
  });

  beforeEach(async () => {
    await db.delete(PrescriptionsTable).execute();
    await db.delete(AppointmentsTable).execute();
    await db.delete(DoctorsTable).execute();
    await db.delete(UsersTable).execute();

    const [user] = await db.insert(UsersTable).values({
      firstName: "Jane",
      lastName: "Doe",
      email: `jane${Date.now()}@test.com`,
      password: "hashed",
      isVerified: true
    }).returning();
    tempUserId = user.userID;

    const [doctor] = await db.insert(DoctorsTable).values({
      firstName: "Dr.",
      lastName: "House",
      specialization: "Neurology"
    }).returning();
    tempDoctorId = doctor.doctorID;

    const [appointment] = await db.insert(AppointmentsTable).values({
      userID: tempUserId,
      doctorID: tempDoctorId,
      appointmentDate: new Date().toISOString(),
      timeSlot: "14:00:00"
    }).returning();
    tempAppointmentId = appointment.appointmentID;

    const [prescription] = await db.insert(PrescriptionsTable).values({
      appointmentID: tempAppointmentId,
      doctorID: tempDoctorId,
      userID: tempUserId,
      notes: "Take medication twice daily"
    }).returning();
    tempPrescriptionId = prescription.prescriptionID;
  });

  afterAll(async () => {
    await db.$client.end();
  });

  it("should create a prescription", async () => {
    const res = await request(app).post("/prescription").send({
      appointmentID: tempAppointmentId,
      doctorID: tempDoctorId,
      userID: tempUserId,
      notes: "New prescription notes"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain("success");
  });

  it("should fail to create with missing fields", async () => {
    const res = await request(app).post("/prescription").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/AppointmentID/i);
  });

  it("should get all prescriptions", async () => {
    const res = await request(app).get("/prescription");
    expect(res.statusCode).toBe(200);
    expect(res.body.prescriptions.length).toBeGreaterThan(0);
  });

  it("should return 404 when no prescriptions exist", async () => {
    await db.delete(PrescriptionsTable).execute();
    const res = await request(app).get("/prescription");
    expect(res.statusCode).toBe(404);
  });

  it("should get prescription by ID", async () => {
    const res = await request(app).get(`/prescription/${tempPrescriptionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.prescription).toBeDefined();
  });

  it("should fail to get prescription with invalid ID", async () => {
    const res = await request(app).get("/prescription/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should get prescriptions by appointment ID", async () => {
    const res = await request(app).get(`/prescription/appointment/${tempAppointmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.prescriptions.length).toBeGreaterThan(0);
  });

  it("should fail to get prescriptions by invalid appointment ID", async () => {
    const res = await request(app).get("/prescription/appointment/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 when no prescriptions for appointment", async () => {
    const res = await request(app).get("/prescription/appointment/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should get prescriptions by doctor ID", async () => {
    const res = await request(app).get(`/prescription/doctor/${tempDoctorId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.prescriptions.length).toBeGreaterThan(0);
  });

  it("should fail to get prescriptions by invalid doctor ID", async () => {
    const res = await request(app).get("/prescription/doctor/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 when no prescriptions for doctor", async () => {
    const res = await request(app).get("/prescription/doctor/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should get prescriptions by user ID", async () => {
    const res = await request(app).get(`/prescription/user/${tempUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.prescriptions.length).toBeGreaterThan(0);
  });

  it("should fail to get prescriptions by invalid user ID", async () => {
    const res = await request(app).get("/prescription/user/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 when no prescriptions for user", async () => {
    const res = await request(app).get("/prescription/user/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should update a prescription", async () => {
    const res = await request(app).put(`/prescription/${tempPrescriptionId}`).send({
      notes: "Updated prescription notes"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("success");
  });

  it("should fail to update non-existent prescription", async () => {
    const res = await request(app).put("/prescription/99999").send({
      notes: "Doesn't exist"
    });
    expect(res.statusCode).toBe(404);
  });

  it("should fail to update prescription with invalid ID", async () => {
    const res = await request(app).put("/prescription/abc").send({
      notes: "Invalid ID"
    });
    expect(res.statusCode).toBe(400);
  });

  it("should fail to update prescription with empty payload", async () => {
    const res = await request(app).put(`/prescription/${tempPrescriptionId}`).send({});
    expect(res.statusCode).toBe(400);
  });

  it("should delete a prescription", async () => {
    const res = await request(app).delete(`/prescription/${tempPrescriptionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("success");
  });

  it("should fail to delete non-existent prescription", async () => {
    const res = await request(app).delete("/prescription/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should fail to delete prescription with invalid ID", async () => {
    const res = await request(app).delete("/prescription/abc");
    expect(res.statusCode).toBe(400);
  });
});
