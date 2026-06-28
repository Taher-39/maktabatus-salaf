import { NextFunction, Request, Response } from "express";
import { contactSchema } from "./contact.validation";
import { sendContactEmail } from "../../utils/email.service";

export const sendContactHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.flatten().fieldErrors });
    }

    const { name, email, subject, message } = parsed.data;

    await sendContactEmail({
      name,
      email,
      subject: subject || "(No subject)",
      message,
    });


    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    next(err);
  }
};

