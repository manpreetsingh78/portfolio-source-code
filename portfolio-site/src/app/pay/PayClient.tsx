'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowUpRight,
  QrCode,
  Lock,
  Sparkles,
  ArrowLeft,
  Check,
  Copy,
  Download,
  X,
  Smartphone,
} from 'lucide-react';

const RAZORPAY_HANDLE = 'manpreetsingh2250';
const RAZORPAY_URL = `https://razorpay.me/@${RAZORPAY_HANDLE}`;
const PAYEE_NAME = 'Manpreet Singh';
const PAYTM_QR_SRC = '/paytm-qr.svg';
const PAYTM_VPA = 'paytmqr5ozdut@ptys';
const PAYTM_PAYEE_LABEL = 'Paytm'; // matches what the original QR encodes

// Same payload as the decoded QR — keeps the merchant identity consistent.
const UPI_PARAMS = new URLSearchParams({
  pa: PAYTM_VPA,
  pn: PAYTM_PAYEE_LABEL,
  tn: 'Verified Paytm Merchant',
  cu: 'INR',
}).toString();

// Generic UPI intent — on Android opens the system chooser, on iOS opens
// whichever UPI app is registered as default (often unpredictable).
const UPI_DEEPLINK = `upi://pay?${UPI_PARAMS}`;

// App-specific schemes target a single app directly. If the app isn't
// installed, iOS silently no-ops and Android shows a "no app found" prompt.
const UPI_APPS = [
  {
    id: 'gpay',
    label: 'Google Pay',
    href: `tez://upi/pay?${UPI_PARAMS}`,
    bg: 'bg-white dark:bg-white',
    border: 'border-slate-200',
    text: 'text-slate-900',
    glyph: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path fill="#4285F4" d="M22.18 12.27c0-.7-.06-1.37-.18-2.02H12v3.83h5.7a4.88 4.88 0 0 1-2.12 3.2v2.66h3.43c2-1.85 3.17-4.57 3.17-7.67Z" />
        <path fill="#34A853" d="M12 22.5c2.85 0 5.25-.95 7-2.55l-3.43-2.66c-.95.64-2.16 1.02-3.57 1.02-2.74 0-5.07-1.85-5.9-4.34H2.55v2.74A10.5 10.5 0 0 0 12 22.5Z" />
        <path fill="#FBBC05" d="M6.1 13.97a6.32 6.32 0 0 1 0-3.94V7.29H2.55a10.5 10.5 0 0 0 0 9.42L6.1 13.97Z" />
        <path fill="#EA4335" d="M12 5.69c1.55 0 2.94.53 4.04 1.58l3.04-3.04A10.5 10.5 0 0 0 12 1.5c-4.1 0-7.66 2.36-9.45 5.79L6.1 10.03c.83-2.49 3.16-4.34 5.9-4.34Z" />
      </svg>
    ),
  },
  {
    id: 'phonepe',
    label: 'PhonePe',
    href: `phonepe://pay?${UPI_PARAMS}`,
    bg: 'bg-[#5F259F]',
    border: 'border-[#5F259F]',
    text: 'text-white',
    glyph: (
      <span className="w-5 h-5 rounded-full bg-white text-[#5F259F] text-[10px] font-bold flex items-center justify-center" aria-hidden="true">
        Pe
      </span>
    ),
  },
  {
    id: 'paytm',
    label: 'Paytm',
    href: `paytmmp://pay?${UPI_PARAMS}`,
    bg: 'bg-[#002970]',
    border: 'border-[#002970]',
    text: 'text-white',
    glyph: (
      <span className="w-5 h-5 rounded-md bg-[#00B9F5] text-white text-[9px] font-bold flex items-center justify-center" aria-hidden="true">
        P
      </span>
    ),
  },
] as const;

function detectMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

