import { GameDimensions, Ending, Decision } from '../game/types';

export async function generateNarrative(
  context: string, choice: string, dims: GameDimensions, week: number, companyName: string
): Promise<string> {
  try {
    const res = await fetch('/api/narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'scene', context, choice, dims, week, companyName }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.narrative || getFallbackNarrative(choice, context);
  } catch {
    return getFallbackNarrative(choice, context);
  }
}

export async function generateEndgameNarrative(
  ending: Ending, companyName: string, decisions: Decision[], dims: GameDimensions
): Promise<{ headline: string; mirror: string }> {
  try {
    const res = await fetch('/api/narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'endgame', ending, companyName, decisions, dims }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return {
      headline: data.headline || `Survived ${decisions.length} weeks at ${companyName}. No one saw it coming.`,
      mirror: data.mirror || "You played the only way you knew how.",
    };
  } catch {
    return {
      headline: `Survived ${decisions.length} weeks at ${companyName}. No one saw it coming.`,
      mirror: "You played the only way you knew how.",
    };
  }
}

export function getFallbackNarrative(choice: string, context: string): string {
  void context;
  const narratives = [
    `You chose "${choice}" and the office felt it immediately. Marcus looked up from his screen for the first time all day. Priya nodded slowly — she'd been waiting to see which way you'd go. David would hear about this by tomorrow.`,
    `The decision landed like a stone in still water. Elena was the first to react — a half-smile that could mean anything. Marcus went back to his code, typing faster than before. The Slack channel stayed silent for forty-five minutes.`,
    `"${choice}" — two words that changed the trajectory of the next month. Your co-founder exhaled audibly. The engineer in the corner started updating his resume, then stopped. The investor's assistant called to reschedule your Thursday catch-up.`,
  ];
  return narratives[Math.floor(Math.random() * narratives.length)];
}
