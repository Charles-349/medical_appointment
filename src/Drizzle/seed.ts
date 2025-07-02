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

  //Insert Users
  await db.insert(UsersTable).values([
    {
      firstName: "Alice",
      lastName: "Moraa",
      email: "alice@example.com",
      password: "hashedpassword1",
      contactPhone: "0712345678",
      address: "123 Nairobi",
    },
    {
      firstName: "Brian",
      lastName: "Otieno",
      email: "brian@example.com",
      password: "hashedpassword2",
      contactPhone: "0722334455",
      address: "456 Eldoret",
    },
    {
      firstName: "Cynthia",
      lastName: "Kamau",
      email: "cynthia@example.com",
      password: "hashedpassword3",
      contactPhone: "0733445566",
      address: "789 Nakuru",
    },
    {
      firstName: "David",
      lastName: "Mutiso",
      email: "david@example.com",
      password: "hashedpassword4",
      contactPhone: "0744556677",
      address: "101 Nyeri",
    },
    {
      firstName: "Emily",
      lastName: "Njuguna",
      email: "emily@example.com",
      password: "hashedpassword5",
      contactPhone: "0755667788",
      address: "202 Mombasa",
    },
  ]);

  //Insert Doctors
  await db.insert(DoctorsTable).values([
    {
      firstName: "John",
      lastName: "Mwangi",
      specialization: "Cardiologist",
      contactPhone: "0700111222",
      availableDays: "Mon,Wed,Fri",
    },
    {
      firstName: "Faith",
      lastName: "Njeri",
      specialization: "Dermatologist",
      contactPhone: "0700333444",
      availableDays: "Tue,Thu,Sat",
    },
    {
      firstName: "Kevin",
      lastName: "Odhiambo",
      specialization: "Pediatrician",
      contactPhone: "0700555666",
      availableDays: "Mon,Tue,Thu",
    },
    {
      firstName: "Lucy",
      lastName: "Koech",
      specialization: "Orthopedic Surgeon",
      contactPhone: "0700777888",
      availableDays: "Wed,Fri,Sat",
    },
    {
      firstName: "Mark",
      lastName: "Mbugua",
      specialization: "Neurologist",
      contactPhone: "0700999000",
      availableDays: "Mon,Wed,Fri",
    },
  ]);

  //Insert Appointments
  await db.insert(AppointmentsTable).values([
    {
      userID: 1,
      doctorID: 1,
      appointmentDate: "2025-07-04",
      timeSlot: "09:30:00",
      totalAmount: "2000.00",
      appointmentStatus: "Confirmed",
    },
    {
      userID: 2,
      doctorID: 2,
      appointmentDate: "2025-07-05",
      timeSlot: "11:00:00",
      totalAmount: "2500.00",
      appointmentStatus: "Pending",
    },
    {
      userID: 3,
      doctorID: 3,
      appointmentDate: "2025-07-06",
      timeSlot: "14:00:00",
      totalAmount: "1800.00",
      appointmentStatus: "Confirmed",
    },
    {
      userID: 4,
      doctorID: 4,
      appointmentDate: "2025-07-07",
      timeSlot: "10:00:00",
      totalAmount: "3000.00",
      appointmentStatus: "Confirmed",
    },
    {
      userID: 5,
      doctorID: 5,
      appointmentDate: "2025-07-08",
      timeSlot: "13:30:00",
      totalAmount: "3500.00",
      appointmentStatus: "Pending",
    },
  ]);

  //Insert Prescriptions 
  await db.insert(PrescriptionsTable).values([
    {
      appointmentID: 1,
      doctorID: 1,
      userID: 1,
      notes: "Take 1 tablet daily for 2 weeks.",
    },
    {
      appointmentID: 2,
      doctorID: 2,
      userID: 2,
      notes: "Apply cream twice daily for 5 days.",
    },
    {
      appointmentID: 3,
      doctorID: 3,
      userID: 3,
      notes: "Schedule follow-up after 1 month.",
    },
    {
      appointmentID: 4,
      doctorID: 4,
      userID: 4,
      notes: "Physiotherapy session every week.",
    },
    {
      appointmentID: 5,
      doctorID: 5,
      userID: 5,
      notes: "Brain MRI scan recommended.",
    },
  ]);

  //Insert Payments 
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

  // Insert Complaints
  await db.insert(ComplaintsTable).values([
    {
      userID: 1,
      relatedAppointmentID: 1,
      subject: "Delayed appointment",
      description: "Doctor was late by 30 minutes.",
      status: "Resolved",
    },
    {
      userID: 2,
      relatedAppointmentID: 2,
      subject: "Billing issue",
      description: "Charged extra for consultation.",
      status: "Open",
    },
    {
      userID: 3,
      relatedAppointmentID: 3,
      subject: "Prescription problem",
      description: "Pharmacy did not accept prescription.",
      status: "In Progress",
    },
    {
      userID: 4,
      relatedAppointmentID: 4,
      subject: "Long wait time",
      description: "Waited too long for doctor to arrive.",
      status: "Open",
    },
    {
      userID: 5,
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