export default function PayClient() {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [vpaCopied, setVpaCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(detectMobile());
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(RAZORPAY_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }, []);

  const handleCopyVpa = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PAYTM_VPA);
      setVpaCopied(true);
      setTimeout(() => setVpaCopied(false), 1800);
    } catch {
      // ignore
    }
  }, []);

  return (
    <main className="min-h-screen min-h-[100dvh] bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden">
      {/* Background flourishes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/5 blur-3xl animate-float" />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-purple-500/8 to-cyan-500/5 blur-3xl animate-float"
          style={{ animationDelay: '-3s' }}
        />
      </div>

      {/* Top bar */}
      <header
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)' }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 font-semibold">
          <Lock size={12} />
          <span>Secure</span>
        </div>
      </header>

      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs sm:text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400 font-semibold mb-3"
          >
            Payment
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Pay <span className="gradient-text">Manpreet Singh</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto"
          >
            {isMobile
              ? 'Tap below to pay via Razorpay or open your UPI app directly.'
              : 'Pick your preferred method. Razorpay supports cards, UPI, and netbanking. Scan the Paytm QR with your phone for instant UPI.'}
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-2xl glass bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-cyan-500/5 overflow-hidden"
        >
          {/* Shimmer accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          <div className="p-5 sm:p-8">
            {/* Payee identity */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden ring-2 ring-cyan-500/20 shrink-0">
                <Image
                  src="/avatar.jpg"
                  alt="Manpreet Singh"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
                  Paying
                </p>
                <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
                  {PAYEE_NAME}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                  razorpay.me/@{RAZORPAY_HANDLE}
                </p>
              </div>
            </div>

            {/* Methods */}
            <div className="pt-6 space-y-3">
              {/* Razorpay primary CTA */}
              <motion.a
                href={RAZORPAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles size={18} className="relative z-10" />
                <span className="relative z-10">Pay with Razorpay</span>
                <ArrowUpRight
                  size={16}
                  className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </motion.a>

              {/* Paytm UPI — app picker on mobile, QR modal on desktop */}
              {isMobile ? (
                <div className="space-y-2.5">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium pt-1">
                    Pay with UPI
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {UPI_APPS.map((app) => (
                      <motion.a
                        key={app.id}
                        href={app.href}
                        whileTap={{ scale: 0.97 }}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border ${app.bg} ${app.border} ${app.text} font-medium text-xs transition-all hover:shadow-md hover:shadow-cyan-500/10`}
                      >
                        {app.glyph}
                        <span className="leading-none">{app.label}</span>
                      </motion.a>
                    ))}
                  </div>
                  <motion.a
                    href={UPI_DEEPLINK}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700 hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                  >
                    <Smartphone size={16} />
                    <span>Other UPI app</span>
                  </motion.a>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowQR(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 font-medium border border-slate-200 dark:border-slate-700 hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                >
                  <QrCode size={18} />
                  <span>Scan Paytm QR</span>
                </button>
              )}

              {/* Mobile fallback: copy VPA in case the deeplink doesn't open an app */}
              {isMobile && (
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-transparent text-slate-600 dark:text-slate-400 text-sm font-medium border border-slate-200 dark:border-slate-700 hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                >
                  {vpaCopied ? (
                    <>
                      <Check size={16} className="text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        UPI ID copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span className="font-mono text-xs">{PAYTM_VPA}</span>
                    </>
                  )}
                </button>
              )}

              {/* Copy Razorpay link — handy for sharing on desktop */}
              {!isMobile && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-transparent text-slate-600 dark:text-slate-400 text-sm font-medium border border-slate-200 dark:border-slate-700 hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Link copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Razorpay link
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Trust strip */}
            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-start gap-3">
              <ShieldCheck size={16} className="text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
                Payments are processed by Razorpay or your UPI app via Paytm. This
                page never sees your card or UPI credentials.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Method badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-500">
          {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Cards', 'Netbanking'].map((m) => (
            <span
              key={m}
              className="px-2.5 py-1 rounded-full bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/30"
            >
              {m}
            </span>
          ))}
        </div>
      </section>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 shadow-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowQR(false)}
                aria-label="Close QR"
                className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="p-6 pt-8">
                <div className="text-center mb-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 font-semibold">
                    Paytm UPI
                  </p>
                  <h2 className="text-lg font-bold mt-1 text-slate-900 dark:text-white">
                    Scan to Pay {PAYEE_NAME}
                  </h2>
                </div>

                <div className="relative mx-auto w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden bg-white p-5 shadow-inner ring-1 ring-slate-200">
                  <Image
                    src={PAYTM_QR_SRC}
                    alt={`Paytm UPI QR for ${PAYTM_VPA}`}
                    fill
                    sizes="280px"
                    className="object-contain p-2"
                    priority
                    unoptimized
                  />
                  {/* Center brand chip */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <span className="text-[10px] font-bold tracking-tighter text-slate-900">
                        UPI
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Scan with any UPI app (Paytm, GPay, PhonePe, BHIM).
                  </p>
                  <p className="mt-2 text-[11px] font-mono text-slate-400 dark:text-slate-500 break-all">
                    {PAYTM_VPA}
                  </p>
                </div>

                <a
                  href={PAYTM_QR_SRC}
                  download="manpreet-singh-paytm-qr.svg"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700 hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                >
                  <Download size={16} />
                  Save QR
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
