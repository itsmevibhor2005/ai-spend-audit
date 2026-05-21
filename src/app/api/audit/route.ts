import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

import { generateAudit } from "@/lib/audit-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const recommendations = generateAudit(body.tools);

    const totalSavings = recommendations.reduce(
      (acc, item) => acc + item.savings,
      0,
    );

    const auditData = {
      tools: body.tools,
      recommendations,
      totalSavings,
      createdAt: new Date(),
    };

    const docRef = await adminDb.collection("audits").add(auditData);

    return NextResponse.json({
      success: true,
      auditId: docRef.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
