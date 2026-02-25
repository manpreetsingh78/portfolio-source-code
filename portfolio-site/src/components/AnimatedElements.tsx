'use client';

import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

/* ── Animated Counter ── */
export function AnimatedCounter({
  target,
  suffix = '',
  duration = 2,
  delay = 0,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    if (target < 1) return v.toFixed(2);
    if (target < 100) return Math.round(v).toString();
    return Math.round(v).toString();
  });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const controls = {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    };

    const animation = import('framer-motion').then(({ animate }) => {
      animate(count, target, controls);
    });

    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => {
      unsub();
    };
  }, [isInView, target, duration, delay, count, rounded]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/* ── Typewriter ── */
export function Typewriter({
  words,
  className = '',
}: {
  words: string[];
  className?: string;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && text === current) {
      const t = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const t = setTimeout(() => {
      setText(
        isDeleting ? current.substring(0, text.length - 1) : current.substring(0, text.length + 1)
      );
    }, speed);
    return () => clearTimeout(t);
  }, [text, isDeleting, wordIndex, words]);

  return (
    <span className={className}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[2px] h-[1em] bg-cyan-400 ml-0.5 align-middle"
      />
    </span>
  );
}

/* ── Glitch Text ── */
export function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`} aria-label={text}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute top-0 left-0 -z-10 text-cyan-400 opacity-0 hover:opacity-80 transition-opacity"
        style={{ clipPath: 'inset(20% 0 30% 0)', transform: 'translate(-2px, 2px)' }}
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 -z-10 text-blue-500 opacity-0 hover:opacity-80 transition-opacity"
        style={{ clipPath: 'inset(50% 0 10% 0)', transform: 'translate(2px, -2px)' }}
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}

/* ── Scroll Progress ── */
export function ScrollProgress() {
  const scaleX = useMotionValue(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      scaleX.set(window.scrollY / total);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scaleX]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 z-[100] origin-left"
      style={{ scaleX }}
    />
  );
}

/* ── Animated Gradient Border Card ── */
export function GradientBorderCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated gradient border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 group-hover:from-cyan-500/50 group-hover:via-blue-500/50 group-hover:to-purple-500/50 transition-all duration-500 blur-[1px] opacity-0 group-hover:opacity-100" />
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-border-rotate opacity-50" />
      {/* Content */}
      <div className="relative glass rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-cyan-500/10 group-hover:border-transparent transition-all duration-500 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
