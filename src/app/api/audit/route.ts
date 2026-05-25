import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { generateAudit } from "@/lib/audit-engine";
import { generateSummary } from "@/lib/generate-summary";
import { sendAuditEmail } from "@/lib/send-audit-email";

export async function POST(req: Request) {
  try {
    // GitHub CI / build safety
    if (!adminDb) {
      return NextResponse.json(
        {
          success: false,
          message: "Database unavailable",
        },
        { status: 500 },
      );
    }

    const body = await req.json();

    // honeypot spam protection
    if (body.lead?.website) {
      return NextResponse.json(
        {
          success: false,
          message: "Spam blocked",
        },
        { status: 400 },
      );
    }

    // require tools
    if (!body.tools || !Array.isArray(body.tools) || body.tools.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No tools provided",
        },
        { status: 400 },
      );
    }

    // require email
    if (!body.lead?.email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 },
      );
    }

    // validate tools
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

    // audit engine
    const recommendations = generateAudit(body.tools);

    const totalSavings = recommendations.reduce(
      (acc, item) => acc + item.savings,
      0,
    );

    const totalCurrentSpend = recommendations.reduce(
      (acc, item) => acc + item.currentCost,
      0,
    );

    const totalOptimizedSpend = recommendations.reduce(
      (acc, item) => acc + item.optimizedCost,
      0,
    );

    // AI summary
    let aiSummary = "";

    try {
      aiSummary = await generateSummary(recommendations, totalSavings);
    } catch (summaryError) {
      console.error("Summary generation failed:", summaryError);

      aiSummary = `We analyzed your AI stack and identified approximately $${totalSavings.toLocaleString()} in potential monthly savings across ${recommendations.length} tools. A few plan changes and vendor optimizations could reduce spend while keeping the same workflow.`;
    }

    // Firestore doc
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

    // transactional email
    try {
      await sendAuditEmail(
        body.lead.email,
        docRef.id,
        totalSavings,
        body.lead.company,
      );
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
