'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Activity,
  Server,
  Clock,
  RefreshCw,
} from 'lucide-react';
import SectionReveal from './SectionReveal';

const VM_API = process.env.NEXT_PUBLIC_VM_API_URL || 'https://api.manpreetsingh.co.in';

interface SystemMetrics {
  cpu: { percent: number; cores: number; freq_mhz: number | null };
  memory: { total_gb: number; used_gb: number; percent: number };
  disk: { total_gb: number; used_gb: number; percent: number };
  network: { bytes_sent_mb: number; bytes_recv_mb: number };
  uptime_seconds: number;
  load_average: { '1m': number; '5m': number; '15m': number };
  platform: string;
  hostname: string;
  timestamp: string;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/* ── Gauge Ring ── */
function GaugeRing({
  value,
  label,
  icon: Icon,
  detail,
  color = 'cyan',
}: {
  value: number;
  label: string;
  icon: React.ElementType;
  detail: string;
  color?: 'cyan' | 'blue' | 'purple' | 'emerald';
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const colorMap = {
    cyan: { stroke: '#06b6d4', bg: 'rgba(6,182,212,0.1)', text: 'text-cyan-400' },
    blue: { stroke: '#3b82f6', bg: 'rgba(59,130,246,0.1)', text: 'text-blue-400' },
    purple: { stroke: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', text: 'text-purple-400' },
    emerald: { stroke: '#10b981', bg: 'rgba(16,185,129,0.1)', text: 'text-emerald-400' },
  };
  const c = colorMap[color];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          {/* Background ring */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Value ring */}
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={14} className={c.text} />
          <motion.span
            className={`text-lg font-bold ${c.text} tabular-nums`}
            key={value}
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(value)}%
          </motion.span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{detail}</p>
      </div>
    </div>
  );
}

/* ── Stat Pill ── */
function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100/60 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/20">
      <Icon size={13} className="text-cyan-500 shrink-0" />
      <span className="text-[10px] text-slate-400 dark:text-slate-500">{label}</span>
      <span className="text-[11px] text-slate-700 dark:text-slate-300 font-mono font-medium ml-auto">
        {value}
      </span>
    </div>
  );
}

export default function LiveInfra() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch(`${VM_API}/api/v1/system/metrics`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMetrics(data);
      setError(false);
      setLastFetch(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return (
    <section id="infrastructure" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-cyan-950/5 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 relative z-10" ref={ref}>
        <SectionReveal>
          <div className="text-center mb-20">
            <motion.p
              className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400 font-semibold mb-4"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={isInView ? { opacity: 1, letterSpacing: '0.3em' } : {}}
              transition={{ duration: 1 }}
            >
              Live Infrastructure
            </motion.p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              Real-Time <span className="gradient-text">Server</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">
              Live metrics from my personal Ubuntu VM — not mock data, real infrastructure I manage.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal>
          <div className="relative">
            {/* Gradient border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-60" />

            <div className="relative glass rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-cyan-500/10 overflow-hidden">
              {/* Status bar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200/50 dark:border-slate-700/30 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {metrics?.hostname || 'ubuntu-s-2vcpu-4gb-blr1-01'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {!error && (
                    <motion.div
                      className="flex items-center gap-1.5"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-emerald-500 font-medium">LIVE</span>
                    </motion.div>
                  )}
                  <button
                    onClick={fetchMetrics}
                    className="p-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/30 transition-colors"
                    aria-label="Refresh metrics"
                  >
                    <RefreshCw
                      size={12}
                      className={`text-slate-400 ${loading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-8">
                {error && !metrics ? (
                  /* Error state */
                  <div className="text-center py-12">
                    <Server size={40} className="text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      Unable to reach server
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                      VM may be offline or the API isn&apos;t deployed yet.
                    </p>
                    <button
                      onClick={fetchMetrics}
                      className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
                    >
                      Try again →
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Gauge rings */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                      <GaugeRing
                        value={metrics?.cpu.percent ?? 0}
                        label="CPU"
                        icon={Cpu}
                        detail={`${metrics?.cpu.cores ?? 2} cores`}
                        color="cyan"
                      />
                      <GaugeRing
                        value={metrics?.memory.percent ?? 0}
                        label="Memory"
                        icon={MemoryStick}
                        detail={`${metrics?.memory.used_gb ?? 0}/${metrics?.memory.total_gb ?? 4} GB`}
                        color="blue"
                      />
                      <GaugeRing
                        value={metrics?.disk.percent ?? 0}
                        label="Disk"
                        icon={HardDrive}
                        detail={`${metrics?.disk.used_gb ?? 0}/${metrics?.disk.total_gb ?? 80} GB`}
                        color="purple"
                      />
                      <GaugeRing
                        value={
                          metrics
                            ? Math.min(
                                ((metrics.load_average['1m'] / metrics.cpu.cores) * 100),
                                100
                              )
                            : 0
                        }
                        label="Load"
                        icon={Activity}
                        detail={`${metrics?.load_average['1m'] ?? 0} avg`}
                        color="emerald"
                      />
                    </div>

                    {/* Stats grid */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <StatPill
                        icon={Clock}
                        label="Uptime"
                        value={metrics ? formatUptime(metrics.uptime_seconds) : '—'}
                      />
                      <StatPill
                        icon={Wifi}
                        label="Network ↑↓"
                        value={
                          metrics
                            ? `${metrics.network.bytes_sent_mb} / ${metrics.network.bytes_recv_mb} MB`
                            : '—'
                        }
                      />
                      <StatPill
                        icon={Server}
                        label="Platform"
                        value={metrics?.platform?.split('-').slice(0, 2).join('-') ?? '—'}
                      />
                      <StatPill
                        icon={Activity}
                        label="Load (1/5/15m)"
                        value={
                          metrics
                            ? `${metrics.load_average['1m']} / ${metrics.load_average['5m']} / ${metrics.load_average['15m']}`
                            : '—'
                        }
                      />
                    </div>

                    {/* Last updated */}
                    {lastFetch && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-6 font-mono">
                        Last updated: {lastFetch.toLocaleTimeString()} · Auto-refreshes every 10s
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
