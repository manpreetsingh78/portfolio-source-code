'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useSession,
  SessionProvider,
  useAgent,
  RoomAudioRenderer,
} from '@livekit/components-react';
import Image from 'next/image';
import { TokenSource } from 'livekit-client';

/* ─── Token Source ─── */
const tokenSource = TokenSource.endpoint('/api/voice-token');

/* ────────────────────────────────────────────────────────────────────────────
   Avatar — uses the actual illustrated avatar image
   ──────────────────────────────────────────────────────────────────────────── */
function Avatar() {
  return (
    <Image
      src="/avatar.jpg"
      alt="AI Assistant"
      width={120}
      height={120}
      className="w-full h-full object-cover"
      priority
    />
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
          <Avatar />
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
              <Avatar />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
