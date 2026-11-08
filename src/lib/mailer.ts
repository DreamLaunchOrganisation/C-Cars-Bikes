import "server-only";
import nodemailer from "nodemailer";

/**
 * Envoi d'e-mails via le SMTP de la boîte mail de l'atelier (One.com).
 * Variables d'environnement : voir .env.example.
 *
 * En développement, si SMTP_HOST n'est pas défini, le mail n'est pas envoyé :
 * il est affiché dans le terminal (pratique pour tester le formulaire).
 */

type Mail = {
  subject: string;
  text: string;
  replyTo: { name: string; address: string };
  attachments?: { filename: string; content: Buffer; contentType: string }[];
};

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP non configuré : renseignez SMTP_HOST, SMTP_USER et SMTP_PASS.");
    }
    return nodemailer.createTransport({ jsonTransport: true });
  }

  const port = Number(SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL direct, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendMail({ subject, text, replyTo, attachments }: Mail) {
  const from = process.env.SMTP_USER ?? "info@carbike.be";
  const to = process.env.CONTACT_TO ?? from;

  const info = await getTransport().sendMail({
    // L'expéditeur doit être la boîte authentifiée (exigence One.com)
    from: { name: "Site C/Cars & Bikes", address: from },
    to,
    replyTo,
    subject,
    text,
    attachments,
  });

  if (!process.env.SMTP_HOST) {
    console.info("[mailer] Mode développement — e-mail non envoyé :\n", {
      to,
      subject,
      replyTo,
      text,
      attachments: attachments?.map((a) => `${a.filename} (${a.content.length} o)`),
    });
  }
  return info;
}
