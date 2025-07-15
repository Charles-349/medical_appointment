
import db from "../Drizzle/db";
import { ContactTable } from "../Drizzle/schema";
import nodemailer from "nodemailer";

export const createContactService = async (contact: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) => {
  await db.insert(ContactTable).values(contact);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailRes = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, 
    subject: "New Contact Message",
    text: `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nMessage: ${contact.message}`,
    html: `<div>
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone}</p>
      <p><strong>Message:</strong> ${contact.message}</p>
    </div>`,
  });
  return "Contact saved and email sent successfully.";
};
