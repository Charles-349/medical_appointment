import db from "./db";
import {
  UsersTable,
  DoctorsTable,
  AppointmentsTable,
  PrescriptionsTable,
  PaymentsTable,
  ComplaintsTable,
} from "./schema";

async function seed() {
  console.log("Seeding Medical Appointment & Patient Management data...");

  // 1️⃣ Insert Users and get IDs
  const insertedUsers = await db
    .insert(UsersTable)
    .values([
      {
        firstName: "Alice",
        lastName: "Moraa",
        email: "alice@example.com",
        password: "hashedpassword1",
        contactPhone: "0712345678",
        address: "123 Nairobi",
        role: "doctor",
      },
      {
        firstName: "Brian",
        lastName: "Otieno",
        email: "brian@example.com",
        password: "hashedpassword2",
        contactPhone: "0722334455",
        address: "456 Eldoret",
        role: "doctor",
      },
      {
        firstName: "Cynthia",
        lastName: "Kamau",
        email: "cynthia@example.com",
        password: "hashedpassword3",
        contactPhone: "0733445566",
        address: "789 Nakuru",
        role: "doctor",
      },
      {
        firstName: "David",
        lastName: "Mutiso",
        email: "david@example.com",
        password: "hashedpassword4",
        contactPhone: "0744556677",
        address: "101 Nyeri",
        role: "doctor",
      },
      {
        firstName: "Emily",
        lastName: "Njuguna",
        email: "emily@example.com",
        password: "hashedpassword5",
        contactPhone: "0755667788",
        address: "202 Mombasa",
        role: "doctor",
      },
    ])
    .returning();

  console.log("Inserted users:", insertedUsers);

  // 2️⃣ Insert Doctors using userID
  const insertedDoctors = await db.insert(DoctorsTable).values([
    {
      userID: insertedUsers[0].userID,
      firstName: "John",
      lastName: "Mwangi",
      specialization: "Cardiologist",
      contactPhone: "0700111222",
      availableDays: "Mon,Wed,Fri",
    },
    {
      userID: insertedUsers[1].userID,
      firstName: "Faith",
      lastName: "Njeri",
      specialization: "Dermatologist",
      contactPhone: "0700333444",
      availableDays: "Tue,Thu,Sat",
    },
    {
      userID: insertedUsers[2].userID,
      firstName: "Kevin",
      lastName: "Odhiambo",
      specialization: "Pediatrician",
      contactPhone: "0700555666",
      availableDays: "Mon,Tue,Thu",
    },
    {
      userID: insertedUsers[3].userID,
      firstName: "Lucy",
      lastName: "Koech",
      specialization: "Orthopedic Surgeon",
      contactPhone: "0700777888",
      availableDays: "Wed,Fri,Sat",
    },
    {
      userID: insertedUsers[4].userID,
      firstName: "Mark",
      lastName: "Mbugua",
      specialization: "Neurologist",
      contactPhone: "0700999000",
      availableDays: "Mon,Wed,Fri",
    },
  ]).returning();

  console.log("Inserted doctors:", insertedDoctors);

  // 3️⃣ Insert Appointments using correct doctorID + userID
  await db.insert(AppointmentsTable).values([
    {
      userID: insertedUsers[0].userID,
      doctorID: insertedDoctors[0].doctorID,
      appointmentDate: "2025-07-04",
      timeSlot: "09:30:00",
      totalAmount: "2000.00",
      appointmentStatus: "Confirmed",
    },
    {
      userID: insertedUsers[1].userID,
      doctorID: insertedDoctors[1].doctorID,
      appointmentDate: "2025-07-05",
      timeSlot: "11:00:00",
      totalAmount: "2500.00",
      appointmentStatus: "Pending",
    },
    {
      userID: insertedUsers[2].userID,
      doctorID: insertedDoctors[2].doctorID,
      appointmentDate: "2025-07-06",
      timeSlot: "14:00:00",
      totalAmount: "1800.00",
      appointmentStatus: "Confirmed",
    },
    {
      userID: insertedUsers[3].userID,
      doctorID: insertedDoctors[3].doctorID,
      appointmentDate: "2025-07-07",
      timeSlot: "10:00:00",
      totalAmount: "3000.00",
      appointmentStatus: "Confirmed",
    },
    {
      userID: insertedUsers[4].userID,
      doctorID: insertedDoctors[4].doctorID,
      appointmentDate: "2025-07-08",
      timeSlot: "13:30:00",
      totalAmount: "3500.00",
      appointmentStatus: "Pending",
    },
  ]);

  // 4️⃣ Insert Prescriptions
  await db.insert(PrescriptionsTable).values([
    {
      appointmentID: 1,
      doctorID: insertedDoctors[0].doctorID,
      userID: insertedUsers[0].userID,
      notes: "Take 1 tablet daily for 2 weeks.",
    },
    {
      appointmentID: 2,
      doctorID: insertedDoctors[1].doctorID,
      userID: insertedUsers[1].userID,
      notes: "Apply cream twice daily for 5 days.",
    },
    {
      appointmentID: 3,
      doctorID: insertedDoctors[2].doctorID,
      userID: insertedUsers[2].userID,
      notes: "Schedule follow-up after 1 month.",
    },
    {
      appointmentID: 4,
      doctorID: insertedDoctors[3].doctorID,
      userID: insertedUsers[3].userID,
      notes: "Physiotherapy session every week.",
    },
    {
      appointmentID: 5,
      doctorID: insertedDoctors[4].doctorID,
      userID: insertedUsers[4].userID,
      notes: "Brain MRI scan recommended.",
    },
  ]);

  // 5️⃣ Insert Payments
  await db.insert(PaymentsTable).values([
    {
      appointmentID: 1,
      amount: "2000.00",
      paymentStatus: "Paid",
      transactionID: "TXN001",
      paymentDate: "2025-07-04",
    },
    {
      appointmentID: 2,
      amount: "2500.00",
      paymentStatus: "Pending",
      transactionID: "TXN002",
      paymentDate: "2025-07-05",
    },
    {
      appointmentID: 3,
      amount: "1800.00",
      paymentStatus: "Paid",
      transactionID: "TXN003",
      paymentDate: "2025-07-06",
    },
    {
      appointmentID: 4,
      amount: "3000.00",
      paymentStatus: "Paid",
      transactionID: "TXN004",
      paymentDate: "2025-07-07",
    },
    {
      appointmentID: 5,
      amount: "3500.00",
      paymentStatus: "Pending",
      transactionID: "TXN005",
      paymentDate: "2025-07-08",
    },
  ]);

  // 6️⃣ Insert Complaints
  await db.insert(ComplaintsTable).values([
    {
      userID: insertedUsers[0].userID,
      relatedAppointmentID: 1,
      subject: "Delayed appointment",
      description: "Doctor was late by 30 minutes.",
      status: "Resolved",
    },
    {
      userID: insertedUsers[1].userID,
      relatedAppointmentID: 2,
      subject: "Billing issue",
      description: "Charged extra for consultation.",
      status: "Open",
    },
    {
      userID: insertedUsers[2].userID,
      relatedAppointmentID: 3,
      subject: "Prescription problem",
      description: "Pharmacy did not accept prescription.",
      status: "In Progress",
    },
    {
      userID: insertedUsers[3].userID,
      relatedAppointmentID: 4,
      subject: "Long wait time",
      description: "Waited too long for doctor to arrive.",
      status: "Open",
    },
    {
      userID: insertedUsers[4].userID,
      relatedAppointmentID: 5,
      subject: "Wrong prescription",
      description: "Given incorrect medication instructions.",
      status: "In Progress",
    },
  ]);

  console.log("Seeding completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
