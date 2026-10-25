import "server-only";

export type OutgoingEmail = { to: string; subject: string; text: string };

/**
 * Sends plain-text email through Resend. Without RESEND_API_KEY it only logs,
 * so local development and previews never mail real people.
 */
export async function sendEmail(email: OutgoingEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[email:mock] to=${email.to} subject="${email.subject}"\n${email.text}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      reply_to: process.env.EMAIL_REPLY_TO || undefined,
      to: [email.to],
      subject: email.subject,
      text: email.text,
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}
