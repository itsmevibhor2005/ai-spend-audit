import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuditEmail(
  email: string,
  auditId: string,
  totalSavings: number,
  company?: string,
) {
  await resend.emails.send({
    from: "AI Spend Audit <onboarding@resend.dev>",

    to: email,

    subject: `${company || "Your company"} AI Spend Audit is Ready`,

    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;line-height:1.6;">
        <h2>
          ${company || "Your company"} AI Spend Audit is Ready
        </h2>

        <p>
          We analyzed your AI tooling and identified
          <strong> $${totalSavings} </strong>
          in estimated monthly savings.
        </p>

        <p>
          Your report:
        </p>

        <a
          href="${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}"
          style="display:inline-block;padding:12px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;"
        >
          View Audit Report
        </a>

        <p style="margin-top:24px;color:#666;">
          Generated for ${company || "your company"}.
        </p>
      </div>
    `,
  });
}
