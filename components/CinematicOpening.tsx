'use client';

import { useState, useEffect } from 'react';
import { FONTS } from '@/lib/game/constants';
import { SceneBackground } from './SceneBackground';

interface CinematicOpeningProps {
  onComplete: (companyName: string, choice: string) => void;
}

export function CinematicOpening({ onComplete }: CinematicOpeningProps) {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState("");
  const [choiceMade, setChoiceMade] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const slackMsg = "Marcus just Slacked the team: the competitor shipped your exact feature. It's live. 12 people are waiting for direction. David has a board call in 3 hours.";

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => setPhase(4), 6500),
      setTimeout(() => setPhase(5), 8500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Typing effect for Slack message
  useEffect(() => {
    if (phase < 6) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < slackMsg.length) {
        setTyped(slackMsg.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase(7), 800);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [phase, slackMsg]);

  const handleChoice = (choice: string) => {
    setChoiceMade(choice);
    setTimeout(() => setShowNameInput(true), 1500);
  };

  const handleStart = () => {
    if (companyName.trim()) {
      onComplete(companyName.trim(), choiceMade!);
    }
  };

  return (
    <SceneBackground sceneKey="office_morning">
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", padding: "40px 24px",
        fontFamily: FONTS.body,
      }}>
        {/* Phase 1: Time */}
        {phase >= 1 && (
          <div style={{
            opacity: phase >= 1 ? 1 : 0,
            transition: "opacity 1.2s ease",
            position: phase < 5 ? "relative" : "absolute",
            top: phase >= 5 ? 30 : "auto",
            right: phase >= 5 ? 30 : "auto",
          }}>
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: phase >= 5 ? 14 : 16,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 2,
            }}>
              8:47 AM &middot; MONDAY
            </div>
          </div>
        )}

        {/* Phase 2: Ambient */}
        {phase >= 2 && phase < 6 && (
          <div style={{
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 1.5s ease",
            marginTop: 24,
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: "clamp(20px, 4vw, 28px)",
              color: "rgba(255,255,255,0.5)",
              fontStyle: "italic",
              fontWeight: 300,
              maxWidth: 400,
              lineHeight: 1.6,
            }}>
              Morning light through the window. Your laptop is open. Coffee&apos;s going cold.
            </div>
          </div>
        )}

        {/* Phase 3: Notification 1 */}
        {phase >= 3 && phase < 6 && (
          <div style={{
            opacity: 1,
            animation: "slideIn 0.5s ease",
            marginTop: 32,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "14px 20px",
            maxWidth: 380,
            width: "100%",
          }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Notification</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
              <strong>Priya Sharma</strong> accepted the role of Co-Founder.
            </div>
          </div>
        )}

        {/* Phase 4: Notification 2 */}
        {phase >= 4 && phase < 6 && (
          <div style={{
            opacity: 1,
            animation: "slideIn 0.5s ease",
            marginTop: 12,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "14px 20px",
            maxWidth: 380,
            width: "100%",
          }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Wire Transfer</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
              <strong>David Chen</strong>, Sequoia Capital, wired <strong>$2,500,000</strong> to your account.
            </div>
          </div>
        )}

        {/* Phase 5: Open laptop button */}
        {phase === 5 && (
          <div style={{ marginTop: 40, animation: "fadeUp 0.8s ease" }}>
            <button
              onClick={() => setPhase(6)}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "14px 36px",
                fontSize: 16,
                borderRadius: 50,
                cursor: "pointer",
                fontFamily: FONTS.body,
                transition: "all 0.3s",
              }}
              onMouseEnter={e => (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.14)"}
              onMouseLeave={e => (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"}
            >
              Open laptop
            </button>
          </div>
        )}

        {/* Phase 6: Slack message typing */}
        {phase >= 6 && !choiceMade && (
          <div style={{
            maxWidth: 440, width: "100%",
            animation: "fadeUp 0.5s ease",
            marginTop: 0,
          }}>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 32,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#e01e5a",
                }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: FONTS.mono }}>
                  #general &middot; now
                </span>
              </div>
              <div style={{
                fontSize: 16, color: "rgba(255,255,255,0.9)",
                lineHeight: 1.6,
                minHeight: 80,
              }}>
                {typed}
                {phase === 6 && typed.length < slackMsg.length && (
                  <span style={{ opacity: 0.5, animation: "blink 1s infinite" }}>|</span>
                )}
              </div>
            </div>

            {/* Phase 7: Binary tension */}
            {phase >= 7 && (
              <div style={{ animation: "fadeUp 0.6s ease" }}>
                <div style={{
                  display: "flex", gap: 12, justifyContent: "center",
                }}>
                  {["TRUST HIM", "TRUST YOURSELF"].map((choice) => (
                    <button
                      key={choice}
                      onClick={() => handleChoice(choice)}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff",
                        padding: "18px 16px",
                        fontSize: 15,
                        fontWeight: 600,
                        letterSpacing: "1.5px",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontFamily: FONTS.body,
                        transition: "all 0.3s",
                        textTransform: "uppercase",
                      }}
                      onMouseEnter={e => {
                        (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                        (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)";
                      }}
                      onMouseLeave={e => {
                        (e.target as HTMLButtonElement).style.background = "transparent";
                        (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                      }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Choice made — consequence + name entry */}
        {choiceMade && !showNameInput && (
          <div style={{
            maxWidth: 440, width: "100%",
            textAlign: "center",
            animation: "fadeUp 0.6s ease",
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 20,
              color: "rgba(255,255,255,0.7)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}>
              {choiceMade === "TRUST HIM"
                ? "Marcus exhaled. For the first time in weeks, someone listened. Priya raised an eyebrow but said nothing. The rebuild started that afternoon."
                : "The room went quiet. Marcus looked at his screen. Priya leaned forward — she'd been waiting for this. David would hear about it by tomorrow."}
            </div>
          </div>
        )}

        {showNameInput && (
          <div style={{
            maxWidth: 440, width: "100%",
            textAlign: "center",
            animation: "fadeUp 0.8s ease",
          }}>
            <div style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
            }}>
              That was one decision. The game has fifty-two weeks of them.
            </div>
            <div style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.3)",
              marginBottom: 32,
              fontFamily: FONTS.mono,
            }}>
              ~20 min &middot; 52 weeks &middot; &infin; endings
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 8,
              }}>
                Name your company
              </div>
              <input
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleStart()}
                placeholder="e.g. Nova AI"
                autoFocus
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: "14px 20px",
                  width: "100%",
                  maxWidth: 300,
                  fontSize: 18,
                  color: "#fff",
                  textAlign: "center",
                  fontFamily: FONTS.display,
                  outline: "none",
                }}
              />
            </div>
            <button
              onClick={handleStart}
              disabled={!companyName.trim()}
              style={{
                background: companyName.trim() ? "#fff" : "rgba(255,255,255,0.1)",
                color: companyName.trim() ? "#0a0a0f" : "rgba(255,255,255,0.3)",
                border: "none",
                padding: "14px 40px",
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 50,
                cursor: companyName.trim() ? "pointer" : "default",
                fontFamily: FONTS.body,
                transition: "all 0.3s",
              }}
            >
              Begin
            </button>
          </div>
        )}
      </div>
    </SceneBackground>
  );
}
