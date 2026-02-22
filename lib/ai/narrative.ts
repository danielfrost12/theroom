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
  void choice;
  const narratives = [
    "The office went quiet after you said it. Marcus looked up from his screen. Priya nodded slowly.",
    "The decision landed quietly. Elena reacted first — a half-smile that could mean anything. Slack went silent.",
    "Your co-founder exhaled. The engineer in the corner paused mid-keystroke, then kept typing.",
    "Nobody said anything for a long moment. Then Priya picked up her coffee and walked to the whiteboard.",
    "The room shifted. You could feel it in the way people moved — faster, or slower. Something changed.",
  ];
  return narratives[Math.floor(Math.random() * narratives.length)];
}
