import { pricingData } from "@/data/pricing";

export function calculatePrice(tool: string, plan: string, seats: number) {
  const pricing = pricingData.find(
    (item) => item.tool === tool && item.plan === plan,
  );

  if (!pricing) return 0;

  return pricing.pricePerSeat * seats;
}
