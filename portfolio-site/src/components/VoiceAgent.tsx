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
   Boy Avatar SVG — stylized cartoon male developer illustration
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

  const mouthY = isSpeaking ? 2 + mouthOpen * 4 : 0;

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden>
      <defs>
        {/* Skin gradient */}
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5c9a8" />
          <stop offset="100%" stopColor="#e8b08a" />
        </linearGradient>
        {/* Hair gradient */}
        <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#16213e" />
        </linearGradient>
        {/* Hoodie gradient */}
        <linearGradient id="hoodie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        {/* Hoodie accent */}
        <linearGradient id="hoodieAccent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        {/* Background circle */}
        <radialGradient id="bgCircle" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={isActive ? '#0f2a3d' : '#1e293b'} />
          <stop offset="100%" stopColor={isActive ? '#0a1628' : '#0f172a'} />
        </radialGradient>
        {/* Glow */}
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <circle cx="60" cy="60" r="58" fill="url(#bgCircle)" />

      {/* Neck */}
      <rect x="50" y="78" width="20" height="14" rx="4" fill="url(#skin)" />

      {/* Hoodie / Shoulders */}
      <path d="M28,120 Q28,88 42,84 L60,80 L78,84 Q92,88 92,120 Z" fill="url(#hoodie)" />
      {/* Hoodie neckline */}
      <path d="M46,87 L54,94 L60,90 L66,94 L74,87" fill="none" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />
      {/* Hoodie drawstring */}
      <line x1="54" y1="94" x2="52" y2="102" stroke="#94a3b8" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="66" y1="94" x2="68" y2="102" stroke="#94a3b8" strokeWidth="0.8" strokeLinecap="round" />
      {/* Cyan accent stripe on hoodie */}
      <path d="M43,86 Q50,92 60,88 Q70,92 77,86" fill="none" stroke="url(#hoodieAccent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

      {/* Head shape */}
      <ellipse cx="60" cy="58" rx="26" ry="28" fill="url(#skin)" />

      {/* Ears */}
      <ellipse cx="34" cy="60" rx="5" ry="6" fill="#e8b08a" />
      <ellipse cx="34" cy="60" rx="3" ry="4" fill="#daa07a" />
      <ellipse cx="86" cy="60" rx="5" ry="6" fill="#e8b08a" />
      <ellipse cx="86" cy="60" rx="3" ry="4" fill="#daa07a" />

      {/* Hair — thick, dark, messy-styled */}
      <path d="M34,48 Q34,22 60,20 Q86,22 86,48 L86,42 Q84,26 60,24 Q36,26 34,42 Z" fill="url(#hair)" />
      {/* Hair volume top */}
      <path d="M32,48 Q30,28 55,18 Q70,16 80,22 Q90,28 88,48 Q86,30 60,26 Q38,28 34,46 Z" fill="url(#hair)" />
      {/* Side hair strands */}
      <path d="M34,46 Q30,42 32,36 Q36,30 38,34 Q36,38 36,46" fill="url(#hair)" />
      <path d="M86,46 Q90,42 88,36 Q84,30 82,34 Q84,38 84,46" fill="url(#hair)" />
      {/* Fringe / bangs */}
      <path d="M38,42 Q42,30 52,28 L48,40 Z" fill="#16213e" opacity="0.9" />
      <path d="M44,38 Q50,26 62,26 L55,38 Z" fill="#1a1a2e" opacity="0.85" />
      <path d="M76,40 Q78,30 72,28 L70,38 Z" fill="#16213e" opacity="0.8" />
      {/* Hair highlight */}
      <path d="M50,24 Q58,20 66,22" fill="none" stroke="#2a3a5e" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Eyebrows */}
      <path d={`M45,${isListening ? 47 : 49} Q50,${isListening ? 45 : 47} 55,${isListening ? 47 : 49}`}
        fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
      <path d={`M65,${isListening ? 47 : 49} Q70,${isListening ? 45 : 47} 75,${isListening ? 47 : 49}`}
        fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />

      {/* Eyes */}
      {blink ? (
        <>
          <line x1="46" y1="56" x2="55" y2="56" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
          <line x1="65" y1="56" x2="74" y2="56" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Left eye */}
          <ellipse cx="50" cy="56" rx="5.5" ry="5.5" fill="white" />
          <circle cx={isThinking ? 52 : 50.5} cy={isListening ? 55 : 56} r="3" fill="#1a1a2e" />
          <circle cx={isThinking ? 53 : 51.5} cy={isListening ? 54 : 55} r="1" fill="white" />

          {/* Right eye */}
          <ellipse cx="70" cy="56" rx="5.5" ry="5.5" fill="white" />
          <circle cx={isThinking ? 72 : 70.5} cy={isListening ? 55 : 56} r="3" fill="#1a1a2e" />
          <circle cx={isThinking ? 73 : 71.5} cy={isListening ? 54 : 55} r="1" fill="white" />
        </>
      )}

      {/* Nose */}
      <path d="M58,63 Q60,66 62,63" fill="none" stroke="#d49a76" strokeWidth="1.2" strokeLinecap="round" />

      {/* Mouth */}
      {isSpeaking ? (
        <ellipse cx="60" cy="72" rx={3 + mouthOpen * 2} ry={1 + mouthY} fill="#c0392b" />
      ) : (
        <path d={isListening ? "M54,71 Q60,76 66,71" : "M55,71 Q60,74 65,71"}
          fill="none" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round" />
      )}

      {/* Cheek blush */}
      <circle cx="40" cy="66" r="4" fill="#f0a090" opacity="0.3" />
      <circle cx="80" cy="66" r="4" fill="#f0a090" opacity="0.3" />

      {/* Headphones for listening state */}
      {isListening && (
        <>
          <path d="M32,52 Q30,40 38,32" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" filter="url(#softGlow)" />
          <path d="M88,52 Q90,40 82,32" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" filter="url(#softGlow)" />
          <rect x="28" y="52" width="8" height="12" rx="3" fill="#22d3ee" opacity="0.7" filter="url(#softGlow)" />
          <rect x="84" y="52" width="8" height="12" rx="3" fill="#22d3ee" opacity="0.7" filter="url(#softGlow)" />
          <path d="M32,44 Q32,28 60,24 Q88,28 88,44" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </>
      )}

      {/* Thinking dots */}
      {isThinking && (
        <>
          <circle cx="92" cy="38" r="3" fill="#a78bfa" opacity="0.7" filter="url(#softGlow)">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="98" cy="30" r="4" fill="#a78bfa" opacity="0.5" filter="url(#softGlow)">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="102" cy="20" r="5" fill="#a78bfa" opacity="0.4" filter="url(#softGlow)">
            <animate attributeName="opacity" values="0.15;0.6;0.15" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Speaking sound waves */}
      {isSpeaking && (
        <>
          <path d="M88,68 Q94,60 88,52" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" filter="url(#softGlow)">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.8s" repeatCount="indefinite" />
          </path>
          <path d="M92,72 Q100,60 92,48" fill="none" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
          </path>
          <path d="M96,76 Q106,60 96,44" fill="none" stroke="#34d399" strokeWidth="0.8" strokeLinecap="round" opacity="0.25">
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
