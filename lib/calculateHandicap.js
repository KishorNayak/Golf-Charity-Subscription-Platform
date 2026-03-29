export function calculateHandicap(scores) {

  if (scores == null) return 0

  const lastTen =
    scores.slice(0, 10)

  const bestFive =
    lastTen
      .sort((a, b) =>
        a.score - b.score
      )
      .slice(0, 5)

  const avg =
    bestFive.reduce(
      (sum, s) => sum + s.score,
      0
    ) / bestFive.length

  return (avg - 72).toFixed(2)
}