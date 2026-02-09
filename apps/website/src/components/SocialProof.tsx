export default function SocialProof() {
  const metrics = [
    { value: "15+", label: "AI implementations" },
    { value: "100%", label: "Project success" },
    { value: "10+", label: "Years experience" },
    { value: "67%", label: "Reduction in Overhead" },
    { value: "5x", label: "Faster Deployment" },
  ];

  return (
    <section className="px-6 py-16 md:py-20" id="social-proof">
      <div className="container mx-auto max-w-6xl">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/65 md:p-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-5 text-center transition-transform duration-200 hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-1 text-3xl font-medium text-black dark:text-white md:text-4xl">{metric.value}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
