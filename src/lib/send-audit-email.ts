import { Resend } from "resend";

export async function sendAuditEmail(
  email: string,
  auditId: string,
  totalSavings: number,
  company?: string,
) {
  const apiKey = process.env.RESEND_API_KEY;

  // CI / local safety
  if (!apiKey) {
    console.warn("RESEND_API_KEY missing, skipping email");
    return;
  }

  const resend = new Resend(apiKey);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const auditUrl = `${appUrl}/audit/${auditId}`;

  await resend.emails.send({
    from: "AI Spend Audit <onboarding@resend.dev>",

    to: email,

    subject: company
      ? `${company} AI spend audit is ready`
      : "Your AI spend audit is ready",

    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2>
          ${company ? `${company} AI Spend Audit` : "AI Spend Audit"}
        </h2>

        <p>
          Your audit is ready.
        </p>

        <p>
          Estimated monthly savings:
          <strong>
            $${totalSavings.toLocaleString()}
          </strong>
        </p>

        <p>
          <a href="${auditUrl}">
            View audit report
          </a>
        </p>
      </div>
    `,
  });
}
