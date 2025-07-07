import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  UsersTable,
  DoctorsTable,
  AppointmentsTable,
  PaymentsTable
} from "../../src/Drizzle/schema";

describe("Appointment API Integration Tests", () => {
  let tempUserId: number;
  let tempDoctorId: number;
  let tempAppointmentId: number;

  beforeAll(async () => {
    await db.select().from(UsersTable).limit(1).execute();
  });

  beforeEach(async () => {
    await db.delete(PaymentsTable).execute();
    await db.delete(AppointmentsTable).execute();
    await db.delete(DoctorsTable).execute();
    await db.delete(UsersTable).execute();

    const [user] = await db.insert(UsersTable).values({
      firstName: "John",
      lastName: "Doe",
      email: `john${Date.now()}@test.com`,
      password: "hashed",
      isVerified: true
    }).returning();
    tempUserId = user.userID;

    const [doctor] = await db.insert(DoctorsTable).values({
      firstName: "Dr.",
      lastName: "Smith",
      specialization: "Cardiology"
    }).returning();
    tempDoctorId = doctor.doctorID;

    const [appointment] = await db.insert(AppointmentsTable).values({
      userID: tempUserId,
      doctorID: tempDoctorId,
      appointmentDate: new Date().toISOString(),
      timeSlot: "10:00:00"
    }).returning();
    tempAppointmentId = appointment.appointmentID;
  });

  afterAll(async () => {
    await db.$client.end();
  });

  it("should create an appointment", async () => {
    const res = await request(app).post("/appointment").send({
      userID: tempUserId,
      doctorID: tempDoctorId,
      appointmentDate: new Date(),
      timeSlot: "11:00:00"
    });
    expect(res.statusCode).toBe(201);
  });

  it("should fail to create with missing fields", async () => {
    const res = await request(app).post("/appointment").send({});
    expect(res.statusCode).toBe(400);
  });

  it("should get all appointments", async () => {
    const res = await request(app).get("/appointment");
    expect(res.statusCode).toBe(200);
    expect(res.body.appointments.length).toBeGreaterThan(0);
  });

  it("should get no appointments if all deleted", async () => {
    await db.delete(AppointmentsTable).execute();
    const res = await request(app).get("/appointment");
    expect(res.statusCode).toBe(404);
  });

  it("should get appointment by ID", async () => {
    const res = await request(app).get(`/appointment/${tempAppointmentId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get appointment with invalid ID", async () => {
    const res = await request(app).get("/appointment/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should fail to get appointment by ID not found", async () => {
    const res = await request(app).get("/appointment/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should get appointments by user ID", async () => {
    const res = await request(app).get(`/appointment/user/${tempUserId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get appointments by invalid user ID", async () => {
    const res = await request(app).get("/appointment/user/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should fail to get appointments by user ID not found", async () => {
    const res = await request(app).get("/appointment/user/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should get appointments by doctor ID", async () => {
    const res = await request(app).get(`/appointment/doctor/${tempDoctorId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get appointments by invalid doctor ID", async () => {
    const res = await request(app).get("/appointment/doctor/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should fail to get appointments by doctor ID not found", async () => {
    const res = await request(app).get("/appointment/doctor/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should update an appointment", async () => {
    const res = await request(app).put(`/appointment/${tempAppointmentId}`).send({
      appointmentStatus: "Confirmed"
    });
    expect(res.statusCode).toBe(200);
  });

  it("should fail to update appointment with empty payload", async () => {
    const res = await request(app).put(`/appointment/${tempAppointmentId}`).send({});
    expect(res.statusCode).toBe(400);
  });

  it("should fail to update appointment with invalid ID", async () => {
    const res = await request(app).put(`/appointment/abc`).send({ appointmentStatus: "Confirmed" });
    expect(res.statusCode).toBe(400);
  });

  it("should fail to update non-existent appointment", async () => {
    const res = await request(app).put("/appointment/99999").send({
      appointmentStatus: "Cancelled"
    });
    expect(res.statusCode).toBe(404);
  });

  it("should delete an appointment", async () => {
    const res = await request(app).delete(`/appointment/${tempAppointmentId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to delete appointment with invalid ID", async () => {
    const res = await request(app).delete(`/appointment/abc`);
    expect(res.statusCode).toBe(400);
  });

  it("should fail to delete non-existent appointment", async () => {
    const res = await request(app).delete(`/appointment/99999`);
    expect(res.statusCode).toBe(404);
  });

  it("should get appointment with doctor", async () => {
    const res = await request(app).get(`/appointments/${tempAppointmentId}/doctor`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get appointment with doctor when not found", async () => {
    const res = await request(app).get("/appointments/99999/doctor");
    expect(res.statusCode).toBe(404);
  });

  it("should get appointment with user", async () => {
    const res = await request(app).get(`/appointments/${tempAppointmentId}/user`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get appointment with user when not found", async () => {
    const res = await request(app).get("/appointments/99999/user");
    expect(res.statusCode).toBe(404);
  });

  it("should get all appointments with doctor and user", async () => {
    const res = await request(app).get("/appointments/doctor-user");
    expect(res.statusCode).toBe(200);
  });

  it("should get appointment with payment when none exists", async () => {
    const res = await request(app).get(`/appointments/${tempAppointmentId}/payment`);
    expect(res.statusCode).toBe(404);
  });

  it("should fail to get appointment with payment for invalid ID", async () => {
    const res = await request(app).get(`/appointments/abc/payment`);
    expect(res.statusCode).toBe(400);
  });
});
