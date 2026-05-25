import AuditForm from "@/components/audit-form";
import ScrollToFormButton from "@/components/scroll-to-form-button";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Trusted by builders using AI daily
            </p>

            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
              Cut your AI spend.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
              Instantly audit your AI subscriptions, compare plans, and discover
              savings across ChatGPT, Claude, Cursor, Gemini, Copilot, and more.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <ScrollToFormButton />

              <div className="rounded-xl border border-white/10 px-6 py-4 text-zinc-300">
                No login required
              </div>
            </div>

            {/* SOCIAL PROOF */}
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                <div className="text-2xl font-semibold text-white">20–40%</div>
                <div className="mt-2 text-sm text-zinc-400">
                  typical savings uncovered
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                <div className="text-2xl font-semibold text-white">10 sec</div>
                <div className="mt-2 text-sm text-zinc-400">
                  average audit time
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                <div className="text-2xl font-semibold text-white">
                  8+ tools
                </div>
                <div className="mt-2 text-sm text-zinc-400">
                  supported out of the box
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="audit-form" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold">Get your audit report</h2>

          <p className="mt-3 text-zinc-400">
            Enter your AI tooling stack and we’ll analyze where you’re
            overspending.
          </p>
        </div>

        <AuditForm />
      </section>
    </main>
  );
}
