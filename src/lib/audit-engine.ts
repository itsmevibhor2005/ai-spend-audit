import { Recommendation, ToolInput } from "@/types/audit";
import { pricingData } from "@/data/pricing";

type PlanInfo = { originalName: string; price: number };

const toolMap = new Map<string, Map<string, PlanInfo>>();

for (const entry of pricingData) {
  const toolLower = entry.tool.toLowerCase();
  const planLower = entry.plan.toLowerCase();

  if (!toolMap.has(toolLower)) {
    toolMap.set(toolLower, new Map());
  }
  toolMap.get(toolLower)!.set(planLower, {
    originalName: entry.plan,
    price: entry.pricePerSeat,
  });
}

function getPlansForTool(toolInput: string): Map<string, PlanInfo> | null {
  return toolMap.get(toolInput.toLowerCase()) || null;
}

function getPlanInfo(toolInput: string, planInput: string): PlanInfo | null {
  const plans = getPlansForTool(toolInput);
  if (!plans) return null;
  return plans.get(planInput.toLowerCase()) || null;
}

function getCheapestPlan(
  toolInput: string,
): { plan: string; price: number } | null {
  const plans = getPlansForTool(toolInput);
  if (!plans) return null;
  let cheapestPlan = "";
  let cheapestPrice = Infinity;
  for (const [planLower, { originalName, price }] of plans.entries()) {
    if (price < cheapestPrice) {
      cheapestPrice = price;
      cheapestPlan = originalName;
    }
  }
  return { plan: cheapestPlan, price: cheapestPrice };
}

function getHigherTierPlan(
  toolInput: string,
  currentPlanLower: string,
): PlanInfo | null {
  const plans = getPlansForTool(toolInput);
  if (!plans) return null;

  const tierOrder: Record<string, string[]> = {
    chatgpt: ["plus", "team"],
    claude: ["pro", "team"],
    cursor: ["pro", "business"],
  };
  const toolLower = toolInput.toLowerCase();
  const order = tierOrder[toolLower];
  if (!order) return null;

  const currentIndex = order.indexOf(currentPlanLower);
  if (currentIndex === -1 || currentIndex === order.length - 1) return null;
  const nextPlanLower = order[currentIndex + 1];
  return plans.get(nextPlanLower) || null;
}

