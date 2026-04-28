import type { Metadata } from 'next';
import { Download, ExternalLink, House } from 'lucide-react';

const resumePath = '/Manpreet%20Singh.pdf';

export const metadata: Metadata = {
  title: 'Resume | Manpreet Singh',
  description: 'View or download the resume of Manpreet Singh.',
};

export default function MyResumePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
              Resume
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">Manpreet Singh</h1>
          </div>

          <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="/"
              aria-label="Go to home page"
              title="Home"
              className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors text-center flex items-center justify-center"
            >
              <House size={18} />
            </a>
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open resume in new tab"
              title="Open in New Tab"
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-center flex items-center justify-center"
            >
              <ExternalLink size={18} />
            </a>
            <a
              href={resumePath}
              download
              aria-label="Download resume PDF"
              title="Download PDF"
              className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors text-center flex items-center justify-center"
            >
              <Download size={18} />
            </a>
          </div>
        </header>

        <section className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <object
            data={resumePath}
            type="application/pdf"
            aria-label="Manpreet Singh Resume"
            className="w-full h-[68vh] sm:h-[78vh] lg:h-[82vh]"
          >
            <div className="h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Inline PDF preview is not available in this browser.
              </p>
            </div>
          </object>
        </section>
      </div>
    </main>
  );
}