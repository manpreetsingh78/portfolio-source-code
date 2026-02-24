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
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-react';

/* ─── Token Source ─── */
const tokenSource = TokenSource.endpoint('/api/voice-token');

/* ─── Animation URLs (free, Lottie Simple License) ─── */
const ANIM_URLS = {
  bot: 'https://assets-v2.lottiefiles.com/a/1ecb640a-0089-11ef-bc40-4f65d6930b24/z9HKHR1TEE.lottie',
};

/* ────────────────────────────────────────────────────────────────────────────
   State-based glow config
   ──────────────────────────────────────────────────────────────────────────── */
const stateGlow: Record<string, { shadow: string; border: string; label: string; color: string }> = {
  idle:         { shadow: '0 0 20px 2px rgba(100,116,139,0.15)', border: 'border-slate-500/20', label: '', color: '' },
  initializing: { shadow: '0 0 20px 2px rgba(100,116,139,0.15)', border: 'border-slate-500/20', label: 'Connecting', color: 'text-slate-400' },
  listening:    { shadow: '0 0 28px 8px rgba(34,211,238,0.35)',  border: 'border-cyan-400/40',   label: 'Listening',  color: 'text-cyan-400'   },
  thinking:     { shadow: '0 0 28px 8px rgba(139,92,246,0.35)',  border: 'border-violet-400/40', label: 'Thinking',   color: 'text-violet-400' },
  speaking:     { shadow: '0 0 32px 10px rgba(52,211,153,0.4)', border: 'border-emerald-400/40', label: 'Speaking',   color: 'text-emerald-400'},
};

const getGlow = (state: string) => stateGlow[state] || stateGlow.idle;

/* ────────────────────────────────────────────────────────────────────────────
   State Pill — label shown above avatar when active
   ──────────────────────────────────────────────────────────────────────────── */
function StatePill({ state }: { state: string }) {
  const g = getGlow(state);
  if (!g.label) return null;

  const bgMap: Record<string, string> = {
    listening: 'bg-cyan-500/10 border-cyan-500/25',
    thinking:  'bg-violet-500/10 border-violet-500/25',
    speaking:  'bg-emerald-500/10 border-emerald-500/25',
    initializing: 'bg-slate-500/10 border-slate-500/25',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.9 }}
      className={`absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full
        text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap
        border backdrop-blur-sm ${bgMap[state] || ''} ${g.color}`}
    >
      {g.label}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Lottie Avatar — controls DotLottie playback based on agent state
   ──────────────────────────────────────────────────────────────────────────── */
function LottieAvatar({ state }: { state: string }) {
  const dotLottieRef = useRef<DotLottie | null>(null);

  /* Control animation speed based on state */
  useEffect(() => {
    const instance = dotLottieRef.current;
    if (!instance) return;

    switch (state) {
      case 'speaking':
        instance.setSpeed(1.4);
        instance.play();
        break;
      case 'thinking':
        instance.setSpeed(0.5);
        instance.play();
        break;
      case 'listening':
        instance.setSpeed(0.8);
        instance.play();
        break;
      default:
        instance.setSpeed(1);
        instance.play();
        break;
    }
  }, [state]);

  return (
    <div className="w-full h-full rounded-full overflow-hidden">
      <DotLottieReact
        src={ANIM_URLS.bot}
        loop
        autoplay
        dotLottieRefCallback={(dotLottie) => {
          dotLottieRef.current = dotLottie;
        }}
        className="w-full h-full scale-[1.35]"
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Session Content — has access to agent state, renders avatar + controls
   ──────────────────────────────────────────────────────────────────────────── */
function SessionContent({ onStop }: { onStop: () => void }) {
  const agent = useAgent();
  const g = useMemo(() => getGlow(agent.state), [agent.state]);

  return (
    <div className="relative flex flex-col items-center">
      {/* State pill */}
      <AnimatePresence mode="wait">
        <StatePill key={agent.state} state={agent.state} />
      </AnimatePresence>

      {/* Avatar container with state-based glow */}
      <motion.div
        className={`relative w-20 h-20 rounded-full border-2 ${g.border}
          bg-slate-950/90 backdrop-blur-sm overflow-hidden select-none`}
        animate={{
          scale: agent.state === 'speaking' ? [1, 1.06, 1] : 1,
          boxShadow: g.shadow,
        }}
        transition={{
          scale: {
            duration: 0.7,
            repeat: agent.state === 'speaking' ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
          boxShadow: { duration: 0.4 },
        }}
      >
        {/* Rotating ring for thinking state */}
        {agent.state === 'thinking' && (
          <motion.div
            className="absolute inset-[-4px] rounded-full border-2 border-dashed border-violet-400/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Sound wave arcs for listening */}
        {agent.state === 'listening' && (
          <>
            <motion.div
              className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-6 border-r-2 border-cyan-400/50 rounded-r-full"
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-8 border-r-2 border-cyan-400/30 rounded-r-full"
              animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}

        {/* Emerald ripples for speaking */}
        {agent.state === 'speaking' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
              animate={{ scale: [1, 1.3, 1.6], opacity: [0.4, 0.15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-emerald-400/20"
              animate={{ scale: [1, 1.3, 1.6], opacity: [0.3, 0.1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Lottie animation */}
        <LottieAvatar state={agent.state} />
      </motion.div>

      {/* Stop button below avatar */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.2 }}
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
   Main — floating avatar in bottom-right, non-blocking
   ──────────────────────────────────────────────────────────────────────────── */
export default function VoiceAgent() {
  const [isActive, setIsActive] = useState(false);
  const handleClose = useCallback(() => setIsActive(false), []);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-center">
      <AnimatePresence mode="wait">
        {isActive ? (
          /* ─── Active: session running ─── */
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
          /* ─── Idle: clickable avatar ─── */
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
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Idle avatar button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsActive(true)}
              className="relative w-20 h-20 rounded-full
                bg-slate-950/90 border-2 border-cyan-500/20
                backdrop-blur-sm shadow-xl shadow-cyan-500/10
                cursor-pointer overflow-hidden"
              aria-label="Talk to my AI assistant"
            >
              <DotLottieReact
                src={ANIM_URLS.bot}
                loop
                autoplay
                className="w-full h-full scale-[1.35]"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
