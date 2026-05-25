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
    chatgpt: ["plus", "team", "enterprise"],
    claude: ["pro", "team", "enterprise"],
    cursor: ["pro", "business", "enterprise"],
    "github copilot": ["individual", "business", "enterprise"],
    windsurf: ["free", "pro"],
    v0: ["free", "premium"],
  };
  const toolLower = toolInput.toLowerCase();
  const order = tierOrder[toolLower];
  if (!order) return null;

  const currentIndex = order.indexOf(currentPlanLower);
  if (currentIndex === -1 || currentIndex === order.length - 1) return null;
  const nextPlanLower = order[currentIndex + 1];
  return plans.get(nextPlanLower) || null;
}

function getEnterpriseOrBusinessPlan(toolInput: string): PlanInfo | null {
  const plans = getPlansForTool(toolInput);
  if (!plans) return null;

  let bestPlan: PlanInfo | null = null;
  let bestPrice = Infinity;

  for (const [_, planInfo] of plans.entries()) {
    const planNameLower = planInfo.originalName.toLowerCase();
    if (
      (planNameLower === "enterprise" || planNameLower === "business") &&
      planInfo.price < bestPrice
    ) {
      bestPrice = planInfo.price;
      bestPlan = planInfo;
    }
  }
  return bestPlan;
}

export function generateAudit(tools: ToolInput[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let hasEnterpriseRecommendation = false;

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

    const enterprisePlan = getEnterpriseOrBusinessPlan(toolKey);
    if (
      seats >= 20 &&
      enterprisePlan &&
      enterprisePlan.originalName.toLowerCase() !==
        currentPlanInput.toLowerCase()
    ) {
      const enterpriseCost = enterprisePlan.price * seats;
      if (enterpriseCost < optimizedCost) {
        optimizedCost = enterpriseCost;
        recommendedPlan = enterprisePlan.originalName;
        reason = `For ${seats} seats, ${enterprisePlan.originalName} plan reduces cost from $${monthlySpend} to $${enterpriseCost}/month while providing team/enterprise features.`;
        hasEnterpriseRecommendation = true;
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
        case "windsurf":
          if (currentPlanInput.toLowerCase() === "pro" && seats <= 2) {
            canDowngrade = true;
            downgradeReason = `Small team (${seats} seats) can use Free plan for basic features.`;
          }
          if (currentPlanInput.toLowerCase() === "free" && seats >= 3) {
            canUpgrade = true;
            upgradeReason = `With ${seats} users, Pro plan offers unlimited completions and premium features.`;
          }
          break;
        case "v0":
          if (currentPlanInput.toLowerCase() === "premium" && seats <= 2) {
            canDowngrade = true;
            downgradeReason = `Small team (${seats} seats) may not need Premium features.`;
          }
          if (currentPlanInput.toLowerCase() === "free" && seats >= 3) {
            canUpgrade = true;
            upgradeReason = `For ${seats} users, Premium plan provides higher limits and advanced components.`;
          }
          break;
        case "github copilot":
        case "gemini":
          break;
      }

      if (optimizedCost === monthlySpend) {
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
    }

    if (!correctPricePerSeat) {
      reason = `Plan "${currentPlanInput}" not found for tool "${toolKey}". Using your current plan as is.`;
      optimizedCost = monthlySpend;
    }

    // Special logic for Free plan optimization
    if (correctPricePerSeat === 0 && seats > 0) {
      reason = `Using Free plan for ${seats} seat(s). No cost optimization needed.`;
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
  const totalOptimized = recommendations
    .filter(
      (r) =>
        r.tool !== "🏢 Enterprise Opportunity" &&
        r.tool !== "💡 Consolidation Suggestion",
    )
    .reduce((sum, r) => sum + r.optimizedCost, 0);

  const totalSavingsFromOptimizations = totalSpend - totalOptimized;
  const savingsPercentage =
    totalSpend > 0 ? (totalSavingsFromOptimizations / totalSpend) * 100 : 0;

  if (
    totalSpend > 1000 &&
    !hasEnterpriseRecommendation &&
    savingsPercentage < 20
  ) {
    const enterpriseDiscount = 0.85;
    const optimizedTotal = Math.round(totalSpend * enterpriseDiscount);
    const potentialSavings = totalSpend - optimizedTotal;

    recommendations.push({
      tool: "🏢 Enterprise Opportunity",
      currentPlan: "Individual subscriptions",
      recommendedPlan: "Enterprise agreement",
      currentCost: totalSpend,
      optimizedCost: optimizedTotal,
      savings: potentialSavings,
      reason: `Total spend of $${totalSpend}/month may qualify for enterprise discounts. Contact sales for custom pricing to potentially save $${potentialSavings}/month or more.`,
    });
  }

  return recommendations;
}