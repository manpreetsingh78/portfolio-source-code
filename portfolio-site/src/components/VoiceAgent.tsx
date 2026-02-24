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
   Boy Avatar SVG — professional young man with glasses, suit & tie
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
      }, 2800 + Math.random() * 2500);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  /* Mouth animation for speaking */
  const [mouthOpen, setMouthOpen] = useState(0);
  useEffect(() => {
    if (!isSpeaking) { setMouthOpen(0); return; }
    const iv = setInterval(() => setMouthOpen(Math.random()), 120);
    return () => clearInterval(iv);
  }, [isSpeaking]);

  const mouthRy = isSpeaking ? 1.5 + mouthOpen * 3.5 : 0;

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden>
      <defs>
        {/* Skin gradient — fair/light tone */}
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fce4d0" />
          <stop offset="100%" stopColor="#f0cdb0" />
        </linearGradient>
        {/* Hair gradient — dark brown */}
        <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b2417" />
          <stop offset="100%" stopColor="#2a1a10" />
        </linearGradient>
        {/* Suit / blazer gradient */}
        <linearGradient id="blazer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d2d2d" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        {/* Tie gradient — dark teal */}
        <linearGradient id="tie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a5c5c" />
          <stop offset="100%" stopColor="#134545" />
        </linearGradient>
        {/* Background circle */}
        <radialGradient id="bgCircle" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={isActive ? '#e8eff7' : '#f0f4f8'} />
          <stop offset="100%" stopColor={isActive ? '#c8d6e5' : '#dde4ec'} />
        </radialGradient>
        {/* Glow */}
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Shadow under head */}
        <filter id="headShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000020" />
        </filter>
      </defs>

      {/* Background */}
      <circle cx="60" cy="60" r="58" fill="url(#bgCircle)" />

      {/* ── Body / Suit ── */}
      {/* Shoulders + blazer */}
      <path d="M18,120 Q18,92 38,86 L60,82 L82,86 Q102,92 102,120 Z" fill="url(#blazer)" />
      {/* Lapels */}
      <path d="M48,88 L56,98 L60,92" fill="none" stroke="#3d3d3d" strokeWidth="1" />
      <path d="M72,88 L64,98 L60,92" fill="none" stroke="#3d3d3d" strokeWidth="1" />
      {/* Left lapel fill */}
      <path d="M42,86 L48,88 L56,98 L60,92 L60,120 L18,120 Q18,92 38,86 Z" fill="#333" opacity="0.3" />
      {/* Right lapel fill */}
      <path d="M78,86 L72,88 L64,98 L60,92 L60,120 L102,120 Q102,92 82,86 Z" fill="#333" opacity="0.3" />

      {/* White shirt visible at chest */}
      <path d="M48,88 L56,98 L60,92 L64,98 L72,88 L68,84 L60,82 L52,84 Z" fill="#f5f5f5" />
      <path d="M56,98 L60,92 L64,98 L62,120 L58,120 Z" fill="#efefef" />

      {/* Tie */}
      <path d="M58.5,92 L60,90 L61.5,92 L62,108 L60,112 L58,108 Z" fill="url(#tie)" />
      {/* Tie knot */}
      <path d="M58.8,90 L60,88.5 L61.2,90 L61,92 L59,92 Z" fill="#1a5c5c" />
      {/* Tie stripe detail */}
      <line x1="59.2" y1="95" x2="60.8" y2="95" stroke="#1e6b6b" strokeWidth="0.6" opacity="0.5" />
      <line x1="59" y1="99" x2="61" y2="99" stroke="#1e6b6b" strokeWidth="0.6" opacity="0.5" />
      <line x1="58.8" y1="103" x2="61.2" y2="103" stroke="#1e6b6b" strokeWidth="0.6" opacity="0.5" />

      {/* Shirt collar */}
      <path d="M52,84 L48,88 L53,87" fill="#f0f0f0" stroke="#e0e0e0" strokeWidth="0.3" />
      <path d="M68,84 L72,88 L67,87" fill="#f0f0f0" stroke="#e0e0e0" strokeWidth="0.3" />

      {/* Neck */}
      <rect x="52" y="76" width="16" height="10" rx="3" fill="url(#skin)" />

      {/* ── Head ── */}
      <ellipse cx="60" cy="55" rx="24" ry="26" fill="url(#skin)" filter="url(#headShadow)" />

      {/* Ears */}
      <ellipse cx="36" cy="57" rx="4.5" ry="5.5" fill="#f0cdb0" />
      <ellipse cx="36" cy="57" rx="2.8" ry="3.5" fill="#e6bfa0" />
      <ellipse cx="84" cy="57" rx="4.5" ry="5.5" fill="#f0cdb0" />
      <ellipse cx="84" cy="57" rx="2.8" ry="3.5" fill="#e6bfa0" />

      {/* ── Hair — dark brown, combed/neat style ── */}
      {/* Main hair mass */}
      <path d="M36,46 Q36,22 60,18 Q84,22 84,46 L84,40 Q82,26 60,23 Q38,26 36,40 Z" fill="url(#hair)" />
      {/* Volume on top */}
      <path d="M34,46 Q32,26 56,16 Q72,14 82,20 Q92,26 88,46 Q86,28 60,24 Q38,26 36,44 Z" fill="url(#hair)" />
      {/* Side hair */}
      <path d="M36,44 Q34,40 35,34 Q38,28 40,32 Q38,36 38,44" fill="url(#hair)" />
      <path d="M84,44 Q86,40 85,34 Q82,28 80,32 Q82,36 82,44" fill="url(#hair)" />
      {/* Fringe — parted, swept slightly right */}
      <path d="M40,40 Q44,28 56,24 L50,38 Z" fill="#2a1a10" opacity="0.85" />
      <path d="M46,36 Q52,24 66,24 L58,36 Z" fill="#3b2417" opacity="0.8" />
      <path d="M78,40 Q80,30 74,26 L72,36 Z" fill="#2a1a10" opacity="0.7" />
      {/* Hair highlight */}
      <path d="M52,22 Q60,18 68,20" fill="none" stroke="#5a3a28" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />

      {/* ── Eyebrows ── */}
      <path d={`M46,${isListening ? 45 : 47} Q50,${isListening ? 43 : 45} 54,${isListening ? 45.5 : 47.5}`}
        fill="none" stroke="#3b2417" strokeWidth="1.6" strokeLinecap="round" />
      <path d={`M66,${isListening ? 45.5 : 47.5} Q70,${isListening ? 43 : 45} 74,${isListening ? 45 : 47}`}
        fill="none" stroke="#3b2417" strokeWidth="1.6" strokeLinecap="round" />

      {/* ── Glasses ── */}
      {/* Left lens */}
      <ellipse cx="50" cy="54" rx="8" ry="7.5" fill="none" stroke="#3d3020" strokeWidth="1.6" />
      {/* Right lens */}
      <ellipse cx="70" cy="54" rx="8" ry="7.5" fill="none" stroke="#3d3020" strokeWidth="1.6" />
      {/* Bridge */}
      <path d="M58,54 Q60,52 62,54" fill="none" stroke="#3d3020" strokeWidth="1.4" />
      {/* Temple arms */}
      <line x1="42" y1="53" x2="36" y2="55" stroke="#3d3020" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="78" y1="53" x2="84" y2="55" stroke="#3d3020" strokeWidth="1.2" strokeLinecap="round" />
      {/* Lens reflection */}
      <ellipse cx="46" cy="51" rx="2.5" ry="1.5" fill="white" opacity="0.12" />
      <ellipse cx="66" cy="51" rx="2.5" ry="1.5" fill="white" opacity="0.12" />

      {/* ── Eyes ── */}
      {blink ? (
        <>
          <line x1="46" y1="55" x2="54" y2="55" stroke="#2a1a10" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="66" y1="55" x2="74" y2="55" stroke="#2a1a10" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Left eye */}
          <ellipse cx="50" cy="55" rx="4" ry="4.2" fill="white" />
          <circle cx={isThinking ? 52 : 50.5} cy={isListening ? 54 : 55} r="2.8" fill="#2a1a10" />
          <circle cx={isThinking ? 52.8 : 51.2} cy={isListening ? 53.2 : 54.2} r="0.9" fill="white" />

          {/* Right eye */}
          <ellipse cx="70" cy="55" rx="4" ry="4.2" fill="white" />
          <circle cx={isThinking ? 72 : 70.5} cy={isListening ? 54 : 55} r="2.8" fill="#2a1a10" />
          <circle cx={isThinking ? 72.8 : 71.2} cy={isListening ? 53.2 : 54.2} r="0.9" fill="white" />
        </>
      )}

      {/* Nose */}
      <path d="M58,62 Q60,65 62,62" fill="none" stroke="#daa885" strokeWidth="1.1" strokeLinecap="round" />

      {/* Mouth */}
      {isSpeaking ? (
        <ellipse cx="60" cy="70" rx={2.5 + mouthOpen * 1.8} ry={mouthRy} fill="#c0392b" />
      ) : (
        <path d={isListening ? "M55,69 Q60,73 65,69" : "M56,69 Q60,72 64,69"}
          fill="none" stroke="#b85450" strokeWidth="1.3" strokeLinecap="round" />
      )}

      {/* Cheek blush */}
      <circle cx="40" cy="64" r="4" fill="#f0a090" opacity="0.2" />
      <circle cx="80" cy="64" r="4" fill="#f0a090" opacity="0.2" />

      {/* ── State-specific effects ── */}

      {/* Headphones for listening */}
      {isListening && (
        <>
          <path d="M34,50 Q32,38 40,30" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" filter="url(#softGlow)" />
          <path d="M86,50 Q88,38 80,30" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" filter="url(#softGlow)" />
          <rect x="30" y="50" width="7" height="11" rx="3" fill="#22d3ee" opacity="0.7" filter="url(#softGlow)" />
          <rect x="83" y="50" width="7" height="11" rx="3" fill="#22d3ee" opacity="0.7" filter="url(#softGlow)" />
          <path d="M34,42 Q34,24 60,20 Q86,24 86,42" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </>
      )}

      {/* Thinking bubbles */}
      {isThinking && (
        <>
          <circle cx="92" cy="36" r="3" fill="#a78bfa" opacity="0.7" filter="url(#softGlow)">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="98" cy="28" r="4" fill="#a78bfa" opacity="0.5" filter="url(#softGlow)">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="102" cy="18" r="5" fill="#a78bfa" opacity="0.4" filter="url(#softGlow)">
            <animate attributeName="opacity" values="0.15;0.6;0.15" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Speaking sound waves */}
      {isSpeaking && (
        <>
          <path d="M86,66 Q92,58 86,50" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" filter="url(#softGlow)">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.8s" repeatCount="indefinite" />
          </path>
          <path d="M90,70 Q98,58 90,46" fill="none" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
          </path>
          <path d="M94,74 Q104,58 94,42" fill="none" stroke="#34d399" strokeWidth="0.8" strokeLinecap="round" opacity="0.25">
            <animate attributeName="opacity" values="0.25;0.05;0.25" dur="0.8s" begin="0.4s" repeatCount="indefinite" />
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
