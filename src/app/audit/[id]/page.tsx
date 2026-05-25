import { adminDb } from "@/lib/firebase-admin";
import { getSeverity } from "@/lib/get-severity";
import SavingsChart from "@/components/savings-charts";
import { getBenchmark } from "@/lib/benchmark";
import PdfButton from "@/components/pdf-button";
import {
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowRight,
  Zap,
} from "lucide-react";
import ShareButton from "@/components/share-button";
import { Recommendation } from "@/types/audit";

type AuditDoc = {
  totalSavings: number;
  aiSummary: string;
  recommendations: Recommendation[];
  lead?: {
    company?: string;
    teamSize?: string | number;
  };
};

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  const doc = await adminDb.collection("audits").doc(id).get();

 const data = doc.data() as AuditDoc | undefined;

  return {
    title: `Save $${data?.totalSavings || 0}/month on AI tools`,
    description: "AI spend optimization report",
  };
}

export default async function AuditPage({ params }: Props) {
  const { id } = await params;

  const doc = await adminDb.collection("audits").doc(id).get();

  const data = doc.data();

  if (!data) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
            <Zap className="w-7 h-7 text-zinc-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-200">
            Audit not found
          </h1>

          <p className="text-zinc-500 text-sm">This audit may have expired.</p>
        </div>
      </main>
    );
  }

  const totalCurrentSpend = data.recommendations.reduce(
    (acc: number, rec: Recommendation) => acc + rec.currentCost,
    0,
  );

  const totalOptimizedSpend = data.recommendations.reduce(
    (acc: number, rec: Recommendation) => acc + rec.optimizedCost,
    0,
  );

  const savingsPct =
    totalCurrentSpend > 0
      ? Math.round((data.totalSavings / totalCurrentSpend) * 100)
      : 0;

  const benchmark = getBenchmark(
    totalCurrentSpend,
    Number(data.lead?.teamSize || 1),
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div
        id="audit-report"
        className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-zinc-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI Spend Optimization Report
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold mt-5 leading-tight">
              {data.lead?.company
                ? `${data.lead.company} AI Stack`
                : "Your AI Stack"}

              <br />

              <span className="text-zinc-500">Audit Results</span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base mt-5 max-w-xl leading-relaxed">
              We analyzed{" "}
              <span className="text-white font-medium">
                {data.lead?.company || "your company"}
              </span>{" "}
              and found{" "}
              <span className="text-white font-medium">
                {data.recommendations.length} optimization
              </span>{" "}
              opportunities to reduce monthly AI spend.
            </p>
          </div>

          <div className="w-full lg:w-70 bg-emerald-500/[0.07] border border-emerald-500/20 rounded-3xl p-5 sm:p-7 text-center lg:text-left">
            <p className="text-zinc-500 text-xs uppercase">Estimated Savings</p>

            <h2 className="text-4xl sm:text-5xl font-bold text-emerald-400 mt-3">
              ${data.totalSavings.toLocaleString()}
            </h2>

            <p className="text-zinc-600 text-sm mt-2">
              per month · {savingsPct}%
            </p>

            <div className="mt-5 pt-5 border-t border-emerald-500/10">
              <p className="text-xs text-zinc-600 uppercase">Annual impact</p>

              <p className="text-lg sm:text-xl font-bold text-emerald-300 mt-1">
                ${(data.totalSavings * 12).toLocaleString()}
              </p>
            </div>

            <div className="mt-5 flex flex-col items-center justify-center lg:justify-start gap-4">
              <ShareButton />
              <PdfButton />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
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
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3">
                <stat.icon className="w-4 h-4 text-zinc-400" />

                <p className="text-zinc-500 text-xs uppercase">{stat.label}</p>
              </div>

              <h3 className={`text-2xl font-bold mt-3 ${stat.color}`}>
                {stat.value}
              </h3>

              <p className="text-zinc-600 text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-4 sm:p-7">
          <h2 className="text-lg sm:text-xl font-bold">Spend Comparison</h2>

          <p className="text-zinc-500 text-sm mt-1 mb-6">
            Current vs optimized
          </p>

          <SavingsChart
            current={totalCurrentSpend}
            optimized={totalOptimizedSpend}
          />
        </div>
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7">
          <h2 className="text-xl font-semibold">Benchmark Mode</h2>

          <p className="text-zinc-500 text-sm mt-2">
            Compare against similar teams
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 text-xs uppercase">
                Your Spend / Dev
              </p>

              <h3 className="text-2xl font-semibold mt-2">
                ${benchmark.perDev}
              </h3>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 text-xs uppercase">Average</p>

              <h3 className="text-2xl font-semibold mt-2">
                ${benchmark.average}
              </h3>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 text-xs uppercase">Difference</p>

              <h3
                className={`text-xl sm:text-2xl font-semibold mt-2 ${
                  benchmark.diffPct > 0 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {benchmark.label}
              </h3>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold">AI Summary</h2>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mt-5 whitespace-pre-line">
            {data.aiSummary}
          </p>
        </div>

        {data.totalSavings >= 500 && (
          <div className="mt-10 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold">
              High Savings Opportunity
            </h2>

            <p className="text-zinc-300 mt-4 text-sm sm:text-base leading-relaxed">
              Credex can help unlock discounted pricing and deeper optimization.
            </p>

            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noreferrer"
              className="block sm:inline-block text-center mt-6 bg-emerald-500 text-black px-5 py-3 rounded-2xl font-semibold"
            >
              Book Credex Consultation
            </a>
          </div>
        )}

        <div className="mt-10 space-y-5">
          {data.recommendations.map((rec: Recommendation, index: number) => {
            const severity = getSeverity(rec.savings);

            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">{rec.tool}</h3>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <span className="bg-zinc-800 px-2 py-1 rounded-md">
                        {rec.currentPlan}
                      </span>

                      <ArrowRight className="w-3 h-3 text-zinc-500" />

                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md">
                        {rec.recommendedPlan}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className={`inline-flex items-center justify-center min-h-8.5 px-4 py-2 rounded-full border text-xs font-medium leading-none whitespace-nowrap ${severity.color}`}
                    >
                      {severity.label}
                    </div>

                    <div className="inline-flex items-center justify-center min-h-8.5 px-4 py-2 rounded-full text-xs font-medium leading-none whitespace-nowrap bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Save ${rec.savings.toLocaleString()}
                      /mo
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div className="bg-zinc-800 rounded-xl p-4">
                    <p className="text-zinc-500 text-xs uppercase">
                      Current Cost
                    </p>

                    <h4 className="text-xl font-bold mt-2">
                      ${rec.currentCost.toLocaleString()}
                    </h4>
                  </div>

                  <div className="bg-zinc-800 rounded-xl p-4">
                    <p className="text-zinc-500 text-xs uppercase">
                      Optimized Cost
                    </p>

                    <h4 className="text-xl font-bold mt-2 text-emerald-400">
                      ${rec.optimizedCost.toLocaleString()}
                    </h4>
                  </div>
                </div>

                <div className="mt-4 bg-zinc-800 rounded-xl p-4">
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
