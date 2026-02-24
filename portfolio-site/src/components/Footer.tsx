'use client';

import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-200/50 dark:border-slate-800/50">
      {/* Subtle gradient top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left - branding + copyright */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold gradient-text">MS</span>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              &copy; {new Date().getFullYear()} Manpreet Singh. Built with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart size={14} className="text-red-500" fill="currentColor" />
              </motion.span>
            </p>
          </div>

          {/* Center - social links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: 'https://github.com/manpreet-singh', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com/in/manpreet-singh', label: 'LinkedIn' },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/5 transition-all duration-200"
                  whileHover={{ y: -2 }}
                  aria-label={link.label}
                >
                  <Icon size={18} />
                </motion.a>
              );
            })}
          </div>

          {/* Right - back to top button */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors group"
            whileHover={{ y: -2 }}
          >
            Back to top
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
