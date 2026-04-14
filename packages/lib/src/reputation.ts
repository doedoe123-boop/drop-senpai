const REPUTATION_TIERS = [
  { minPoints: 100, title: "Scene Operator", tier: 5 },
  { minPoints: 60, title: "Drop Hunter", tier: 4 },
  { minPoints: 30, title: "Insider", tier: 3 },
  { minPoints: 10, title: "Spotter", tier: 2 },
  { minPoints: 0, title: "New Scout", tier: 1 },
] as const;

export function getReputationTitle(points: number): {
  title: string;
  tier: number;
} {
  const safePoints = Math.max(0, points);

  for (const level of REPUTATION_TIERS) {
    if (safePoints >= level.minPoints) {
      return { title: level.title, tier: level.tier };
    }
  }

  return { title: "New Scout", tier: 1 };
}
