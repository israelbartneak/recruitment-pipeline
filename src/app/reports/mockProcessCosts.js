// src/app/reports/mockProcessCosts.js
export const mockProcessCosts = [
  { id: "pc1", name: "LinkedIn Recruiter", amount: 2000, frequency: "yearly" },
  { id: "pc2", name: "CareerPlug", amount: 25, frequency: "monthly" },
  { id: "pc3", name: "Tuboscribe", amount: 100, frequency: "yearly" },
];

export function getAnnualCost(cost) {
  return cost.frequency === "monthly" ? cost.amount * 12 : cost.amount;
}