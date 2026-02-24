'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
   Avatar SVG — stylized AI face with animated states
   ──────────────────────────────────────────────────────────────────────────── */
function AvatarFace({ state }: { state: string }) {
  const isActive = state !== 'idle' && state !== 'initializing';

  /* Mouth shapes per state */
  const mouthShapes: Record<string, string[]> = {
    idle: ['M 35,52 Q 42,56 50,52'],
    listening: ['M 33,52 Q 42,54 50,52'],
    thinking: ['M 35,53 Q 42,51 50,53', 'M 35,51 Q 42,53 50,51'],
    speaking: [
      'M 33,50 Q 42,60 50,50',
      'M 34,51 Q 42,55 49,51',
      'M 35,52 Q 42,53 50,52',
      'M 34,51 Q 42,57 49,51',
    ],
  };

  const shapes = mouthShapes[state] || mouthShapes.idle;
  const [mouthIdx, setMouthIdx] = useState(0);

  useEffect(() => {
    if (state !== 'speaking' && state !== 'thinking') { setMouthIdx(0); return; }
    const ms = state === 'speaking' ? 150 : 600;
    const iv = setInterval(() => setMouthIdx(i => (i + 1) % shapes.length), ms);
    return () => clearInterval(iv);
  }, [state, shapes.length]);

  /* Eye blink */
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 2500 + Math.random() * 3000;
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="avHead" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={isActive ? '#22d3ee' : '#64748b'} stopOpacity="0.25" />
          <stop offset="100%" stopColor={isActive ? '#7c3aed' : '#334155'} stopOpacity="0.12" />
        </radialGradient>
        <filter id="avGlow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="avPulse">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Head */}
      <circle cx="42" cy="40" r="28" fill="url(#avHead)"
        stroke={isActive ? '#22d3ee' : '#475569'} strokeWidth="1.5" strokeOpacity="0.5" />

      {/* Thinking orbit */}
      {state === 'thinking' && (
        <>
          <circle cx="42" cy="40" r="32" fill="none" stroke="#a78bfa"
            strokeWidth="1" strokeOpacity="0.5" strokeDasharray="6 4" filter="url(#avPulse)">
            <animateTransform attributeName="transform" type="rotate"
              from="0 42 40" to="360 42 40" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="42" cy="40" r="36" fill="none" stroke="#7c3aed"
            strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="3 6">
            <animateTransform attributeName="transform" type="rotate"
              from="360 42 40" to="0 42 40" dur="4s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Listening arcs */}
      {state === 'listening' && (
        <>
          <path d="M 66,30 Q 72,40 66,50" fill="none" stroke="#22d3ee"
            strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" filter="url(#avGlow)">
            <animate attributeName="stroke-opacity" values="0.6;0.2;0.6" dur="1.2s" repeatCount="indefinite" />
          </path>
          <path d="M 70,26 Q 78,40 70,54" fill="none" stroke="#06b6d4"
            strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4">
            <animate attributeName="stroke-opacity" values="0.4;0.1;0.4" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
          </path>
          <path d="M 74,22 Q 84,40 74,58" fill="none" stroke="#22d3ee"
            strokeWidth="0.7" strokeLinecap="round" strokeOpacity="0.25">
            <animate attributeName="stroke-opacity" values="0.25;0.05;0.25" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
          </path>
        </>
      )}

      {/* Speaking ripples */}
      {state === 'speaking' && (
        <>
          <circle cx="42" cy="54" r="3" fill="none" stroke="#34d399" strokeWidth="0.8" strokeOpacity="0">
            <animate attributeName="r" values="3;12;18" dur="1s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0.2;0" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="42" cy="54" r="3" fill="none" stroke="#34d399" strokeWidth="0.6" strokeOpacity="0">
            <animate attributeName="r" values="3;12;18" dur="1s" begin="0.4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.4;0.15;0" dur="1s" begin="0.4s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Eyes */}
      {blink ? (
        <>
          <line x1="32" y1="38" x2="38" y2="38" stroke={isActive ? '#22d3ee' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="38" x2="52" y2="38" stroke={isActive ? '#22d3ee' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="35" cy="37" rx="3" ry={state === 'listening' ? 3.5 : 3}
            fill={isActive ? '#22d3ee' : '#94a3b8'} filter={isActive ? 'url(#avGlow)' : undefined} />
          <ellipse cx="49" cy="37" rx="3" ry={state === 'listening' ? 3.5 : 3}
            fill={isActive ? '#22d3ee' : '#94a3b8'} filter={isActive ? 'url(#avGlow)' : undefined} />
          {/* Pupils */}
          <circle cx={state === 'thinking' ? 36 : 35.5} cy={state === 'listening' ? 36.5 : 37} r="1.2" fill="#0f172a" />
          <circle cx={state === 'thinking' ? 50 : 49.5} cy={state === 'listening' ? 36.5 : 37} r="1.2" fill="#0f172a" />
        </>
      )}

      {/* Mouth */}
      <path
        d={shapes[mouthIdx]}
        fill="none"
        stroke={state === 'speaking' ? '#34d399' : isActive ? '#22d3ee' : '#64748b'}
        strokeWidth="1.8"
        strokeLinecap="round"
        filter={state === 'speaking' ? 'url(#avGlow)' : undefined}
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   State Pill — shows above avatar when active
   ──────────────────────────────────────────────────────────────────────────── */
function StatePill({ state }: { state: string }) {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    listening: { label: 'Listening', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    thinking:  { label: 'Thinking',  color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    speaking:  { label: 'Speaking',  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  };
  const c = cfg[state];
  if (!c) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.9 }}
      className={`absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full
        text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap
        border backdrop-blur-sm ${c.bg} ${c.color}`}
    >
      {c.label}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Session Content — has access to agent state
   ──────────────────────────────────────────────────────────────────────────── */
function SessionContent({ onStop }: { onStop: () => void }) {
  const agent = useAgent();

  return (
    <div className="relative">
      {/* State pill */}
      <AnimatePresence mode="wait">
        <StatePill key={agent.state} state={agent.state} />
      </AnimatePresence>

      {/* Avatar */}
      <motion.div
        className="relative w-[72px] h-[72px] rounded-full select-none"
        animate={{
          scale: agent.state === 'speaking' ? [1, 1.05, 1] : 1,
          boxShadow:
            agent.state === 'listening'  ? '0 0 20px 4px rgba(34,211,238,0.25)'
            : agent.state === 'thinking' ? '0 0 20px 4px rgba(139,92,246,0.25)'
            : agent.state === 'speaking' ? '0 0 24px 6px rgba(52,211,153,0.3)'
            : '0 0 0px 0px rgba(0,0,0,0)',
        }}
        transition={{
          scale: { duration: 0.6, repeat: agent.state === 'speaking' ? Infinity : 0, repeatType: 'reverse' },
          boxShadow: { duration: 0.5 },
        }}
      >
        <AvatarFace state={agent.state} />
      </motion.div>

      {/* Stop button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.85 }}
        onClick={onStop}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full
          bg-red-500/90 text-white flex items-center justify-center
          shadow-lg shadow-red-500/30 cursor-pointer z-10"
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
   Voice Session — lifecycle wrapper
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
   Main — floating avatar, bottom-right, non-blocking
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

            {/* Breathing ring */}
            <motion.div
              className="absolute inset-[-6px] rounded-full border border-cyan-500/20"
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Avatar button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsActive(true)}
              className="relative w-[72px] h-[72px] rounded-full
                bg-slate-950/80 border border-cyan-500/20
                backdrop-blur-sm shadow-xl shadow-cyan-500/10
                cursor-pointer overflow-hidden"
              aria-label="Talk to my AI assistant"
            >
              <AvatarFace state="idle" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
