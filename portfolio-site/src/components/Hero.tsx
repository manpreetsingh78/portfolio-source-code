'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Mail, ArrowDown } from 'lucide-react';
import { useRef } from 'react';
import SystemBlueprint from './SystemBlueprint';
import { Typewriter } from './AnimatedElements';

export default function Hero() {
  const startDate = new Date(2022, 6, 1); // July 2022
  const now = new Date();
  const diffYears = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const years = Math.floor(diffYears * 10) / 10;

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section
      ref={ref}
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Layered backgrounds */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#020617] dark:via-[#0a0f1c] dark:to-[#020617]"
      />

      {/* Animated mesh gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-500/8 to-blue-500/8 dark:from-cyan-500/5 dark:to-blue-500/5 blur-3xl animate-float" />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/6 to-cyan-500/6 dark:from-purple-500/4 dark:to-cyan-500/4 blur-3xl animate-float"
          style={{ animationDelay: '-3s' }}
        />
        <div
          className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/3 dark:to-purple-500/3 blur-3xl animate-float"
          style={{ animationDelay: '-5s' }}
        />
      </div>

      {/* Hex grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hexgrid" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
              <path
                d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <path
                d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexgrid)" />
        </svg>
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
          animate={{ y: ['0vh', '100vh'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full"
      >
        {/* Left side */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Available for opportunities
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[0.9]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              Manpreet
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="block gradient-text"
            >
              Singh
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-4"
          >
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-light">
              Software Engineer &mdash;{' '}
              <Typewriter
                words={['Full Stack', 'Cloud & Infra', 'AI Systems', 'System Design']}
                className="text-cyan-600 dark:text-cyan-400 font-medium"
              />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center gap-3 mb-8 text-slate-400 dark:text-slate-500 text-sm"
          >
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              India
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
            <span className="font-mono">{years}+ years</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-slate-500 dark:text-slate-400 max-w-lg mb-10 leading-relaxed text-base"
          >
            Building resilient distributed systems — from pixel-perfect interfaces
            to fault-tolerant backends and intelligent pipelines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#contact"
              className="group relative px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/25"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Mail size={18} className="relative z-10" />
              <span className="relative z-10">Get in Touch</span>
            </a>
            <a
              href="#capabilities"
              className="group px-8 py-3.5 rounded-xl font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-2 hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              <span>Explore</span>
              <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -5 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block perspective-1000"
        >
          <SystemBlueprint />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-slate-300 dark:border-slate-600 flex justify-center pt-1.5">
            <motion.div
              animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-0.5 h-2 rounded-full bg-cyan-500"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
