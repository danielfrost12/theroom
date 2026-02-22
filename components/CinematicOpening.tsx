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
        minHeight: "100vh",
        padding: "max(40px, env(safe-area-inset-top, 0px)) max(24px, env(safe-area-inset-right, 0px)) max(40px, env(safe-area-inset-bottom, 0px)) max(24px, env(safe-area-inset-left, 0px))",
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
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.6)",
                padding: "14px 36px",
                fontSize: 15,
                borderRadius: 50,
                cursor: "pointer",
                fontFamily: FONTS.body,
                transition: "all 0.4s ease",
                letterSpacing: "0.3px",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
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
              <div
                aria-live="polite"
                aria-label="Slack message"
                style={{
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
                  {["Trust Marcus", "Trust yourself"].map((choice, i) => (
                    <button
                      key={choice}
                      onClick={() => handleChoice(choice)}
                      style={{
                        background: "transparent",
                        border: "none",
                        borderLeft: i === 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                        color: "rgba(255,255,255,0.55)",
                        padding: "20px 28px",
                        fontSize: 15,
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        fontFamily: FONTS.body,
                        transition: "all 0.4s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.55)";
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
            animation: "fadeUp 0.6s ease",
          }}>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "32px 28px",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: 18,
                color: "rgba(255,255,255,0.8)",
                fontStyle: "italic",
                lineHeight: 1.7,
              }}>
                {choiceMade === "Trust Marcus"
                  ? "Marcus exhaled. For the first time in weeks, someone listened. Priya raised an eyebrow but said nothing. The rebuild started that afternoon."
                  : "The room went quiet. Marcus looked at his screen. Priya leaned forward — she'd been waiting for this. David would hear about it by tomorrow."}
              </div>
            </div>
          </div>
        )}

        {showNameInput && (
          <div style={{
            maxWidth: 440, width: "100%",
            animation: "fadeUp 0.8s ease",
          }}>
            {/* Frosted glass panel */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "40px 32px 36px",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 6,
                lineHeight: 1.6,
                fontFamily: FONTS.body,
              }}>
                That was one decision. The game has fifty-two weeks of them.
              </div>
              <div style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                marginBottom: 36,
                fontFamily: FONTS.mono,
                letterSpacing: "0.5px",
              }}>
                ~20 min · 52 weeks · ∞ endings
              </div>
              <div style={{ marginBottom: 28 }}>
                <label
                  htmlFor="company-name"
                  style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 10,
                  display: "block",
                  fontFamily: FONTS.mono,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}>
                  Name your company
                </label>
                <input
                  id="company-name"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleStart()}
                  placeholder="e.g. Nova AI"
                  autoFocus
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    padding: "16px 20px",
                    width: "100%",
                    maxWidth: 300,
                    fontSize: 20,
                    color: "#fff",
                    textAlign: "center",
                    fontFamily: FONTS.display,
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                />
              </div>
              <button
                onClick={handleStart}
                disabled={!companyName.trim()}
                style={{
                  background: companyName.trim() ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.08)",
                  color: companyName.trim() ? "#0a0a0f" : "rgba(255,255,255,0.25)",
                  border: "none",
                  padding: "14px 44px",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 50,
                  cursor: companyName.trim() ? "pointer" : "default",
                  fontFamily: FONTS.body,
                  transition: "all 0.4s ease",
                  letterSpacing: "0.3px",
                }}
              >
                Begin
              </button>
            </div>
          </div>
        )}
      </div>
    </SceneBackground>
  );
}
