export function getPlayerStats() {
  return {
    totalPlayers: "11,847",
    avgWeeks: "19 wks",
    ipoRate: "3%",
  };
}

export function getPlayerRank(): number {
  return Math.max(1, Math.floor(Math.random() * 800) + 1);
}

export function getTotalPlayerCount(): string {
  return "11,847";
}
