'use client';

import { useState, useRef, useEffect } from 'react';
import { FONTS } from '@/lib/game/constants';

// Royalty-free lo-fi stream URLs — fallback chain
const STREAM_URLS = [
  'https://streams.ilovemusic.de/iloveradio17.mp3', // lofi hip hop
];

export function LofiPlayer() {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.3;
    audio.loop = true;
    audioRef.current = audio;

    audio.addEventListener('error', () => {
      setFailed(true);
      setPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.src = STREAM_URLS[0];
      audio.play().then(() => {
        setPlaying(true);
        setFailed(false);
      }).catch(() => {
        setFailed(true);
      });
    }
  };

  if (failed) return null; // Silently disappear if audio fails

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Pause lo-fi music' : 'Play lo-fi music'}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 50,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 100,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      {/* Animated bars when playing, static icon when paused */}
      {playing ? (
        <div style={{ display: 'flex', alignItems: 'end', gap: 2, height: 12 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 2,
                background: 'rgba(255,255,255,0.5)',
                borderRadius: 1,
                animation: `lofiBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
        </div>
      ) : (
        <span style={{ fontSize: 12, lineHeight: 1 }}>♪</span>
      )}
      <span style={{
        fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
        fontFamily: FONTS.mono,
        letterSpacing: '0.5px',
      }}>
        {playing ? 'lo-fi' : 'lo-fi'}
      </span>

      <style>{`
        @keyframes lofiBar {
          0% { height: 3px; }
          100% { height: 12px; }
        }
      `}</style>
    </button>
  );
}
