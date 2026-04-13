import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type DiagramTone = 'source' | 'processing' | 'model' | 'decision' | 'outcome';

export interface DiagramStep {
  id: string;
  title: string;
  summary: string;
  detail?: string;
  tag?: string;
  metric?: string;
  tone?: string;
}

interface InteractiveCaseStudyDiagramProps {
  title: string;
  subtitle?: string;
  steps: DiagramStep[];
  autoplayMs?: number;
}

const toneStyles: Record<
  DiagramTone,
  {
    activeBorder: string;
    activeDot: string;
    badge: string;
  }
> = {
  source: {
    activeBorder: 'border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-900/60',
    activeDot: 'bg-stone-500',
    badge: 'bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-300',
  },
  processing: {
    activeBorder: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30',
    activeDot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  model: {
    activeBorder: 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70',
    activeDot: 'bg-slate-600',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  },
  decision: {
    activeBorder: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
    activeDot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  outcome: {
    activeBorder: 'border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30',
    activeDot: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  },
};

const inactiveStyles =
  'border-stone-200/80 bg-white/70 hover:border-stone-300 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700';

function resolveTone(tone?: string): DiagramTone {
  if (tone && tone in toneStyles) {
    return tone as DiagramTone;
  }
  return 'processing';
}

export default function InteractiveCaseStudyDiagram({
  title,
  subtitle,
  steps,
  autoplayMs = 3600,
}: InteractiveCaseStudyDiagramProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(steps.length > 1);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(steps.length - 1, 0)));
    setAutoplay(steps.length > 1);
  }, [steps.length]);

  useEffect(() => {
    if (!autoplay || steps.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % steps.length);
    }, autoplayMs);

    return () => window.clearInterval(timer);
  }, [autoplay, autoplayMs, steps.length]);

  if (steps.length === 0) {
    return null;
  }

  const activeStep = steps[activeIndex];
  const activeTone = resolveTone(activeStep.tone);
  const activeToneStyle = toneStyles[activeTone];

  return (
    <section className="mt-2 rounded-[1.75rem] border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-slate-400">
            Workflow View
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          ) : null}
        </div>
        {steps.length > 1 ? (
          <button
            type="button"
            onClick={() => setAutoplay((current) => !current)}
            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {autoplay ? 'Pause autoplay' : 'Resume autoplay'}
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <ol className="rounded-[1.35rem] border border-stone-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/50 md:p-5">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            const tone = resolveTone(step.tone);
            const style = toneStyles[tone];
            return (
              <li
                key={step.id}
                className={`relative pl-14 ${index === steps.length - 1 ? '' : 'pb-5 md:pb-6'}`}
              >
                {index !== steps.length - 1 ? (
                  <motion.span
                    className="absolute left-5 top-8 h-[calc(100%-0.5rem)] w-px bg-slate-300 dark:bg-slate-700"
                    animate={{ opacity: isActive ? 1 : 0.35 }}
                    transition={{ duration: 0.25 }}
                  />
                ) : null}
                <button
                  type="button"
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => {
                    setActiveIndex(index);
                    setAutoplay(false);
                  }}
                  onFocus={() => setActiveIndex(index)}
                  className={`w-full rounded-xl border p-3 text-left transition-all duration-200 ${
                    isActive ? style.activeBorder : inactiveStyles
                  }`}
                >
                  <span
                    className={`absolute left-2 top-3.5 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white shadow-sm ${
                      isActive ? style.activeDot : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600 dark:text-slate-300 md:text-sm">
                    {step.summary}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="rounded-[1.35rem] border border-stone-200 bg-white/95 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeStep.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${activeToneStyle.badge}`}
              >
                {activeStep.tag ?? 'Pipeline Step'}
              </span>
              <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                {activeStep.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {activeStep.detail ?? activeStep.summary}
              </p>
              {activeStep.metric ? (
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Key signal: {activeStep.metric}
                </p>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
