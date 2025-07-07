import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { DoctorsTable, AppointmentsTable, PrescriptionsTable, UsersTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

describe("Doctor API Integration Tests", () => {
  let tempDoctorId: number;

  beforeAll(async () => {
    await db.select().from(DoctorsTable).limit(1).execute();
  });

  beforeEach(async () => {
    await db.delete(AppointmentsTable).execute();
    await db.delete(PrescriptionsTable).execute();
    await db.delete(DoctorsTable).execute();

    const createRes = await request(app).post("/doctor").send({
      firstName: "John",
      lastName: "Doe",
      specialization: "Cardiology",
      contactPhone: "123456789"
    });

    expect(createRes.statusCode).toBe(201);

    const [doctor] = await db
      .select()
      .from(DoctorsTable)
      .where(eq(DoctorsTable.firstName, "John"))
      .execute();

    expect(doctor).toBeDefined();
    tempDoctorId = doctor.doctorID;
  });

  afterAll(async () => {
    await db.$client.end();
  });

  it("should create a doctor", async () => {
    const res = await request(app).post("/doctor").send({
      firstName: "Jane",
      lastName: "Smith",
      specialization: "Dermatology"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain("success");
  });

  it("should fail to create doctor with missing fields", async () => {
    const res = await request(app).post("/doctor").send({ firstName: "Incomplete" });
    expect(res.statusCode).toBe(400);
  });

  it("should fail to create doctor with empty body", async () => {
    const res = await request(app).post("/doctor").send({});
    expect(res.statusCode).toBe(400);
  });

  it("should get all doctors", async () => {
    const res = await request(app).get("/doctor");
    expect(res.statusCode).toBe(200);
    expect(res.body.doctors.length).toBeGreaterThan(0);
  });

  it("should fail when no doctors exist", async () => {
    await db.delete(DoctorsTable).execute();
    const res = await request(app).get("/doctor");
    expect(res.statusCode).toBe(404);
  });

  it("should get doctor by ID", async () => {
    const res = await request(app).get(`/doctor/${tempDoctorId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get doctor with invalid ID", async () => {
    const res = await request(app).get("/doctor/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 for non-existent doctor ID", async () => {
    const res = await request(app).get("/doctor/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should get doctor by specialization", async () => {
    const res = await request(app).get("/doctor/specialization/Cardiology");
    expect(res.statusCode).toBe(200);
  });

  it("should fail to get doctor by missing specialization", async () => {
  const res = await request(app).get("/doctor/specialization/");
  expect(res.statusCode).toBe(400); 
});


  it("should return 404 for non-existent specialization", async () => {
    const res = await request(app).get("/doctor/specialization/UnknownSpecialization");
    expect(res.statusCode).toBe(404);
  });

  it("should update doctor", async () => {
    const res = await request(app).put(`/doctor/${tempDoctorId}`).send({ firstName: "Updated" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("success");
  });

  it("should fail to update doctor with invalid ID", async () => {
    const res = await request(app).put("/doctor/abc").send({ firstName: "Updated" });
    expect(res.statusCode).toBe(400);
  });

  it("should fail to update doctor with empty payload", async () => {
    const res = await request(app).put(`/doctor/${tempDoctorId}`).send({});
    expect(res.statusCode).toBe(400);
  });

  it("should fail to update non-existent doctor", async () => {
    const res = await request(app).put("/doctor/99999").send({ firstName: "NoName" });
    expect(res.statusCode).toBe(404);
  });

  it("should delete doctor", async () => {
    const res = await request(app).delete(`/doctor/${tempDoctorId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should fail to delete doctor with invalid ID", async () => {
    const res = await request(app).delete("/doctor/abc");
    expect(res.statusCode).toBe(400);
  });

  it("should fail to delete non-existent doctor", async () => {
    const res = await request(app).delete("/doctor/99999");
    expect(res.statusCode).toBe(404);
  });

  it("should get doctor patients (none)", async () => {
    const res = await request(app).get(`/doctor/${tempDoctorId}/patients`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should fail to get doctor patients with invalid ID", async () => {
    const res = await request(app).get("/doctor/abc/patients");
    expect(res.statusCode).toBe(400);
  });

  it("should get doctor prescriptions (none)", async () => {
    const res = await request(app).get(`/doctor/${tempDoctorId}/prescriptions`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should fail to get doctor prescriptions with invalid ID", async () => {
    const res = await request(app).get("/doctor/abc/prescriptions");
    expect(res.statusCode).toBe(400);
  });
});
