import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

type DimValues = { company: number; relationships: number; energy: number; integrity: number };

function buildScenePrompt(
  context: string, choice: string, dims: DimValues, week: number, companyName: string,
  departedCharacters?: string[], unchosenOption?: string,
  chosenEffects?: Partial<DimValues>, unchosenEffects?: Partial<DimValues>, category?: string,
): string {
  const dimSummary = `Company: ${dims.company}/100, Relationships: ${dims.relationships}/100, Energy: ${dims.energy}/100, Integrity: ${dims.integrity}/100`;
  const act = week <= 7 ? 'Act 1 (Honeymoon — optimism, building)' : week <= 17 ? 'Act 2 (The Grind — cracks show, fatigue)' : 'Act 3 (The Reckoning — legacy, cost)';
  const departedNote = departedCharacters && departedCharacters.length > 0
    ? `\n- IMPORTANT: ${departedCharacters.join(' and ')} already LEFT the company. Do NOT mention them. They are gone.`
    : '';

  // Build tradeoff context so the AI knows what the choice cost and gained
  const dimLabels: Record<string, string> = {
    company: 'product/company', relationships: 'team trust', energy: 'personal energy', integrity: 'integrity'
  };
  let tradeoffBlock = '';
  if (chosenEffects) {
    const gains: string[] = [];
    const costs: string[] = [];
    for (const [k, v] of Object.entries(chosenEffects)) {
      if (v && v >= 5) gains.push(dimLabels[k] || k);
      else if (v && v <= -5) costs.push(dimLabels[k] || k);
    }
    if (gains.length > 0 || costs.length > 0) {
      tradeoffBlock = `\nTradeoff: ${gains.length > 0 ? `gained ${gains.join(' and ')}` : 'no clear gain'}${costs.length > 0 ? `, lost ${costs.join(' and ')}` : ''}.`;
    }
  }

  const rejectedBlock = unchosenOption ? `\nRejected: "${unchosenOption}"` : '';
  const categoryBlock = category ? `\nDilemma type: ${category}` : '';

  return `Narrator of "The Room," a startup simulation. SECOND PERSON, PRESENT TENSE only.

Rules — break any and the output is rejected:
- Always "you" — never "the CEO" or third person
- Present tense only
- Characters: Marcus (engineer), Priya (co-founder), Elena (sales), David (investor)${departedNote}
- 1-2 sentences ONLY. Maximum 30 words.
- The narrative MUST show DIRECT cause-and-effect: what they chose and what it caused.
- Reference the specific tradeoff — what they gained and what it cost them.
- Subtly imply what was lost by not choosing the alternative.
- No preamble, no labels, no quotation marks around the whole response.

Good: "Trusting Marcus bought loyalty but the sprint slipped. Two clients noticed."
Good: "You told the board the truth. David nodded. The valuation dropped."
Bad: "The room shifts. Nobody makes eye contact." (too generic — WHERE is the cause-and-effect?)

Company: ${companyName}. Week ${week}/24. ${act}.${categoryBlock}
Situation: ${context}
Chose: "${choice}"${rejectedBlock}${tradeoffBlock}
State: ${dimSummary}

Write the consequence of choosing "${choice}"${unchosenOption ? ` over "${unchosenOption}"` : ''}. Cause and effect. 1-2 sentences. 30 words max.`;
}

