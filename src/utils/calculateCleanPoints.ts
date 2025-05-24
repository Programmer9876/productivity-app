export const calculateCleanPoints = (entries: { tier?: number }[]): number => {
  let points = 0;

  for (const entry of entries) {
    const tier = entry.tier ?? 0;

    if (tier === 0) {
      points += 1;
    } else if (tier === 1) {
      points -= 1;
    } else if (tier === 2) {
      points -= 3;
    } else if (tier === 3) {
      points = 0; // wipe out all
    }
  }

  return Math.max(0, points); // never negative
};