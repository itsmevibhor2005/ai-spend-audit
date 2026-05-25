import { describe, test, expect } from "@jest/globals";
import { generateAudit } from "../audit-engine";
import { ToolInput } from "@/types/audit";

describe("Audit Engine", () => {
  test("detects overpayment and corrects Cursor Pro pricing", () => {
    const tools: ToolInput[] = [
      {
        tool: "Cursor",
        plan: "Pro",
        seats: 5,
        monthlySpend: 150,
        useCase: "coding",
      },
    ];

    const recs = generateAudit(tools);

    expect(recs[0].optimizedCost).toBe(100);
    expect(recs[0].savings).toBe(50);
    expect(recs[0].reason.toLowerCase()).toContain("overpaying");
  });

  test("recommends Claude Enterprise for large Max team", () => {
    const tools: ToolInput[] = [
      {
        tool: "Claude",
        plan: "Max",
        seats: 50,
        monthlySpend: 5000,
        useCase: "research",
      },
    ];

    const recs = generateAudit(tools);

    expect(recs[0].recommendedPlan).toBe("Enterprise");
    expect(recs[0].optimizedCost).toBe(3000);
    expect(recs[0].savings).toBe(2000);
  });

  test("keeps ChatGPT Plus when Team costs significantly more", () => {
    const tools: ToolInput[] = [
      {
        tool: "ChatGPT",
        plan: "Plus",
        seats: 3,
        monthlySpend: 60,
        useCase: "research",
      },
    ];

    const recs = generateAudit(tools);

    expect(recs[0].recommendedPlan).toBe("Plus");
    expect(recs[0].optimizedCost).toBe(60);
  });

  test("downgrades Windsurf Pro to Free for small team", () => {
    const tools: ToolInput[] = [
      {
        tool: "Windsurf",
        plan: "Pro",
        seats: 2,
        monthlySpend: 40,
        useCase: "coding",
      },
    ];

    const recs = generateAudit(tools);

    expect(recs[0].recommendedPlan).toBe("Free");
    expect(recs[0].optimizedCost).toBe(0);
    expect(recs[0].savings).toBe(40);
  });

  test("adds consolidation suggestion for multiple assistants", () => {
    const tools: ToolInput[] = [
      {
        tool: "ChatGPT",
        plan: "Plus",
        seats: 1,
        monthlySpend: 20,
        useCase: "research",
      },
      {
        tool: "Claude",
        plan: "Pro",
        seats: 1,
        monthlySpend: 20,
        useCase: "research",
      },
      {
        tool: "Gemini",
        plan: "Pro",
        seats: 1,
        monthlySpend: 20,
        useCase: "research",
      },
    ];

    const recs = generateAudit(tools);

    const consolidation = recs.find(
      (r) => r.tool === "💡 Consolidation Suggestion",
    );

    expect(consolidation).toBeDefined();
    expect(consolidation?.savings).toBe(40);
  });

  test("shows enterprise opportunity for high total spend", () => {
    const tools: ToolInput[] = [
      {
        tool: "ChatGPT",
        plan: "Team",
        seats: 15,
        monthlySpend: 450,
        useCase: "research",
      },
      {
        tool: "Cursor",
        plan: "Business",
        seats: 15,
        monthlySpend: 600,
        useCase: "coding",
      },
      {
        tool: "GitHub Copilot",
        plan: "Business",
        seats: 15,
        monthlySpend: 285,
        useCase: "coding",
      },
      {
        tool: "Claude",
        plan: "Team",
        seats: 15,
        monthlySpend: 450,
        useCase: "research",
      },
    ];

    const recs = generateAudit(tools);

    const enterprise = recs.find((r) => r.tool === "🏢 Enterprise Opportunity");

    expect(enterprise).toBeDefined();
    expect(enterprise?.currentCost).toBe(1785);
  });
});
