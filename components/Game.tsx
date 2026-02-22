'use client';

import { useState, useEffect } from 'react';
import { FONTS } from '@/lib/game/constants';
import { GameDimensions, Ending, Decision, IndexedTension } from '@/lib/game/types';
import { getSceneForState, getBreathingMoment, getTension, checkEnding } from '@/lib/game/engine';
import { generateNarrative } from '@/lib/ai/narrative';
import { SceneBackground } from './SceneBackground';
import { DimBar } from './DimBar';

interface GameProps {
  companyName: string;
  firstChoice: string;
  onEnd: (ending: Ending, arr: number, dims: GameDimensions, decisions: Decision[], weekLog: string[]) => void;
}

export function Game({ companyName, firstChoice, onEnd }: GameProps) {
  void firstChoice;
  const [week, setWeek] = useState(1);
  const [cash, setCash] = useState(2500);
  const [arr, setArr] = useState(0);
  const [dims, setDims] = useState<GameDimensions>({ company: 60, relationships: 70, energy: 80, integrity: 80 });
  const [tension, setTension] = useState<IndexedTension | null>(null);
  const [usedTensions, setUsedTensions] = useState<Set<number>>(new Set());
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [breathingMoment, setBreathingMoment] = useState<string | null>(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [weekLog, setWeekLog] = useState<string[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [compressWeeks, setCompressWeeks] = useState(0);

  // Get initial tension
  useEffect(() => {
    const t = getTension(week, usedTensions);
    setTension(t);
    setUsedTensions(prev => new Set([...prev, t.idx]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sceneKey = getSceneForState(dims, week);

  const isDesperate = dims.company < 35 || dims.energy < 30 || dims.relationships < 30 || cash < 400;

  const handleChoice = async (choice: string, effects: Partial<GameDimensions>, isCustom = false) => {
    setLoading(true);
    setNarrative(null);
    setShowBreathing(true);
    setBreathingMoment(getBreathingMoment(dims));

    // Apply effects
    const newDims = { ...dims };
    if (!isCustom) {
      (Object.keys(effects) as (keyof GameDimensions)[]).forEach(k => {
        newDims[k] = Math.max(0, Math.min(100, newDims[k] + (effects[k] || 0)));
      });
    } else {
      const boost = Math.random() > 0.4 ? 1 : -1;
      newDims.company = Math.max(0, Math.min(100, newDims.company + boost * (5 + Math.floor(Math.random() * 10))));
      newDims.relationships = Math.max(0, Math.min(100, newDims.relationships + (Math.random() > 0.5 ? 3 : -5)));
      newDims.energy = Math.max(0, Math.min(100, newDims.energy - 5));
      newDims.integrity = Math.max(0, Math.min(100, newDims.integrity + (Math.random() > 0.6 ? 3 : -3)));
    }

    const newArr = Math.max(0, arr + (newDims.company > 50 ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 4) - 1));
    const newCash = Math.max(0, cash - 40 - Math.floor(Math.random() * 30) + (newArr > arr ? (newArr - arr) * 5 : 0));
    const newWeek = week + 1;

    setDims(newDims);
    setArr(newArr);
    setCash(newCash);

    const decision: Decision = { week, context: tension?.context || "Custom move", choice, dims: { ...newDims } };
    const newDecisions = [...decisions, decision];
    setDecisions(newDecisions);

    // Log week color
    const avg = (newDims.company + newDims.relationships + newDims.energy + newDims.integrity) / 4;
    let weekColor: string;
    if (avg > 65) weekColor = "\u{1F7E9}";
    else if (avg > 45) weekColor = "\u{1F7E8}";
    else weekColor = "\u{1F7E5}";
    if (newDims.relationships < 25 && dims.relationships >= 25) weekColor = "\u{1F480}";
    if (newArr > arr + 15) weekColor = "\u{1F3C6}";
    setWeekLog(prev => [...prev, weekColor]);

    // Generate narrative
    const narrativeText = await generateNarrative(
      tension?.context || customText,
      choice,
      newDims,
      week,
      companyName
    );

    setNarrative(narrativeText);
    setShowBreathing(false);
    setLoading(false);
    setWeek(newWeek);

    // Check ending
    const ending = checkEnding({ week: newWeek, cash: newCash, arr: newArr, dims: newDims });
    if (ending) {
      setTimeout(() => onEnd(ending, newArr, newDims, newDecisions, [...weekLog, weekColor]), 3000);
      return;
    }

    // Time compression: 50% chance of 1-3 quiet weeks passing
    if (Math.random() > 0.5 && newWeek < 48) {
      const skipWeeks = 1 + Math.floor(Math.random() * 3);
      setTimeout(() => {
        setCompressing(true);
        setCompressWeeks(skipWeeks);
        setTimeout(() => {
          setWeek(w => w + skipWeeks);
          setCash(c => Math.max(0, c - skipWeeks * 25));
          setArr(a => a + Math.floor(Math.random() * skipWeeks * 3));
          const compressed: string[] = [];
          for (let i = 0; i < skipWeeks; i++) compressed.push("\u{1F7E9}");
          setWeekLog(prev => [...prev, ...compressed]);
          setCompressing(false);
          // New tension
          const t = getTension(newWeek + skipWeeks, usedTensions);
          setTension(t);
          setUsedTensions(prev => new Set([...prev, t.idx]));
          setNarrative(null);
          setShowCustom(false);
          setCustomText("");
        }, 2500);
      }, 3500);
    } else {
      // Next tension after narrative
      setTimeout(() => {
        const t = getTension(newWeek, usedTensions);
        setTension(t);
        setUsedTensions(prev => new Set([...prev, t.idx]));
        setNarrative(null);
        setShowCustom(false);
        setCustomText("");
      }, 3500);
    }
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      handleChoice(customText.trim(), {}, true);
    }
  };

  return (
    <SceneBackground sceneKey={sceneKey}>
      <div style={{
        maxWidth: 520, margin: "0 auto", padding: "24px 20px",
        fontFamily: FONTS.body, minHeight: "100vh",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20, paddingBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div>
            <div style={{
              fontFamily: FONTS.display, fontSize: 20, color: "#fff", fontWeight: 600,
            }}>{companyName}</div>
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: FONTS.mono, marginTop: 2,
            }}>Week {week} of 52</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: 18, fontWeight: 700, color: "#fff",
              fontFamily: FONTS.mono,
            }}>${arr}M <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>ARR</span></div>
            <div style={{
              fontSize: 12, color: cash < 400 ? "rgba(248,113,113,0.9)" : "rgba(255,255,255,0.35)",
              fontFamily: FONTS.mono, marginTop: 2,
            }}>${cash}K cash</div>
          </div>
        </div>

        {/* Four dimensions */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 24,
          border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <DimBar label="Company" value={dims.company} icon="\u{1F3E2}" />
          <DimBar label="Relationships" value={dims.relationships} icon="\u{1F91D}" />
          <DimBar label="Energy" value={dims.energy} icon="\u26A1" />
          <DimBar label="Integrity" value={dims.integrity} icon="\u{1FAE1}" />
        </div>

        {/* Journey strip */}
        {weekLog.length > 0 && (
          <div style={{
            display: "flex", gap: 2, marginBottom: 20, flexWrap: "wrap",
            justifyContent: "center",
          }}>
            {weekLog.map((w, i) => (
              <span key={i} style={{ fontSize: 10, lineHeight: 1 }}>{w}</span>
            ))}
          </div>
        )}

        {/* Breathing moment / Loading state */}
        {showBreathing && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            animation: "fadeUp 0.5s ease",
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 17,
              color: "rgba(255,255,255,0.45)",
              fontStyle: "italic",
              lineHeight: 1.7,
              maxWidth: 340,
              margin: "0 auto",
            }}>
              {breathingMoment}
            </div>
            <div style={{
              width: 24, height: 2,
              background: "rgba(255,255,255,0.15)",
              margin: "24px auto 0",
              animation: "pulse 1.5s infinite",
            }} />
          </div>
        )}

        {/* Time compression */}
        {compressing && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            animation: "fadeUp 0.5s ease",
          }}>
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: "rgba(255,255,255,0.3)",
              marginBottom: 12,
            }}>
              {compressWeeks} quiet week{compressWeeks > 1 ? "s" : ""} passed...
            </div>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 16,
              color: "rgba(255,255,255,0.45)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}>
              {getBreathingMoment(dims)}
            </div>
          </div>
        )}

        {/* Narrative result */}
        {narrative && !showBreathing && !compressing && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: "24px",
            marginBottom: 24,
            animation: "fadeUp 0.6s ease",
          }}>
            <div style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.7,
              fontFamily: FONTS.body,
            }}>
              {narrative}
            </div>
          </div>
        )}

        {/* Tension / Decision */}
        {tension && !loading && !narrative && !compressing && (
          <div style={{
            flex: 1,
            display: "flex", flexDirection: "column", justifyContent: "center",
            animation: "fadeUp 0.6s ease",
          }}>
            {/* Context */}
            <div style={{
              textAlign: "center",
              marginBottom: 32,
              padding: "0 12px",
            }}>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: "clamp(17px, 3.5vw, 21px)",
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.6,
                fontWeight: 400,
              }}>
                {tension.context}
              </div>
            </div>

            {/* Binary choice */}
            <div style={{
              display: "flex", gap: 12, marginBottom: 20,
            }}>
              {[
                { label: tension.left, effects: tension.leftEffect },
                { label: tension.right, effects: tension.rightEffect },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt.label, opt.effects)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    padding: "22px 12px",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "2px",
                    borderRadius: 14,
                    cursor: "pointer",
                    fontFamily: FONTS.body,
                    textTransform: "uppercase",
                    transition: "all 0.3s ease",
                    lineHeight: 1.3,
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
                    (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
                    (e.target as HTMLButtonElement).style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.background = "transparent";
                    (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
                    (e.target as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Custom input — unlocks when desperate */}
            {isDesperate && !showCustom && (
              <button
                onClick={() => setShowCustom(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.25)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: FONTS.mono,
                  padding: "8px 0",
                  transition: "color 0.3s",
                  textAlign: "center",
                }}
                onMouseEnter={e => (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"}
                onMouseLeave={e => (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.25)"}
              >
                Neither — I have my own idea &rarr;
              </button>
            )}

            {showCustom && (
              <div style={{
                marginTop: 8,
                animation: "fadeUp 0.4s ease",
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCustomSubmit()}
                    placeholder="Type your move..."
                    autoFocus
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      padding: "12px 16px",
                      fontSize: 14,
                      color: "#fff",
                      fontFamily: FONTS.body,
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleCustomSubmit}
                    disabled={!customText.trim()}
                    style={{
                      background: customText.trim() ? "rgba(255,255,255,0.1)" : "transparent",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#fff",
                      padding: "12px 20px",
                      borderRadius: 10,
                      cursor: customText.trim() ? "pointer" : "default",
                      fontSize: 14,
                      fontFamily: FONTS.body,
                    }}
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneBackground>
  );
}
