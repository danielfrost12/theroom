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

export async function evaluateCustomChoice(
  customText: string, context: string, dims: GameDimensions, week: number, companyName: string
): Promise<{ company: number; relationships: number; energy: number; integrity: number }> {
  try {
    const res = await fetch('/api/narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'evaluate', customText, context, dims, week, companyName }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    if (data.company !== undefined) {
      return {
        company: Math.max(-20, Math.min(20, data.company || 0)),
        relationships: Math.max(-20, Math.min(20, data.relationships || 0)),
        energy: Math.max(-20, Math.min(20, data.energy || 0)),
        integrity: Math.max(-20, Math.min(20, data.integrity || 0)),
      };
    }
    return getFallbackCustomEffects();
  } catch {
    return getFallbackCustomEffects();
  }
}

function getFallbackCustomEffects(): { company: number; relationships: number; energy: number; integrity: number } {
  // Fallback: modest positive on one random dim, slight cost on energy
  const dims = ['company', 'relationships', 'energy', 'integrity'] as const;
  const boost = dims[Math.floor(Math.random() * dims.length)];
  const result = { company: -3, relationships: -3, energy: -5, integrity: 0 };
  result[boost] = 8;
  return result;
}

export function getFallbackNarrative(choice: string, context: string): string {
  void context;
  void choice;
  const narratives = [
    "Marcus looks up. Priya doesn't.",
    "Slack goes quiet. Elena's typing indicator disappears.",
    "Priya exhales. The whiteboard marker is already in her hand.",
    "The room shifts. Nobody makes eye contact.",
    "David's read receipt appears. No reply.",
    "Marcus nods once. That's enough.",
    "Elena closes her laptop. Slowly.",
    "You hear Priya laugh in the next room. It doesn't sound happy.",
  ];
  return narratives[Math.floor(Math.random() * narratives.length)];
}
