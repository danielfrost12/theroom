'use client';

import { useState, useEffect } from 'react';
import { FONTS, COLORS } from '@/lib/game/constants';
import { getLastPlay } from '@/lib/game/stats';
import { SceneBackground } from './SceneBackground';

interface CinematicOpeningProps {
  onComplete: (companyName: string, choice: string) => void;
}

export function CinematicOpening({ onComplete }: CinematicOpeningProps) {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [choiceMade, setChoiceMade] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [inputReady, setInputReady] = useState(false);
  const [ghost] = useState(() => getLastPlay());

  // The ambient text changes based on how your last game ended
  const ambientText = (() => {
    if (!ghost) return "Morning light through the window. Your laptop is open. Coffee\u2019s going cold.";
    switch (ghost.ending) {
      case 'burnout':
        return "Morning light through the window. You\u2019ve been here before. Your body remembers, even if you don\u2019t want it to.";
      case 'bankrupt':
        return "Morning light through the window. New office. New number in the bank. Same feeling in your chest.";
      case 'disgraced':
        return "Morning light through the window. This time you promised yourself: no shortcuts. We\u2019ll see.";
      case 'board_removed':
        return "Morning light through the window. This time, nobody can take it from you. Not yet.";
      case 'forced_sale':
        return "Morning light through the window. Last time someone else decided when it ended. Not this time.";
      case 'ipo':
      case 'acquired':
        return "Morning light through the window. You\u2019ve done this before. Made it, even. The question is whether you can do it without losing what you lost last time.";
      default:
        return "Morning light through the window. Again. Different company, same chair, same light.";
    }
  })();

  const slackMsg = "Marcus just Slacked the team: the competitor shipped your exact feature. It's live. 12 people are waiting for direction. David has a board call in 3 hours.";

  useEffect(() => {
    // Tightened timing — first 30 seconds matter most
    const timers = [
      setTimeout(() => setPhase(1), 500),    // Time appears fast
      setTimeout(() => setPhase(2), 1500),   // Ambient text
      setTimeout(() => setPhase(3), 3000),   // Notification 1
      setTimeout(() => setPhase(4), 4200),   // Notification 2
      setTimeout(() => setPhase(5), 5500),   // Open laptop
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Typing effect for Slack message — runs once when phase hits 6
  useEffect(() => {
    if (phase !== 6) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < slackMsg.length) {
        setTyped(slackMsg.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 18);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleChoice = (choice: string) => {
    setChoiceMade(choice);
    setTimeout(() => setShowNameInput(true), 4500);
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
        minHeight: "100dvh",
        padding: "max(24px, env(safe-area-inset-top, 0px)) max(20px, env(safe-area-inset-right, 0px)) max(24px, env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px))",
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
              {ambientText}
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
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Sequoia Capital</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
              <strong>David Chen</strong> wired $2.5M. Attached: <span style={{ color: "rgba(255,255,255,0.5)" }}>12-month milestone targets.pdf</span>
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
                {!typingDone && (
                  <span style={{ opacity: 0.5, animation: "blink 1s infinite" }}>|</span>
                )}
              </div>
            </div>

            {/* Choices — appear after typing finishes */}
            {typingDone && (
              <div style={{ opacity: 0, animation: "fadeUp 0.6s ease 0.6s forwards" }}>
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
                        borderLeft: i === 1 ? "1px solid rgba(255,238,210,0.1)" : "none",
                        color: COLORS.warm,
                        padding: "20px 28px",
                        fontSize: 15,
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        fontFamily: FONTS.body,
                        transition: "all 0.4s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = COLORS.warmHover;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = COLORS.warm;
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
            animation: "fadeUp 1s ease",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            {/* The prompt — a quiet statement, not instructions */}
            <div style={{
              fontFamily: FONTS.display,
              fontSize: "clamp(15px, 3.5vw, 18px)",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.7,
              marginBottom: 56,
              letterSpacing: "0.3px",
              textAlign: "center",
            }}>
              That was one decision. You&apos;ll make twenty-three more.
            </div>

            {/* The glass card — the name input lives here */}
            <div style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "40px 28px 36px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Subtle inner glow — makes the card feel alive */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "radial-gradient(ellipse at 50% 0%, rgba(255,238,210,0.04) 0%, transparent 60%)",
                pointerEvents: "none",
              }} />

              {/* Label */}
              <div style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.25)",
                fontFamily: FONTS.mono,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                marginBottom: 20,
                position: "relative",
              }}>
                Name your company
              </div>

              {/* Input — writing on glass */}
              {/* Safari Mobile AutoFill kill: contentEditable div instead of input.
                  Mobile Safari aggressively autofills ANY <input> with contact info.
                  type="search", honeypots, readOnly — none work reliably on iOS.
                  A contentEditable div is invisible to Safari's autofill engine. */}
              <div style={{ position: "relative" }}>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  role="textbox"
                  aria-label="Company name"
                  onInput={e => {
                    const text = (e.currentTarget.textContent || "").slice(0, 28);
                    setCompanyName(text);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleStart();
                    }
                  }}
                  onPaste={e => {
                    e.preventDefault();
                    const text = e.clipboardData.getData("text/plain").slice(0, 28);
                    document.execCommand("insertText", false, text);
                  }}
                  ref={(el) => {
                    // Auto-focus on mount
                    if (el && !inputReady) {
                      setTimeout(() => { el.focus(); setInputReady(true); }, 100);
                    }
                  }}
                  data-placeholder=""
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: `1px solid ${companyName.trim() ? "rgba(255,238,210,0.3)" : "rgba(255,255,255,0.1)"}`,
                    padding: "14px 0",
                    width: "100%",
                    maxWidth: 320,
                    margin: "0 auto",
                    fontSize: "clamp(24px, 6.5vw, 34px)",
                    color: "#fff",
                    textAlign: "center" as const,
                    fontFamily: FONTS.display,
                    fontWeight: 600,
                    letterSpacing: "-0.5px",
                    outline: "none",
                    transition: "border-color 0.8s ease",
                    caretColor: "rgba(255,238,210,0.6)",
                    minHeight: "1.2em",
                    WebkitUserSelect: "text" as const,
                    userSelect: "text" as const,
                    wordBreak: "break-all" as const,
                    whiteSpace: "nowrap" as const,
                    overflow: "hidden",
                  }}
                />
              </div>

              {/* The commitment — fades in when the name exists */}
              <div style={{
                opacity: companyName.trim() ? 1 : 0,
                transform: companyName.trim() ? "translateY(0)" : "translateY(8px)",
                transition: "all 0.5s ease",
                marginTop: 32,
                position: "relative",
              }}>
                <button
                  onClick={handleStart}
                  disabled={!companyName.trim()}
                  style={{
                    background: companyName.trim() ? "rgba(255,238,210,0.08)" : "transparent",
                    border: `1px solid ${companyName.trim() ? "rgba(255,238,210,0.15)" : "transparent"}`,
                    borderRadius: 50,
                    color: COLORS.warm,
                    padding: "14px 48px",
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: companyName.trim() ? "pointer" : "default",
                    fontFamily: FONTS.body,
                    transition: "all 0.4s ease",
                    letterSpacing: "0.5px",
                  }}
                  onMouseEnter={e => {
                    if (companyName.trim()) {
                      e.currentTarget.style.background = "rgba(255,238,210,0.12)";
                      e.currentTarget.style.color = COLORS.warmHover;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,238,210,0.08)";
                    e.currentTarget.style.color = COLORS.warm;
                  }}
                >
                  Begin &rarr;
                </button>
              </div>
            </div>

            {/* Stakes whisper — below the card */}
            <div style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.12)",
              marginTop: 20,
              fontFamily: FONTS.mono,
              letterSpacing: "1px",
              textAlign: "center",
            }}>
              24 weeks &middot; no going back
            </div>
          </div>
        )}
      </div>
    </SceneBackground>
  );
}
