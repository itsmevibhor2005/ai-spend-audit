import { model } from "./gemini";

import { pricingData } from "@/data/pricing";

export async function generateSummary(
  recommendations: any[],
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
Write a one-paragraph executive summary (max 120 words) that a founder would want to forward to their leadership team.

STYLE GUIDELINES:
- Be direct and strategic, not technical
- Use active, confident language ("We identified", "We can unlock", "Recommend consolidating")
- Frame savings in terms of runway or reallocation ("Frees up $X for engineering")
- Call out specific inefficiencies (duplicate seats, underutilized enterprise tiers, overlapping tools)
- Lead with the most impactful insight
- Close with a clear next-step or recommendation

TONE:
Confident, data-driven, action-oriented. Like a trusted advisor who respects the founder's time and intelligence.

EXAMPLES OF PHRASING TO EMULATE:
❌ "You might want to consider reducing some costs"
✅ "We've found $12,400 in annual waste from duplicate AI assistants"

❌ "There are some opportunities for optimization"
✅ "Right-size your AI spend: downgrade 3 underutilized Pro plans and consolidate 2 redundant tools"

Now generate the summary:
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}
