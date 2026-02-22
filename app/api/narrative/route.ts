import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

function buildScenePrompt(context: string, choice: string, dims: { company: number; relationships: number; energy: number; integrity: number }, week: number, companyName: string): string {
  const dimSummary = `Company: ${dims.company}/100, Relationships: ${dims.relationships}/100, Energy: ${dims.energy}/100, Integrity: ${dims.integrity}/100`;
  const act = week <= 15 ? 'Act 1 (Honeymoon — optimism, building)' : week <= 35 ? 'Act 2 (The Grind — cracks show, fatigue)' : 'Act 3 (The Reckoning — legacy, cost)';
  return `You are the narrator of "The Room," a startup simulation. Write in SECOND PERSON, PRESENT TENSE. "You chose Elena. The room goes quiet." Not "The CEO decided."

Voice rules:
- Always "you" — never "the CEO" or third person
- Present tense — "Marcus looks up" not "Marcus looked up"
- Name characters: Marcus (engineer), Priya (co-founder), Elena (sales), David (investor)
- Write like a sharp magazine profile, darkly funny, specific
- 3-4 sentences. The last sentence should linger.

Company: ${companyName}. Week ${week} of 52. ${act}.
Situation: ${context}
You chose: ${choice}
Current state: ${dimSummary}

Write ONLY the consequence. No preamble. No labels. Just the scene.`;
}

function buildEndgamePrompt(ending: { type: string; line: string }, companyName: string, decisions: { week: number; context: string; choice: string }[], dims: { company: number; relationships: number; energy: number; integrity: number }): string {
  const decisionSummary = decisions.slice(-8).map(d => `Week ${d.week}: "${d.context}" → chose "${d.choice}"`).join("\n");
  return `You are the narrator of "The Room," a startup simulation. Write in second person. "You built something" not "The CEO built something."

Company: ${companyName}
Ending: ${ending.type} — ${ending.line}
Final state: Company ${dims.company}/100, Relationships ${dims.relationships}/100, Energy ${dims.energy}/100, Integrity ${dims.integrity}/100

Recent decisions:
${decisionSummary}

Write TWO things:
1. HEADLINE: One sentence (under 15 words) — the most desperate or bold moment of the run. Professionally shareable, darkly funny. Something a founder would proudly post. Second person.
2. MIRROR: One sentence about the player's leadership pattern. Observational, not preachy. The kind of line that makes someone pause. Second person present tense.

Format:
HEADLINE: [your headline]
MIRROR: [your mirror]`;
}

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type } = body;

  let prompt: string;
  if (type === 'scene') {
    const { context, choice, dims, week, companyName } = body;
    prompt = buildScenePrompt(context, choice, dims, week, companyName);
  } else if (type === 'endgame') {
    const { ending, companyName, decisions, dims } = body;
    prompt = buildEndgamePrompt(ending, companyName, decisions, dims);
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: type === 'endgame' ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Anthropic API error: ${res.status}`, errText);
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await res.json() as { content?: { text?: string }[] };
    const text = data.content?.map((i) => i.text || '').join('\n') || '';

    if (type === 'endgame') {
      const headlineMatch = text.match(/HEADLINE:\s*(.+)/);
      const mirrorMatch = text.match(/MIRROR:\s*(.+)/);
      return NextResponse.json({
        headline: headlineMatch?.[1]?.trim() || null,
        mirror: mirrorMatch?.[1]?.trim() || null,
      });
    }

    return NextResponse.json({ narrative: text });
  } catch (err) {
    console.error('Narrative generation error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
