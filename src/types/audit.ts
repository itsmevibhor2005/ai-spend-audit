export interface ToolInput {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  useCase: string;
}

export interface Recommendation {
  tool: string;
  currentPlan: string;
  recommendedPlan: string;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  reason: string;
}
