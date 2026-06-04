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
const UPI_DEEPLINK = `upi://pay?${new URLSearchParams({
  pa: PAYTM_VPA,
  pn: PAYTM_PAYEE_LABEL,
  tn: 'Verified Paytm Merchant',
  cu: 'INR',
}).toString()}`;

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

              {/* Paytm UPI — deeplink on mobile, QR modal on desktop */}
              {isMobile ? (
                <motion.a
                  href={UPI_DEEPLINK}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 font-medium border border-slate-200 dark:border-slate-700 hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                >
                  <Smartphone size={18} />
                  <span>Pay via UPI app</span>
                </motion.a>
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
