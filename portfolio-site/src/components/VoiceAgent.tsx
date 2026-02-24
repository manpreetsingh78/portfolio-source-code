'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useSession,
  SessionProvider,
  useAgent,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { TokenSource } from 'livekit-client';

/* ─── Token Source ─── */
const tokenSource = TokenSource.endpoint('/api/voice-token');

/* ────────────────────────────────────────────────────────────────────────────
   Hacker Boy Avatar — stylized cyberpunk boy with smart glasses & laptop
   Uses bold flat shapes that read well at 88px. Dark theme, neon accents.
   ──────────────────────────────────────────────────────────────────────────── */
function BoyAvatar({ state }: { state: string }) {
  const isActive = state !== 'idle' && state !== 'initializing';
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';

  /* Blink */
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        schedule();
      }, 3000 + Math.random() * 2000);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  /* Mouth for speaking */
  const [mouthOpen, setMouthOpen] = useState(0);
  useEffect(() => {
    if (!isSpeaking) { setMouthOpen(0); return; }
    const iv = setInterval(() => setMouthOpen(Math.random()), 130);
    return () => clearInterval(iv);
  }, [isSpeaking]);

  /* Glasses glow color per state */
  const glassesGlow = isListening ? '#22d3ee' : isThinking ? '#a78bfa' : isSpeaking ? '#34d399' : '#06b6d4';

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5dcc3" />
          <stop offset="100%" stopColor="#e8c4a0" />
        </linearGradient>
        <linearGradient id="hairG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0d0d1a" />
        </linearGradient>
        <linearGradient id="hoodieG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a18" />
        </linearGradient>
        <linearGradient id="laptopG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a3e" />
          <stop offset="100%" stopColor="#16162a" />
        </linearGradient>
        <linearGradient id="screenG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a2a3a" />
          <stop offset="100%" stopColor="#061420" />
        </linearGradient>
        <radialGradient id="bgG" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={isActive ? '#0f1a2e' : '#111827'} />
          <stop offset="100%" stopColor={isActive ? '#070d18' : '#0a0f1a'} />
        </radialGradient>
        <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="screenLight" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Dark background */}
      <circle cx="60" cy="60" r="58" fill="url(#bgG)" />

      {/* ── Hoodie body ── */}
      <path d="M22,120 Q22,92 40,86 L60,82 L80,86 Q98,92 98,120 Z" fill="url(#hoodieG)" />
      {/* Hood outline */}
      <path d="M40,86 Q48,80 60,78 Q72,80 80,86" fill="none" stroke="#2a2a4e" strokeWidth="1" />
      {/* Hoodie pocket */}
      <path d="M40,104 Q50,108 60,106 Q70,108 80,104" fill="none" stroke="#22223a" strokeWidth="0.8" opacity="0.6" />
      {/* Neon accent line on hoodie */}
      <path d="M42,88 Q52,94 60,90 Q68,94 78,88" fill="none" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

      {/* ── Arms holding laptop ── */}
      {/* Left arm */}
      <path d="M30,96 Q28,100 30,108 L42,106 Q38,98 40,92" fill="url(#hoodieG)" stroke="#1a1a2e" strokeWidth="0.5" />
      {/* Right arm */}
      <path d="M90,96 Q92,100 90,108 L78,106 Q82,98 80,92" fill="url(#hoodieG)" stroke="#1a1a2e" strokeWidth="0.5" />

      {/* ── Laptop ── */}
      {/* Laptop base */}
      <rect x="30" y="104" width="60" height="4" rx="1.5" fill="url(#laptopG)" />
      {/* Laptop screen back */}
      <path d="M34,104 L32,82 L88,82 L86,104 Z" fill="url(#laptopG)" opacity="0" />
      {/* Laptop screen (open, tilted) */}
      <rect x="34" y="88" width="52" height="16" rx="1.5" fill="url(#laptopG)" />
      <rect x="36" y="89.5" width="48" height="13" rx="1" fill="url(#screenG)" />
      {/* Screen glow */}
      <rect x="36" y="89.5" width="48" height="13" rx="1" fill={glassesGlow} opacity="0.08" />
      {/* Code lines on screen */}
      <line x1="39" y1="92" x2="50" y2="92" stroke="#06b6d4" strokeWidth="0.7" opacity="0.6" />
      <line x1="39" y1="94.5" x2="55" y2="94.5" stroke="#a78bfa" strokeWidth="0.7" opacity="0.4" />
      <line x1="42" y1="97" x2="52" y2="97" stroke="#34d399" strokeWidth="0.7" opacity="0.5" />
      <line x1="39" y1="99.5" x2="48" y2="99.5" stroke="#06b6d4" strokeWidth="0.7" opacity="0.3" />
      {/* Screen blinking cursor */}
      <rect x="54" y="96" width="1" height="3" fill="#06b6d4" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0;0.9" dur="1s" repeatCount="indefinite" />
      </rect>
      {/* Laptop screen face glow on chin area */}
      <ellipse cx="60" cy="78" rx="12" ry="4" fill={glassesGlow} opacity="0.06" filter="url(#screenLight)" />

      {/* Neck */}
      <rect x="54" y="76" width="12" height="8" rx="2" fill="url(#skinG)" />

      {/* ── Head ── */}
      <ellipse cx="60" cy="52" rx="22" ry="24" fill="url(#skinG)" />

      {/* Ears */}
      <ellipse cx="38" cy="54" rx="3.5" ry="4.5" fill="#e8c4a0" />
      <ellipse cx="82" cy="54" rx="3.5" ry="4.5" fill="#e8c4a0" />

      {/* ── Hair — dark, messy hacker style ── */}
      <path d="M38,42 Q38,18 60,14 Q82,18 82,42 L82,36 Q80,22 60,19 Q40,22 38,36 Z" fill="url(#hairG)" />
      <path d="M36,42 Q34,22 58,12 Q74,10 84,18 Q90,24 86,42 Q84,26 60,20 Q40,22 38,40 Z" fill="url(#hairG)" />
      {/* Messy spikes on top */}
      <path d="M44,18 L42,8 L50,16" fill="url(#hairG)" />
      <path d="M54,14 L56,4 L60,14" fill="url(#hairG)" />
      <path d="M66,14 L70,6 L72,16" fill="url(#hairG)" />
      <path d="M76,20 L82,12 L80,22" fill="url(#hairG)" />
      <path d="M36,28 L30,20 L38,26" fill="url(#hairG)" />
      {/* Side hair */}
      <path d="M38,40 Q36,36 37,30 Q40,24 42,28 Q40,32 40,40" fill="url(#hairG)" />
      <path d="M82,40 Q84,36 83,30 Q80,24 78,28 Q80,32 80,40" fill="url(#hairG)" />
      {/* Fringe strands falling on forehead */}
      <path d="M42,36 Q46,22 56,20 L50,34 Z" fill="#0d0d1a" opacity="0.9" />
      <path d="M48,32 Q54,18 66,18 L58,32 Z" fill="#1a1a2e" opacity="0.8" />
      <path d="M74,34 Q78,24 72,20 L70,32 Z" fill="#0d0d1a" opacity="0.75" />

      {/* ── Eyebrows ── */}
      <path d={`M47,${isListening ? 42 : 44} Q51,${isListening ? 40 : 42} 55,${isListening ? 42.5 : 44.5}`}
        fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
      <path d={`M65,${isListening ? 42.5 : 44.5} Q69,${isListening ? 40 : 42} 73,${isListening ? 42 : 44}`}
        fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Smart Glasses — rectangular, techy, GLOWING ── */}
      {/* Lens glow backdrop */}
      <rect x="43" y="46" width="14" height="10" rx="2" fill={glassesGlow} opacity={isActive ? 0.15 : 0.06} filter="url(#neonGlow)" />
      <rect x="63" y="46" width="14" height="10" rx="2" fill={glassesGlow} opacity={isActive ? 0.15 : 0.06} filter="url(#neonGlow)" />
      {/* Left lens frame */}
      <rect x="43" y="46" width="14" height="10" rx="2.5" fill="none" stroke={glassesGlow} strokeWidth="1.4" opacity={isActive ? 0.9 : 0.6} />
      {/* Right lens frame */}
      <rect x="63" y="46" width="14" height="10" rx="2.5" fill="none" stroke={glassesGlow} strokeWidth="1.4" opacity={isActive ? 0.9 : 0.6} />
      {/* Bridge */}
      <line x1="57" y1="50" x2="63" y2="50" stroke={glassesGlow} strokeWidth="1.2" opacity={isActive ? 0.8 : 0.5} />
      {/* Temple arms */}
      <line x1="43" y1="49" x2="38" y2="52" stroke={glassesGlow} strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <line x1="77" y1="49" x2="82" y2="52" stroke={glassesGlow} strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      {/* HUD dots on lenses */}
      <circle cx="48" cy="49" r="0.6" fill={glassesGlow} opacity={isActive ? 0.8 : 0.3}>
        {isActive && <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />}
      </circle>
      <circle cx="72" cy="49" r="0.6" fill={glassesGlow} opacity={isActive ? 0.8 : 0.3}>
        {isActive && <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />}
      </circle>
      {/* Lens reflection */}
      <line x1="45" y1="47.5" x2="49" y2="47.5" stroke="white" strokeWidth="0.6" opacity="0.15" strokeLinecap="round" />
      <line x1="65" y1="47.5" x2="69" y2="47.5" stroke="white" strokeWidth="0.6" opacity="0.15" strokeLinecap="round" />

      {/* ── Eyes (behind glasses) ── */}
      {blink ? (
        <>
          <line x1="47" y1="51" x2="54" y2="51" stroke="#1a1a2e" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="66" y1="51" x2="73" y2="51" stroke="#1a1a2e" strokeWidth="1.6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="51" rx="3.5" ry="3.8" fill="white" />
          <circle cx={isThinking ? 51.5 : 50.5} cy={isListening ? 50 : 51} r="2.4" fill="#1a1a2e" />
          <circle cx={isThinking ? 52.2 : 51.2} cy={isListening ? 49.5 : 50.3} r="0.8" fill="white" />

          <ellipse cx="70" cy="51" rx="3.5" ry="3.8" fill="white" />
          <circle cx={isThinking ? 71.5 : 70.5} cy={isListening ? 50 : 51} r="2.4" fill="#1a1a2e" />
          <circle cx={isThinking ? 72.2 : 71.2} cy={isListening ? 49.5 : 50.3} r="0.8" fill="white" />
        </>
      )}

      {/* Nose */}
      <path d="M59,59 Q60,62 61,59" fill="none" stroke="#d4a87a" strokeWidth="1" strokeLinecap="round" />

      {/* Mouth */}
      {isSpeaking ? (
        <ellipse cx="60" cy="66" rx={2.2 + mouthOpen * 1.5} ry={1 + mouthOpen * 3} fill="#333" />
      ) : (
        <path d={isListening ? "M56,65 Q60,69 64,65" : "M57,65 Q60,68 63,65"}
          fill="none" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
      )}

      {/* ── State-specific effects ── */}

      {/* Listening — glasses pulse cyan, ear indicators */}
      {isListening && (
        <>
          <rect x="43" y="46" width="14" height="10" rx="2.5" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.4" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <rect x="63" y="46" width="14" height="10" rx="2.5" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.4" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" />
          </rect>
          {/* Sound wave indicators near ears */}
          <path d="M34,50 Q30,54 34,58" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity="0.5" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1s" repeatCount="indefinite" />
          </path>
          <path d="M86,50 Q90,54 86,58" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity="0.5" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1s" begin="0.3s" repeatCount="indefinite" />
          </path>
        </>
      )}

      {/* Thinking — glasses pulse violet, thought bubbles */}
      {isThinking && (
        <>
          <rect x="43" y="46" width="14" height="10" rx="2.5" fill="#a78bfa" opacity="0.1" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="1.8s" repeatCount="indefinite" />
          </rect>
          <rect x="63" y="46" width="14" height="10" rx="2.5" fill="#a78bfa" opacity="0.1" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
          </rect>
          <circle cx="88" cy="34" r="2.5" fill="#a78bfa" opacity="0.6" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="94" cy="26" r="3.5" fill="#a78bfa" opacity="0.45" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="16" r="4.5" fill="#a78bfa" opacity="0.3" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.1;0.45;0.1" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Speaking — glasses pulse green, sound waves */}
      {isSpeaking && (
        <>
          <rect x="43" y="46" width="14" height="10" rx="2.5" fill="#34d399" opacity="0.1" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.05;0.2;0.05" dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x="63" y="46" width="14" height="10" rx="2.5" fill="#34d399" opacity="0.1" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.05;0.2;0.05" dur="0.6s" begin="0.15s" repeatCount="indefinite" />
          </rect>
          <path d="M84,62 Q90,56 84,48" fill="none" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" filter="url(#neonGlow)">
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="0.8s" repeatCount="indefinite" />
          </path>
          <path d="M88,66 Q96,56 88,44" fill="none" stroke="#34d399" strokeWidth="1" strokeLinecap="round" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.08;0.3" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
          </path>
        </>
      )}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   State glow config
   ──────────────────────────────────────────────────────────────────────────── */
const stateConfig: Record<string, { shadow: string; border: string; label: string; color: string; bg: string }> = {
  idle:         { shadow: '0 0 15px 2px rgba(100,116,139,0.12)', border: 'border-slate-600/30', label: '', color: '', bg: '' },
  initializing: { shadow: '0 0 15px 2px rgba(100,116,139,0.12)', border: 'border-slate-600/30', label: 'Connecting', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/25' },
  listening:    { shadow: '0 0 24px 6px rgba(34,211,238,0.3)',   border: 'border-cyan-400/40',   label: 'Listening',  color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/25' },
  thinking:     { shadow: '0 0 24px 6px rgba(139,92,246,0.3)',   border: 'border-violet-400/40', label: 'Thinking',   color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/25' },
  speaking:     { shadow: '0 0 28px 8px rgba(52,211,153,0.35)',  border: 'border-emerald-400/40', label: 'Speaking',   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
};

const getConfig = (state: string) => stateConfig[state] || stateConfig.idle;

/* ────────────────────────────────────────────────────────────────────────────
   State Pill
   ──────────────────────────────────────────────────────────────────────────── */
function StatePill({ state }: { state: string }) {
  const c = getConfig(state);
  if (!c.label) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.9 }}
      className={`absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full
        text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap
        border backdrop-blur-sm ${c.bg} ${c.color}`}
    >
      {c.label}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Session Content
   ──────────────────────────────────────────────────────────────────────────── */
function SessionContent({ onStop }: { onStop: () => void }) {
  const agent = useAgent();
  const cfg = useMemo(() => getConfig(agent.state), [agent.state]);

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence mode="wait">
        <StatePill key={agent.state} state={agent.state} />
      </AnimatePresence>

      {/* Avatar container */}
      <motion.div
        className={`relative w-[88px] h-[88px] rounded-full border-2 ${cfg.border}
          overflow-visible select-none`}
        animate={{
          scale: agent.state === 'speaking' ? [1, 1.04, 1] : 1,
          boxShadow: cfg.shadow,
        }}
        transition={{
          scale: { duration: 0.6, repeat: agent.state === 'speaking' ? Infinity : 0, repeatType: 'reverse' },
          boxShadow: { duration: 0.4 },
        }}
      >
        {/* Thinking rotating ring */}
        {agent.state === 'thinking' && (
          <motion.div
            className="absolute inset-[-5px] rounded-full border-2 border-dashed border-violet-400/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Listening pulse ring */}
        {agent.state === 'listening' && (
          <motion.div
            className="absolute inset-[-4px] rounded-full border-2 border-cyan-400/30"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* Speaking ripples */}
        {agent.state === 'speaking' && (
          <>
            <motion.div
              className="absolute inset-[-2px] rounded-full border-2 border-emerald-400/25"
              animate={{ scale: [1, 1.25, 1.5], opacity: [0.4, 0.15, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-[-2px] rounded-full border border-emerald-400/15"
              animate={{ scale: [1, 1.25, 1.5], opacity: [0.3, 0.1, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Avatar clipped to circle */}
        <div className="w-full h-full rounded-full overflow-hidden">
          <BoyAvatar state={agent.state} />
        </div>
      </motion.div>

      {/* Stop button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={onStop}
        className="mt-2 w-7 h-7 rounded-full bg-red-500/90 text-white
          flex items-center justify-center shadow-lg shadow-red-500/30
          cursor-pointer z-10 hover:bg-red-500 transition-colors"
        aria-label="Stop conversation"
      >
        <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor">
          <rect x="3" y="3" width="10" height="10" rx="1.5" />
        </svg>
      </motion.button>

      <RoomAudioRenderer />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Voice Session
   ──────────────────────────────────────────────────────────────────────────── */
function VoiceSession({ onClose }: { onClose: () => void }) {
  const session = useSession(tokenSource, { agentName: 'manpreet-assistant' });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      session.start();
    }
    return () => { session.end(); };
  }, []);

  const handleStop = useCallback(() => {
    session.end();
    onClose();
  }, [session, onClose]);

  return (
    <SessionProvider session={session}>
      <SessionContent onStop={handleStop} />
    </SessionProvider>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Main — floating avatar bottom-right
   ──────────────────────────────────────────────────────────────────────────── */
export default function VoiceAgent() {
  const [isActive, setIsActive] = useState(false);
  const handleClose = useCallback(() => setIsActive(false), []);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-center">
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <VoiceSession onClose={handleClose} />
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative group"
          >
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2
              px-3 py-1.5 rounded-lg bg-slate-900/95 border border-cyan-500/20
              text-xs text-cyan-400 font-medium whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              pointer-events-none backdrop-blur-sm shadow-lg">
              Talk to my AI
            </div>

            {/* Breathing glow ring */}
            <motion.div
              className="absolute inset-[-5px] rounded-full border border-cyan-500/20"
              animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Idle avatar button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsActive(true)}
              className="relative w-[88px] h-[88px] rounded-full
                border-2 border-cyan-500/20
                shadow-xl shadow-cyan-500/10
                cursor-pointer overflow-hidden"
              aria-label="Talk to my AI assistant"
            >
              <BoyAvatar state="idle" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
