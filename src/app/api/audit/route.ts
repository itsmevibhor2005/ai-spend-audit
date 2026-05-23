import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";

import { generateAudit } from "@/lib/audit-engine";

import { generateSummary } from "@/lib/generate-summary";

export async function POST(req: Request) {
  try {
    // Parse Request Body
    const body = await req.json();

    // Validate Request
    if (!body.tools || !Array.isArray(body.tools) || body.tools.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No tools provided",
        },
        { status: 400 },
      );
    }

    // Generate Recommendations
    const recommendations = generateAudit(body.tools);

    // Calculate Total Savings
    const totalSavings = recommendations.reduce(
      (acc, item) => acc + item.savings,
      0,
    );

    // Generate AI Summary
    const aiSummary = await generateSummary(recommendations, totalSavings);

    // Calculate Spend Totals
    const totalCurrentSpend = recommendations.reduce(
      (acc, item) => acc + item.currentCost,
      0,
    );

    const totalOptimizedSpend = recommendations.reduce(
      (acc, item) => acc + item.optimizedCost,
      0,
    );

    // Create Audit Object
    const auditData = {
      tools: body.tools,

      recommendations,

      totalSavings,

      totalCurrentSpend,

      totalOptimizedSpend,

      aiSummary,

      createdAt: new Date(),
    };

    // Save To Firestore
    const docRef = await adminDb.collection("audits").add(auditData);

    // Return Success Response
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
