import { adminDb } from "@/lib/firebase-admin";
import { getSeverity } from "@/lib/get-severity";
import SavingsChart from "@/components/savings-charts";
import {
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowRight,
  Zap,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AuditPage({ params }: Props) {
  const { id } = await params;

  const doc = await adminDb.collection("audits").doc(id).get();
  const data = doc.data();

  if (!data) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
            <Zap className="w-7 h-7 text-zinc-600" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-200">Audit not found</h1>
          <p className="text-zinc-500 text-sm">
            This audit may have expired or never existed.
          </p>
        </div>
      </main>
    );
  }

  const totalCurrentSpend = data.recommendations.reduce(
    (acc: number, rec: any) => acc + rec.currentCost,
    0,
  );

  const totalOptimizedSpend = data.recommendations.reduce(
    (acc: number, rec: any) => acc + rec.optimizedCost,
    0,
  );

  const savingsPct =
    totalCurrentSpend > 0
      ? Math.round((data.totalSavings / totalCurrentSpend) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-5 py-14">
        {/* ── HERO ─────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-400 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI Spend Optimization Report
            </div>

            <h1 className="text-5xl font-bold mt-6 leading-[1.1] tracking-tight">
              Your AI Stack
              <br />
              <span className="text-zinc-500">Audit Results</span>
            </h1>

            <p className="text-zinc-400 text-base mt-5 max-w-lg leading-relaxed">
              We analyzed your AI tool subscriptions and found{" "}
              <span className="text-white font-medium">
                {data.recommendations.length} optimization
              </span>{" "}
              {data.recommendations.length === 1
                ? "opportunity"
                : "opportunities"}{" "}
              to reduce your monthly spend.
            </p>
          </div>

          {/* Savings callout */}
          <div className="bg-emerald-500/[0.07] border border-emerald-500/20 rounded-3xl p-7 min-w-[220px] text-center lg:text-left">
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">
              Estimated Savings
            </p>
            <h2 className="text-5xl font-bold text-emerald-400 mt-3 tracking-tight">
              ${data.totalSavings.toLocaleString()}
            </h2>
            <p className="text-zinc-600 text-sm mt-1.5">
              per month · {savingsPct}% reduction
            </p>
            <div className="mt-5 pt-5 border-t border-emerald-500/10">
              <p className="text-xs text-zinc-600 uppercase tracking-widest">
                Annual impact
              </p>
              <p className="text-xl font-bold text-emerald-300 mt-1">
                ${(data.totalSavings * 12).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ── STATS ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          {[
            {
              icon: DollarSign,
              label: "Current Spend",
              value: `$${totalCurrentSpend.toLocaleString()}`,
              sub: "per month",
              color: "text-white",
            },
            {
              icon: TrendingDown,
              label: "Optimized Spend",
              value: `$${totalOptimizedSpend.toLocaleString()}`,
              sub: "per month",
              color: "text-emerald-400",
            },
            {
              icon: Calendar,
              label: "Annual Savings",
              value: `$${(data.totalSavings * 12).toLocaleString()}`,
              sub: "per year",
              color: "text-emerald-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5">
                <stat.icon className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">
                  {stat.label}
                </p>
                <h3
                  className={`text-2xl font-bold mt-1.5 tracking-tight ${stat.color}`}
                >
                  {stat.value}
                </h3>
                <p className="text-zinc-600 text-xs mt-0.5">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CHART ────────────────────────────── */}
        <div className="mt-8 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Spend Comparison
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                Current vs optimized monthly spend
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              Save ${data.totalSavings.toLocaleString()}/month
            </div>
          </div>

          <SavingsChart
            current={totalCurrentSpend}
            optimized={totalOptimizedSpend}
          />
        </div>

        {/* ── RECOMMENDATIONS ──────────────────── */}
        <div className="mt-12">
          <div className="mb-7">
            <h2 className="text-3xl font-bold tracking-tight">
              Recommendations
            </h2>
            <p className="text-zinc-500 text-sm mt-2">
              Personalized optimization suggestions based on your current stack
            </p>
          </div>

          <div className="space-y-5">
            {data.recommendations.map((rec: any, index: number) => {
              const severity = getSeverity(rec.savings);

              return (
                <div
                  key={index}
                  className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-zinc-700/80 transition"
                >
                  {/* Card header */}
                  <div className="px-7 pt-7 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">
                        {rec.tool}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
                        <span className="bg-zinc-800 border border-zinc-700/60 px-2.5 py-0.5 rounded-md text-zinc-400 text-xs font-medium">
                          {rec.currentPlan}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md text-emerald-400 text-xs font-medium">
                          {rec.recommendedPlan}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <div
                        className={`px-3 py-1 rounded-full border text-xs font-semibold ${severity.color}`}
                      >
                        {severity.label}
                      </div>
                      <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                        Save ${rec.savings.toLocaleString()}/mo
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-zinc-800/80 mx-7" />

                  {/* Cost grid */}
                  <div className="grid grid-cols-2 gap-px bg-zinc-800/40 mx-7 mt-5 rounded-xl overflow-hidden border border-zinc-800/60">
                    <div className="bg-zinc-900 p-5">
                      <p className="text-zinc-600 text-xs uppercase tracking-widest font-medium">
                        Current Cost
                      </p>
                      <h4 className="text-2xl font-bold mt-2 tracking-tight">
                        ${rec.currentCost.toLocaleString()}
                      </h4>
                      <p className="text-zinc-600 text-xs mt-0.5">per month</p>
                    </div>
                    <div className="bg-zinc-900 p-5">
                      <p className="text-zinc-600 text-xs uppercase tracking-widest font-medium">
                        Optimized Cost
                      </p>
                      <h4 className="text-2xl font-bold mt-2 tracking-tight text-emerald-400">
                        ${rec.optimizedCost.toLocaleString()}
                      </h4>
                      <p className="text-zinc-600 text-xs mt-0.5">per month</p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mx-7 mt-4 mb-7 bg-zinc-800/40 border border-zinc-800/60 rounded-xl p-5">
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
