'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Brain,
  Code2,
  Sparkles,
  Hash,
  FileCode,
  Globe,
  ArrowRight,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import SectionReveal from './SectionReveal';

const VM_API = process.env.NEXT_PUBLIC_VM_API_URL || 'https://api.manpreetsingh.co.in';

type TabId = 'sentiment' | 'keywords' | 'summarize' | 'hash' | 'base64' | 'headers';

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ElementType;
  group: 'ai' | 'tools';
  description: string;
  placeholder?: string;
}

const tabs: TabDef[] = [
  {
    id: 'sentiment',
    label: 'Sentiment',
    icon: Brain,
    group: 'ai',
    description: 'Analyze the emotional tone of any text in real-time.',
    placeholder: 'I absolutely love building scalable systems and solving complex engineering problems!',
  },
  {
    id: 'keywords',
    label: 'Keywords',
    icon: Sparkles,
    group: 'ai',
    description: 'Extract the most relevant keywords from a block of text.',
    placeholder:
      'Machine learning and artificial intelligence are transforming software engineering. Deep learning models enable natural language processing, computer vision, and autonomous systems.',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    icon: FileCode,
    group: 'ai',
    description: 'Generate a concise extractive summary of long text.',
    placeholder:
      'Cloud computing has revolutionized how businesses deploy and scale their applications. Services like AWS, Azure, and GCP provide on-demand infrastructure that can be provisioned in minutes. Containerization with Docker and orchestration with Kubernetes have become industry standards for deploying microservices. CI/CD pipelines automate the build, test, and deployment process, enabling teams to ship faster with confidence. Infrastructure as Code tools like Terraform allow engineers to manage cloud resources declaratively.',
  },
  {
    id: 'hash',
    label: 'Hash',
    icon: Hash,
    group: 'tools',
    description: 'Generate cryptographic hashes (MD5, SHA-256, SHA-512).',
    placeholder: 'Hello, World!',
  },
  {
    id: 'base64',
    label: 'Base64',
    icon: Code2,
    group: 'tools',
    description: 'Encode or decode Base64 strings.',
    placeholder: 'Hello, World!',
  },
  {
    id: 'headers',
    label: 'Headers',
    icon: Globe,
    group: 'tools',
    description: 'Inspect the HTTP headers your browser sends.',
  },
];

/* ── Result Displays ── */

