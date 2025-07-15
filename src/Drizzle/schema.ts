/* istanbul ignore file */
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, varchar, text, integer, decimal, boolean, timestamp, date, time } from "drizzle-orm/pg-core";

//Enums
export const RoleEnum = pgEnum("role", ["admin", "user", "doctor"]);
export const AppointmentStatusEnum = pgEnum("appointment_status", ["Pending", "Confirmed", "Cancelled"]);
export const ComplaintStatusEnum = pgEnum("complaint_status", ["Open", "In Progress", "Resolved", "Closed"]);

//Users Table
export const UsersTable = pgTable("users", {
  userID: serial("user_id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  role: RoleEnum("role").default("user"),
  imageURL: varchar("image_url", { length: 255 }).default(
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  ),
  isVerified: boolean("is_verified").default(false),
  verificationCode: varchar("verification_code", { length: 10 }),
  verificationCodeExpiresAt: timestamp("verification_code_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

//Doctors Table
export const DoctorsTable = pgTable("doctors", {
  doctorID: serial("doctor_id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  availableDays: varchar("available_days", { length: 100 }), // you can normalize this later
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

//Appointments Table 
export const AppointmentsTable = pgTable("appointments", {
  appointmentID: serial("appointment_id").primaryKey(),
  userID: integer("user_id").notNull().references(() => UsersTable.userID, { onDelete: "cascade" }),
  doctorID: integer("doctor_id").notNull().references(() => DoctorsTable.doctorID, { onDelete: "cascade" }),
  appointmentDate: date("appointment_date").notNull(),
  timeSlot: time("time_slot").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  appointmentStatus: AppointmentStatusEnum("appointment_status").default("Pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

//Prescriptions Table
export const PrescriptionsTable = pgTable("prescriptions", {
  prescriptionID: serial("prescription_id").primaryKey(),
  appointmentID: integer("appointment_id").notNull().references(() => AppointmentsTable.appointmentID, { onDelete: "cascade" }),
  doctorID: integer("doctor_id").notNull().references(() => DoctorsTable.doctorID, { onDelete: "cascade" }),
  userID: integer("user_id").notNull().references(() => UsersTable.userID, { onDelete: "cascade" }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

//Payments Table 
export const PaymentsTable = pgTable("payments", {
  paymentID: serial("payment_id").primaryKey(),
  appointmentID: integer("appointment_id").notNull().unique().references(() => AppointmentsTable.appointmentID, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }),
  transactionID: varchar("transaction_id", { length: 100 }),
  paymentDate: date("payment_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Complaints Table 
export const ComplaintsTable = pgTable("complaints", {
  complaintID: serial("complaint_id").primaryKey(),
  userID: integer("user_id").notNull().references(() => UsersTable.userID, { onDelete: "cascade" }),
  relatedAppointmentID: integer("related_appointment_id").references(() => AppointmentsTable.appointmentID, { onDelete: "set null" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description"),
  status: ComplaintStatusEnum("complaint_status").default("Open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ContactTable = pgTable("contacts", {
  contactID: serial("contactID").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  message: varchar("message", { length: 1000 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});



//RELATIONSHIPS

// Users
export const UsersRelations = relations(UsersTable, ({ many }) => ({
  appointments: many(AppointmentsTable),
  prescriptions: many(PrescriptionsTable),
  complaints: many(ComplaintsTable),
}));

// Doctors
export const DoctorsRelations = relations(DoctorsTable, ({ many }) => ({
  appointments: many(AppointmentsTable),
  prescriptions: many(PrescriptionsTable),
}));

// Appointments
export const AppointmentsRelations = relations(AppointmentsTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [AppointmentsTable.userID],
    references: [UsersTable.userID],
  }),
  doctor: one(DoctorsTable, {
    fields: [AppointmentsTable.doctorID],
    references: [DoctorsTable.doctorID],
  }),
  prescription: many(PrescriptionsTable),
  payment: one(PaymentsTable, {
    fields: [AppointmentsTable.appointmentID],
    references: [PaymentsTable.appointmentID],
  }),
  complaints: many(ComplaintsTable),
}));

// Prescriptions
export const PrescriptionsRelations = relations(PrescriptionsTable, ({ one }) => ({
  appointment: one(AppointmentsTable, {
    fields: [PrescriptionsTable.appointmentID],
    references: [AppointmentsTable.appointmentID],
  }),
  doctor: one(DoctorsTable, {
    fields: [PrescriptionsTable.doctorID],
    references: [DoctorsTable.doctorID],
  }),
  user: one(UsersTable, {
    fields: [PrescriptionsTable.userID],
    references: [UsersTable.userID],
  }),
}));

// Payments
export const PaymentsRelations = relations(PaymentsTable, ({ one }) => ({
  appointment: one(AppointmentsTable, {
    fields: [PaymentsTable.appointmentID],
    references: [AppointmentsTable.appointmentID],
  }),
}));

// Complaints
export const ComplaintsRelations = relations(ComplaintsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [ComplaintsTable.userID],
    references: [UsersTable.userID],
  }),
  appointment: one(AppointmentsTable, {
    fields: [ComplaintsTable.relatedAppointmentID],
    references: [AppointmentsTable.appointmentID],
  }),
}));


export type TIUser = typeof UsersTable.$inferInsert;
export type TIDoctor = typeof DoctorsTable.$inferInsert;
export type TIAppointment = typeof AppointmentsTable.$inferInsert;
export type TIPrescription = typeof PrescriptionsTable.$inferInsert;
export type TIPayment = typeof PaymentsTable.$inferInsert;
export type UpdatePayment = Partial<Omit<TIPayment, 'appointmentID'>> & { updatedAt?: Date | null };
export type TIComplaint = typeof ComplaintsTable.$inferInsert;

export type TSUser = typeof UsersTable.$inferSelect;
export type TSDoctor = typeof DoctorsTable.$inferSelect;
export type TSAppointment = typeof AppointmentsTable.$inferSelect;
export type TSPrescription = typeof PrescriptionsTable.$inferSelect;
export type TSPayment = typeof PaymentsTable.$inferSelect;
export type TSComplaint = typeof ComplaintsTable.$inferSelect;
