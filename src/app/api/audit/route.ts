import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { generateAudit } from "@/lib/audit-engine";
import { generateSummary } from "@/lib/generate-summary";
import { sendAuditEmail } from "@/lib/send-audit-email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.lead?.website) {
      return NextResponse.json(
        {
          success: false,
          message: "Spam blocked",
        },
        { status: 400 },
      );
    }

    if (!body.tools || !Array.isArray(body.tools) || body.tools.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No tools provided",
        },
        { status: 400 },
      );
    }

    if (!body.lead?.email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 },
      );
    }

    for (const tool of body.tools) {
      if (
        !tool.tool ||
        !tool.plan ||
        tool.monthlySpend < 0 ||
        tool.seats <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid tool input",
          },
          { status: 400 },
        );
      }
    }

    const recommendations = generateAudit(body.tools);

    const totalSavings = recommendations.reduce(
      (acc, item) => acc + item.savings,
      0,
    );

    const aiSummary = await generateSummary(recommendations, totalSavings);

    const totalCurrentSpend = recommendations.reduce(
      (acc, item) => acc + item.currentCost,
      0,
    );

    const totalOptimizedSpend = recommendations.reduce(
      (acc, item) => acc + item.optimizedCost,
      0,
    );

    const auditData = {
      lead: {
        email: body.lead.email || "",
        company: body.lead.company || "",
        role: body.lead.role || "",
        teamSize: body.lead.teamSize || "",
      },

      tools: body.tools,

      recommendations,

      totalSavings,

      totalCurrentSpend,

      totalOptimizedSpend,

      aiSummary,

      createdAt: new Date(),
    };

    const docRef = await adminDb.collection("audits").add(auditData);

    try {
      await sendAuditEmail(body.lead.email, docRef.id, totalSavings, body.lead.company);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    return NextResponse.json({
      success: true,

      auditId: docRef.id,

      totalSavings,

      aiSummary,
    });
  } catch (error) {
    console.error("Audit API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate audit",
      },
      { status: 500 },
    );
  }
}
