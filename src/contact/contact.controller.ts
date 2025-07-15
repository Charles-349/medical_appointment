
import { Request, Response } from 'express';
import { createContactService } from './contact.service';
import db from '../Drizzle/db';
import { ContactTable } from '../Drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../mailer/mailer';

export const createContactController = async (req: Request, res: Response) => {
  try {
    const contact = req.body;
    if (!contact.name || !contact.email || !contact.phone || !contact.message) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const created = await createContactService(contact);
    const [createdContact] = await db
      .select()
      .from(ContactTable)
      .where(eq(ContactTable.email, contact.email))
      .execute();

    if (!createdContact) {
      return res.status(500).json({ message: "Contact was not saved properly." });
    }

    try {
      await sendEmail(
        process.env.SMTP_RECEIVER || '',  
        "New Contact Message",
        `Name: ${createdContact.name}\nEmail: ${createdContact.email}\nPhone: ${createdContact.phone}\nMessage: ${createdContact.message}`,
        `<div>
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${createdContact.name}</p>
          <p><strong>Email:</strong> ${createdContact.email}</p>
          <p><strong>Phone:</strong> ${createdContact.phone}</p>
          <p><strong>Message:</strong> ${createdContact.message}</p>
        </div>`
      );
    } catch (emailError) {
      console.error("Failed to send contact notification email:", emailError);
    }

    return res.status(201).json({
      message: "Contact message received successfully. We'll get back to you soon!",
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