function buildEvaluatePrompt(customText: string, context: string, dims: { company: number; relationships: number; energy: number; integrity: number }, week: number, companyName: string): string {
  const dimSummary = `Company: ${dims.company}/100, Relationships: ${dims.relationships}/100, Energy: ${dims.energy}/100, Integrity: ${dims.integrity}/100`;
  const act = week <= 7 ? 'Act 1 (Honeymoon)' : week <= 17 ? 'Act 2 (The Grind)' : 'Act 3 (The Reckoning)';
  return `You are the game engine for "The Room," a startup CEO simulation. A player typed a CUSTOM action instead of choosing from preset options. You must judge how this action affects the company.

Company: ${companyName}. Week ${week}/24. ${act}.
Current state: ${dimSummary}
Situation they're responding to: ${context}
Their custom action: "${customText}"

RULES FOR JUDGING — be fair, reward creativity:
- Judge the action's RELEVANCE to the situation. Off-topic or lazy inputs (gibberish, "idk", single words) should hurt.
- Judge STRATEGIC THINKING. Does the action address the root problem? Does it show understanding of tradeoffs?
- Judge CREATIVITY. Novel solutions that a real founder might try should be rewarded more than obvious ones.
- THERE IS NO SINGLE CORRECT ANSWER. Many approaches can work. Be unbiased about strategy style.
- Effects range from -20 to +20 per dimension. Most effects should be -10 to +10.
- Every action has TRADEOFFS. Nothing is free. A bold move might boost company but cost energy.
- An action that ignores the situation entirely should have mostly negative effects (-5 to -10 each).
- A thoughtful, creative action addressing the problem should have a clear positive (+8 to +15) on the most relevant dimension, with realistic costs elsewhere.

Return ONLY a JSON object with five fields — four numbers and a verdict.

The verdict MUST explain the CAUSE AND EFFECT of their action in under 15 words. The player needs to understand WHY their move helped or hurt. Be specific about what happened as a result.

Good verdicts (explain cause→effect):
- "Hiring externally calmed investors but your team felt passed over."
- "The pivot bought time, but you burned two weeks of momentum."
- "Transparency won the team's trust. The board didn't love the honesty."
- "That solved nothing. The real problem got worse while you stalled."
- "Going direct to customers bypassed the sales team. Elena noticed."

Bad verdicts (too vague, no cause→effect):
- "Bold. The board noticed." ← noticed WHAT?
- "Creative — but it'll cost you." ← cost me HOW?
- "Risky move." ← WHY is it risky?

{"company": X, "relationships": X, "energy": X, "integrity": X, "verdict": "cause and effect in under 15 words"}`;
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
    const { context, choice, dims, week, companyName, departedCharacters, unchosenOption, chosenEffects, unchosenEffects, category } = body;
    prompt = buildScenePrompt(context, choice, dims, week, companyName, departedCharacters, unchosenOption, chosenEffects, unchosenEffects, category);
  } else if (type === 'endgame') {
    const { ending, companyName, decisions, dims } = body;
    prompt = buildEndgamePrompt(ending, companyName, decisions, dims);
  } else if (type === 'evaluate') {
    // AI-judged custom choice: evaluate player's creative input and return dimension effects
    const { customText, context, dims, week, companyName } = body;
    const evalPrompt = buildEvaluatePrompt(customText, context, dims, week, companyName);

    try {
      const res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 100,
          messages: [{ role: 'user', content: evalPrompt }],
        }),
      });

      if (!res.ok) {
        return NextResponse.json({ company: 0, relationships: 0, energy: -3, integrity: 0 });
      }

      const data = await res.json() as { content?: { text?: string }[] };
      const text = data.content?.map((i) => i.text || '').join('') || '';

      // Parse JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const effects = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            company: Math.max(-20, Math.min(20, effects.company || 0)),
            relationships: Math.max(-20, Math.min(20, effects.relationships || 0)),
            energy: Math.max(-20, Math.min(20, effects.energy || 0)),
            integrity: Math.max(-20, Math.min(20, effects.integrity || 0)),
            verdict: typeof effects.verdict === 'string' ? effects.verdict.slice(0, 80) : null,
          });
        } catch {
          return NextResponse.json({ company: 0, relationships: 0, energy: -3, integrity: 0 });
        }
      }
      return NextResponse.json({ company: 0, relationships: 0, energy: -3, integrity: 0 });
    } catch {
      return NextResponse.json({ company: 0, relationships: 0, energy: -3, integrity: 0 });
    }
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
        max_tokens: type === 'endgame' ? 200 : 150,
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