function SentimentResult({ data }: { data: Record<string, unknown> }) {
  const polarity = data.polarity as number;
  const barWidth = ((polarity + 1) / 2) * 100; // map -1..1 → 0..100
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{data.emoji as string}</span>
        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">
            {data.label as string}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {data.word_count as number} words analyzed
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
            <span>Negative</span>
            <span>Polarity: {polarity}</span>
            <span>Positive</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-400 via-slate-400 to-emerald-400"
              initial={{ width: '50%' }}
              animate={{ width: `${barWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">
            Subjectivity: <span className="text-slate-700 dark:text-slate-300 font-mono">{data.subjectivity as number}</span>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Confidence: <span className="text-slate-700 dark:text-slate-300 font-mono">{((data.confidence as number) * 100).toFixed(0)}%</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function KeywordsResult({ data }: { data: Record<string, unknown> }) {
  const keywords = data.keywords as Array<{ word: string; count: number; relevance: number }>;
  return (
    <div className="space-y-3">
      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        {data.total_words as number} words · {data.unique_words as number} unique
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <motion.span
            key={kw.word}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-medium border border-cyan-500/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{ fontSize: `${Math.max(10, 10 + kw.relevance * 4)}px` }}
          >
            {kw.word}
            <span className="ml-1 text-[9px] opacity-60">×{kw.count}</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function SummarizeResult({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {data.summary as string}
      </p>
      <div className="flex gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
        <span>{data.sentences_original as number} → {data.sentences_summary as number} sentences</span>
        <span>{((data.compression_ratio as number) * 100).toFixed(0)}% compression</span>
      </div>
    </div>
  );
}

function HashResult({ data }: { data: Record<string, unknown> }) {
  const [copied, setCopied] = useState(false);
  const hash = data.hash as string;

  const copy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span>{(data.algorithm as string).toUpperCase()}</span>
        <span>·</span>
        <span>{data.length as number} chars</span>
      </div>
      <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/30">
        <code className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono break-all flex-1">
          {hash}
        </code>
        <button onClick={copy} className="shrink-0 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
        </button>
      </div>
    </div>
  );
}

function GenericResult({ data }: { data: Record<string, unknown> }) {
  return (
    <pre className="text-[11px] text-slate-600 dark:text-slate-400 font-mono whitespace-pre-wrap bg-slate-100 dark:bg-slate-800/40 rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/30 max-h-64 overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

/* ── Main Component ── */

export default function InteractiveLab() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState<TabId>('sentiment');
  const [input, setInput] = useState('');
  const [hashAlgo, setHashAlgo] = useState('sha256');
  const [b64Action, setB64Action] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeTabDef = tabs.find((t) => t.id === activeTab)!;

  const runQuery = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let url = '';
      let options: RequestInit = {};

      switch (activeTab) {
        case 'sentiment':
          url = `${VM_API}/api/v1/ai/sentiment`;
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input }),
          };
          break;
        case 'keywords':
          url = `${VM_API}/api/v1/ai/keywords`;
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input }),
          };
          break;
        case 'summarize':
          url = `${VM_API}/api/v1/ai/summarize`;
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input }),
          };
          break;
        case 'hash':
          url = `${VM_API}/api/v1/playground/hash`;
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input, algorithm: hashAlgo }),
          };
          break;
        case 'base64':
          url = `${VM_API}/api/v1/playground/base64`;
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input, action: b64Action }),
          };
          break;
        case 'headers':
          url = `${VM_API}/api/v1/playground/headers`;
          options = { method: 'GET' };
          break;
      }

      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    switch (activeTab) {
      case 'sentiment':
        return <SentimentResult data={result} />;
      case 'keywords':
        return <KeywordsResult data={result} />;
      case 'summarize':
        return <SummarizeResult data={result} />;
      case 'hash':
        return <HashResult data={result} />;
      default:
        return <GenericResult data={result} />;
    }
  };

  return (
    <section id="lab" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/30 dark:via-purple-950/5 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10" ref={ref}>
        <SectionReveal>
          <div className="text-center mb-20">
            <motion.p
              className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400 font-semibold mb-4"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={isInView ? { opacity: 1, letterSpacing: '0.3em' } : {}}
              transition={{ duration: 1 }}
            >
              Interactive Lab
            </motion.p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              Try It <span className="gradient-text">Live</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">
              Real AI inference and developer tools running on my server. Type anything and see it work.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal>
          <div className="relative">
            {/* Border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 opacity-60" />

            <div className="relative glass rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-cyan-500/10 overflow-hidden">
              {/* Terminal-style header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200/50 dark:border-slate-700/30 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    interactive-lab.api
                  </span>
                </div>
                <a
                  href={`${VM_API}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  View Full API Docs →
                </a>
              </div>

              <div className="p-6 sm:p-8">
                {/* Tab groups */}
                <div className="space-y-3 mb-6">
                  {/* AI tabs */}
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold mb-2 block">
                      AI / NLP
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tabs
                        .filter((t) => t.group === 'ai')
                        .map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                setActiveTab(tab.id);
                                setResult(null);
                                setError(null);
                                setInput('');
                              }}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                isActive
                                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/30 border border-transparent'
                              }`}
                            >
                              <Icon size={14} />
                              {tab.label}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                  {/* Tools tabs */}
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold mb-2 block">
                      Developer Tools
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tabs
                        .filter((t) => t.group === 'tools')
                        .map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                setActiveTab(tab.id);
                                setResult(null);
                                setError(null);
                                setInput('');
                              }}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                isActive
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/30 border border-transparent'
                              }`}
                            >
                              <Icon size={14} />
                              {tab.label}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {activeTabDef.description}
                </p>

                {/* Input area */}
                {activeTab !== 'headers' && (
                  <div className="space-y-3 mb-4">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={activeTabDef.placeholder || 'Enter text...'}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/30 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono"
                    />

                    {/* Extra options for hash/base64 */}
                    {activeTab === 'hash' && (
                      <div className="flex gap-2">
                        {['md5', 'sha1', 'sha256', 'sha512'].map((algo) => (
                          <button
                            key={algo}
                            onClick={() => setHashAlgo(algo)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                              hashAlgo === algo
                                ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/30'
                                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/30 border border-transparent'
                            }`}
                          >
                            {algo.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}

                    {activeTab === 'base64' && (
                      <div className="flex gap-2">
                        {(['encode', 'decode'] as const).map((action) => (
                          <button
                            key={action}
                            onClick={() => setB64Action(action)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all capitalize ${
                              b64Action === action
                                ? 'bg-purple-500/10 text-purple-500 border border-purple-500/30'
                                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/30 border border-transparent'
                            }`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Run button */}
                <motion.button
                  onClick={runQuery}
                  disabled={loading || (activeTab !== 'headers' && !input.trim())}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                  {loading ? 'Processing...' : 'Run'}
                </motion.button>

                {/* Results */}
                <AnimatePresence mode="wait">
                  {(result || error) && (
                    <motion.div
                      className="mt-6 p-5 rounded-xl bg-slate-50/80 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-700/20"
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {error ? (
                        <div className="text-sm text-red-500 dark:text-red-400">
                          <p className="font-medium mb-1">Error</p>
                          <p className="text-xs opacity-80">{error}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                            Make sure the VM API is deployed and running.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[10px] text-emerald-500 font-medium font-mono uppercase">
                              Response
                            </span>
                          </div>
                          {renderResult()}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
