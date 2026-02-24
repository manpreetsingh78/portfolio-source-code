'use client';

import { FileText, Download, ExternalLink } from 'lucide-react';
import SectionReveal from './SectionReveal';

export default function ResumeSection() {
  return (
    <section id="resume" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-slate-900/30 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <SectionReveal>
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-3">
              Resume
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              My Background
            </h2>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="glass rounded-2xl p-8 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-cyan-500/10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-cyan-600 dark:text-cyan-400" />
            </div>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Manpreet Singh
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Software Engineer &mdash; Full Stack, AI &amp; Cloud
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/resume.pdf"
                download
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all duration-300 border border-slate-200 dark:border-slate-700 flex items-center gap-2"
              >
                <ExternalLink size={18} />
                View Online
              </a>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
