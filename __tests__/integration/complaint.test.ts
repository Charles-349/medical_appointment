import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  UsersTable,
  DoctorsTable,
  AppointmentsTable,
  ComplaintsTable
} from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

describe("Complaint API Integration Tests", () => {
  let tempUserId: number;
  let tempDoctorId: number;
  let tempAppointmentId: number;
  let tempComplaintId: number;

  beforeAll(async () => {
    await db.select().from(UsersTable).limit(1).execute();
  });

  beforeEach(async () => {
    // Clean tables
    await db.delete(ComplaintsTable).execute();
    await db.delete(AppointmentsTable).execute();
    await db.delete(DoctorsTable).execute();
    await db.delete(UsersTable).execute();

    // Seed User
    const [user] = await db.insert(UsersTable).values({
      firstName: "Alice",
      lastName: "Doe",
      email: `alice${Date.now()}@test.com`,
      password: "hashed",
      isVerified: true
    }).returning();
    tempUserId = user.userID;

    // Seed Doctor (required for FK)
    const [doctor] = await db.insert(DoctorsTable).values({
      firstName: "Dr.",
      lastName: "Smith",
      specialization: "General"
    }).returning();
    tempDoctorId = doctor.doctorID;

    // Seed Appointment
    const [appointment] = await db.insert(AppointmentsTable).values({
      userID: tempUserId,
      doctorID: tempDoctorId,
      appointmentDate: new Date().toISOString(),
      timeSlot: "10:00:00"
    }).returning();
    tempAppointmentId = appointment.appointmentID;

    // Seed Complaint
    const [complaint] = await db.insert(ComplaintsTable).values({
      userID: tempUserId,
      relatedAppointmentID: tempAppointmentId,
      subject: "Test complaint",
      description: "Test description"
    }).returning();
    tempComplaintId = complaint.complaintID;
  });

  afterAll(async () => {
    await db.$client.end();
  });

  it("should create a complaint", async () => {
    const res = await request(app).post("/complaint").send({
      userID: tempUserId,
      subject: "New Complaint",
      relatedAppointmentID: tempAppointmentId,
      description: "Some issue description"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/created/i);

    const [found] = await db.select().from(ComplaintsTable).where(eq(ComplaintsTable.subject, "New Complaint")).execute();
    expect(found).toBeDefined();
  });

  it("should fail to create complaint with missing fields", async () => {
    const res = await request(app).post("/complaint").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it("should get all complaints", async () => {
    const res = await request(app).get("/complaint");
    expect(res.statusCode).toBe(200);
    expect(res.body.complaints.length).toBeGreaterThan(0);
  });

  it("should return 404 if no complaints exist", async () => {
    await db.delete(ComplaintsTable).execute();
    const res = await request(app).get("/complaint");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/no complaints/i);
  });

  it("should get complaint by ID", async () => {
    const res = await request(app).get(`/complaint/${tempComplaintId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.complaint).toBeDefined();
  });

  it("should fail to get complaint by invalid ID", async () => {
    const res = await request(app).get("/complaint/abc");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it("should return 404 if complaint not found by ID", async () => {
    const res = await request(app).get("/complaint/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should get complaints by user ID", async () => {
    const res = await request(app).get(`/complaint/user/${tempUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.complaints).toBeInstanceOf(Array);
  });

  it("should fail to get complaints by invalid user ID", async () => {
    const res = await request(app).get("/complaint/user/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if no complaints for user", async () => {
    const res = await request(app).get("/complaint/user/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/no complaints/i);
  });

  it("should get complaints by appointment ID", async () => {
    const res = await request(app).get(`/complaint/appointment/${tempAppointmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.complaints).toBeInstanceOf(Array);
  });

  it("should fail to get complaints by invalid appointment ID", async () => {
    const res = await request(app).get("/complaint/appointment/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if no complaints for appointment", async () => {
    const res = await request(app).get("/complaint/appointment/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/no complaints/i);
  });

  it("should update a complaint", async () => {
    const res = await request(app).put(`/complaint/${tempComplaintId}`).send({
      subject: "Updated Subject",
      description: "Updated description"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/updated/i);

    const [updated] = await db.select().from(ComplaintsTable).where(eq(ComplaintsTable.complaintID, tempComplaintId)).execute();
    expect(updated.subject).toBe("Updated Subject");
  });

  it("should fail to update non-existent complaint", async () => {
    const res = await request(app).put("/complaint/99999").send({ subject: "Doesn't matter" });
    expect(res.statusCode).toBe(404);
  });

  it("should fail to update with invalid ID", async () => {
    const res = await request(app).put("/complaint/abc").send({ subject: "x" });
    expect(res.statusCode).toBe(400);
  });

  it("should delete a complaint", async () => {
    const res = await request(app).delete(`/complaint/${tempComplaintId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const [found] = await db.select().from(ComplaintsTable).where(eq(ComplaintsTable.complaintID, tempComplaintId)).execute();
    expect(found).toBeUndefined();
  });

  it("should fail to delete non-existent complaint", async () => {
    const res = await request(app).delete("/complaint/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should fail to delete with invalid ID", async () => {
    const res = await request(app).delete("/complaint/abc");
    expect(res.statusCode).toBe(400);
  });
});
