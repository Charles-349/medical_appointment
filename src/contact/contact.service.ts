
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
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  
  await transporter.sendMail({
    from: `"${contact.name}" <${contact.email}>`,
    to: process.env.EMAIL_USER, 
    replyTo: contact.email,
    subject: "New Contact Message",
    text: `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nMessage: ${contact.message}`,
    html: `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone}</p>
      <p><strong>Message:</strong> ${contact.message}</p>
    `,
    
  });

  return "Contact saved and email sent successfully.";
};


