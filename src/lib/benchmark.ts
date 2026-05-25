export function getBenchmark(totalSpend: number, teamSize: number) {
  const perDev = teamSize > 0 ? Math.round(totalSpend / teamSize) : 0;

  let average = 60;

  if (teamSize <= 5) {
    average = 55;
  } else if (teamSize <= 20) {
    average = 70;
  } else {
    average = 95;
  }

  const diffPct =
    average > 0 ? Math.round(((perDev - average) / average) * 100) : 0;

  const label =
    diffPct === 0
      ? "At average"
      : diffPct > 0
        ? `${diffPct}% above average`
        : `${Math.abs(diffPct)}% below average`;

  return {
    perDev,
    average,
    diffPct,
    label,
  };
}
