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
    activeBorder: 'border-indigo-200 bg-indigo-50/80 dark:border-indigo-500/40 dark:bg-indigo-500/10',
    activeDot: 'bg-indigo-600 dark:bg-indigo-400',
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200',
  },
  processing: {
    activeBorder: 'border-indigo-200 bg-indigo-50/80 dark:border-indigo-500/40 dark:bg-indigo-500/10',
    activeDot: 'bg-indigo-600 dark:bg-indigo-400',
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200',
  },
  model: {
    activeBorder: 'border-indigo-200 bg-indigo-50/80 dark:border-indigo-500/40 dark:bg-indigo-500/10',
    activeDot: 'bg-indigo-600 dark:bg-indigo-400',
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200',
  },
  decision: {
    activeBorder: 'border-indigo-200 bg-indigo-50/80 dark:border-indigo-500/40 dark:bg-indigo-500/10',
    activeDot: 'bg-indigo-600 dark:bg-indigo-400',
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200',
  },
  outcome: {
    activeBorder: 'border-indigo-200 bg-indigo-50/80 dark:border-indigo-500/40 dark:bg-indigo-500/10',
    activeDot: 'bg-indigo-600 dark:bg-indigo-400',
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200',
  },
};

const inactiveStyles =
  'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700';

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
    <section className="shadow-elevation-4 mt-2 rounded-[1.25rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Workflow View
          </p>
          <h3 className="mt-1 text-xl font-medium tracking-[-0.02em] text-slate-900 dark:text-white">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          ) : null}
        </div>
        {steps.length > 1 ? (
          <button
            type="button"
            onClick={() => setAutoplay((current) => !current)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {autoplay ? 'Pause autoplay' : 'Resume autoplay'}
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <ol className="shadow-elevation-2 rounded-[1.1rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:p-5">
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
                    className="absolute left-5 top-8 h-[calc(100%-0.5rem)] w-px bg-slate-200 dark:bg-slate-700"
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
                  className={`w-full rounded-[0.95rem] border p-3 text-left transition-all duration-200 ${
                    isActive ? `${style.activeBorder} shadow-elevation-2` : `${inactiveStyles} shadow-elevation-0`
                  }`}
                >
                  <span
                    className={`absolute left-2 top-3.5 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium text-white shadow-sm ${
                      isActive ? style.activeDot : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="block text-sm font-medium text-slate-900 dark:text-white">
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

        <div className="shadow-elevation-3 rounded-[1.1rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
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
              <h4 className="mt-3 text-lg font-medium tracking-[-0.02em] text-slate-900 dark:text-white">
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
