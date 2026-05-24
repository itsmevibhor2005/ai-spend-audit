"use client";

import {
  Loader2,
  Sparkles,
  TrendingDown,
  Bot,
} from "lucide-react";

export default function AuditLoading() {
  const steps = [
    {
      icon: Bot,
      label:
        "Analyzing your AI stack",
    },
    {
      icon: TrendingDown,
      label:
        "Finding lower-cost alternatives",
    },
    {
      icon: Sparkles,
      label:
        "Generating recommendations",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl">

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-6">
            Generating your audit
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-md leading-relaxed">
            Reviewing pricing,
            comparing plans, and
            building your
            personalized AI spend
            report.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {steps.map(
            (
              step,
              index
            ) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-zinc-800/60 border border-zinc-700/50 rounded-2xl px-4 py-4"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-zinc-300" />
                </div>

                <div className="flex-1">
                  <p className="text-sm sm:text-base text-zinc-200 font-medium">
                    {step.label}
                  </p>
                </div>

                <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
              </div>
            )
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">
            usually takes 2–5 seconds
          </p>
        </div>
      </div>
    </div>
  );
}