import { model } from "./gemini";
import { pricingData } from "@/data/pricing";
import { Recommendation } from "@/types/audit";

export async function generateSummary(
  recommendations: Recommendation[],
  totalSavings: number,
) {
  const availablePlans = pricingData
    .map(
      (item) => `
Tool: ${item.tool}
Plan: ${item.plan}
Price Per Seat: $${item.pricePerSeat}
Category: ${item.category}
`,
    )
    .join("\n");

  const currentRecommendations = recommendations
    .map(
      (r) => `
Tool: ${r.tool}
Current Plan: ${r.currentPlan}
Recommended Plan: ${r.recommendedPlan}
Current Cost: $${r.currentCost}
Optimized Cost: $${r.optimizedCost}
Savings: $${r.savings}
Reason: ${r.reason}
`,
    )
    .join("\n");

  const prompt = `
You are a senior AI infrastructure advisor working directly with startup founders and C-suite executives.

CONTEXT:
Monthly addressable savings: $${totalSavings}
Current AI tool ecosystem and available plans: ${availablePlans}
Optimization opportunities identified: ${currentRecommendations}

YOUR TASK:
Write a one-paragraph executive summary (max 120 words).

Now generate the summary:
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}