export function generateAudit(tools: ToolInput[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const item of tools) {
    const toolKey = item.tool;
    const currentPlanInput = item.plan;
    const seats = item.seats;
    const monthlySpend = item.monthlySpend;

    const planInfo = getPlanInfo(toolKey, currentPlanInput);
    const correctPricePerSeat = planInfo?.price ?? null;
    const expectedCorrectSpend = correctPricePerSeat
      ? correctPricePerSeat * seats
      : null;
    const currentPlanOriginal = planInfo?.originalName ?? currentPlanInput;

    let optimizedCost = monthlySpend;
    let recommendedPlan = currentPlanOriginal;
    let reason = "Your current setup appears reasonably optimized.";

    if (
      expectedCorrectSpend !== null &&
      Math.abs(monthlySpend - expectedCorrectSpend) > 0.01
    ) {
      if (monthlySpend > expectedCorrectSpend) {
        optimizedCost = expectedCorrectSpend;
        reason = `You're overpaying! Expected cost for ${seats} ${currentPlanOriginal} seat(s) is $${expectedCorrectSpend}/month. Verify your billing or switch to standard pricing.`;
      } else if (monthlySpend < expectedCorrectSpend) {
        reason = `You're paying less than standard pricing ($${expectedCorrectSpend} expected). Great deal! No optimization needed.`;
        optimizedCost = monthlySpend;
      }
    }

    const allPlans = getPlansForTool(toolKey);
    if (allPlans && allPlans.size > 1 && correctPricePerSeat) {
      const cheapest = getCheapestPlan(toolKey);
      const higherTier = getHigherTierPlan(
        toolKey,
        currentPlanInput.toLowerCase(),
      );

      let canDowngrade = false;
      let canUpgrade = false;
      let downgradeReason = "";
      let upgradeReason = "";

      switch (toolKey.toLowerCase()) {
        case "cursor":
          if (currentPlanInput.toLowerCase() === "business" && seats <= 3) {
            canDowngrade = true;
            downgradeReason = `Small team (${seats} seats) doesn't need Business features.`;
          }
          if (currentPlanInput.toLowerCase() === "pro" && seats >= 4) {
            canUpgrade = true;
            upgradeReason = `Larger teams (${seats}+ seats) benefit from Business features (SSO, advanced security).`;
          }
          break;
        case "chatgpt":
          if (currentPlanInput.toLowerCase() === "team" && seats <= 2) {
            canDowngrade = true;
            downgradeReason = `Teams under 3 users don't benefit from Team features.`;
          }
          if (currentPlanInput.toLowerCase() === "plus" && seats >= 3) {
            canUpgrade = true;
            upgradeReason = `With ${seats} users, ChatGPT Team offers admin controls and higher rate limits.`;
          }
          break;
        case "claude":
          if (currentPlanInput.toLowerCase() === "team" && seats <= 2) {
            canDowngrade = true;
            downgradeReason = `Small teams save with Pro plan.`;
          }
          if (currentPlanInput.toLowerCase() === "pro" && seats >= 3) {
            canUpgrade = true;
            upgradeReason = `For ${seats} users, Claude Team provides shared billing and priority support.`;
          }
          break;
        case "github copilot":
        case "gemini":
          break;
      }

      if (canDowngrade && cheapest && cheapest.price < correctPricePerSeat) {
        const newCost = cheapest.price * seats;
        if (newCost < optimizedCost) {
          optimizedCost = newCost;
          recommendedPlan = cheapest.plan;
          reason =
            downgradeReason +
            ` Switch from ${currentPlanOriginal} to ${cheapest.plan} saves $${correctPricePerSeat - cheapest.price}/seat/month.`;
        }
      } else if (
        canUpgrade &&
        higherTier &&
        higherTier.price > correctPricePerSeat
      ) {
        const newCost = higherTier.price * seats;
        if (newCost <= monthlySpend * 1.2) {
          optimizedCost = newCost;
          recommendedPlan = higherTier.originalName;
          reason =
            upgradeReason +
            ` Upgrade to ${higherTier.originalName} costs $${(higherTier.price - correctPricePerSeat) * seats}/month more but adds essential team features.`;
        }
      }
    }

    if (monthlySpend > 500 && optimizedCost === monthlySpend) {
      optimizedCost = monthlySpend * 0.75;
      reason = `High spend detected. Consider volume discounts or API migration.`;
    }

    if (seats >= 20 && currentPlanOriginal.toLowerCase() !== "enterprise") {
      reason = `Consider enterprise pricing for ${seats} seats.`;
    }

    if (monthlySpend <= 10) {
      reason = "Minimal spend, no optimization needed.";
    }

    if (!correctPricePerSeat) {
      reason = `Plan "${currentPlanInput}" not found for tool "${toolKey}". Using your current plan as is.`;
      optimizedCost = monthlySpend;
    }

    const savings = Math.max(0, Math.round(monthlySpend - optimizedCost));

    recommendations.push({
      tool: item.tool,
      currentPlan: currentPlanOriginal,
      recommendedPlan,
      currentCost: monthlySpend,
      optimizedCost: Math.round(optimizedCost),
      savings,
      reason,
    });
  }

  const assistantTools = tools.filter((t) =>
    ["chatgpt", "claude", "gemini"].includes(t.tool.toLowerCase()),
  );

  if (assistantTools.length >= 2) {
    const sorted = [...assistantTools].sort(
      (a, b) => a.monthlySpend - b.monthlySpend,
    );
    const keep = sorted[0];
    const discard = sorted.slice(1);

    const totalCurrent = assistantTools.reduce(
      (sum, t) => sum + t.monthlySpend,
      0,
    );
    const optimizedTotal = keep.monthlySpend;
    const potentialSavings = totalCurrent - optimizedTotal;

    if (potentialSavings > 0) {
      const discardNames = discard.map((d) => d.tool).join(", ");
      recommendations.push({
        tool: "💡 Consolidation Suggestion",
        currentPlan: "Multiple assistant subscriptions",
        recommendedPlan: `Keep only ${keep.tool}`,
        currentCost: totalCurrent,
        optimizedCost: optimizedTotal,
        savings: potentialSavings,
        reason: `You're paying for ${assistantTools.length} assistants (${assistantTools.map((t) => t.tool).join(", ")}). Their capabilities overlap. Keep ${keep.tool} and cancel ${discardNames} to save $${potentialSavings}/month.`,
      });
    }
  }

  const totalSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  if (totalSpend > 1000) {
    recommendations.push({
      tool: "🏢 Enterprise Opportunity",
      currentPlan: "Individual subscriptions",
      recommendedPlan: "Enterprise agreement",
      currentCost: totalSpend,
      optimizedCost: Math.round(totalSpend * 0.7),
      savings: Math.round(totalSpend * 0.3),
      reason: `Total spend of $${totalSpend}/month qualifies for enterprise discounts. Contact sales for custom pricing.`,
    });
  }

  return recommendations;
}
