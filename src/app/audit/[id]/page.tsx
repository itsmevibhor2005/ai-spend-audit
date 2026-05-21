import { adminDb } from "@/lib/firebase-admin";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function AuditPage({ params }: Props) {
  const { id } = await params;

  const doc = await adminDb.collection("audits").doc(id).get();

  const data = doc.data();

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-3xl font-bold">Audit not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold">Audit Results</h1>

        <div className="mt-8 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-semibold">Estimated Monthly Savings</h2>

          <p className="text-5xl font-bold mt-4 text-green-400">
            ${data.totalSavings}
          </p>

          <p className="text-zinc-500 mt-2">
            Estimated yearly savings: ${data.totalSavings * 12}
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {data.recommendations.map((rec: any, index: number) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{rec.tool}</h3>

                <div className="text-green-400 font-semibold">
                  Save ${rec.savings}/mo
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-zinc-400">
                  Current Plan:
                  <span className="text-white ml-2">{rec.currentPlan}</span>
                </p>

                <p className="text-zinc-400">
                  Recommended Plan:
                  <span className="text-white ml-2">{rec.recommendedPlan}</span>
                </p>

                <p className="text-zinc-400">
                  Current Cost:
                  <span className="text-white ml-2">${rec.currentCost}</span>
                </p>

                <p className="text-zinc-400">
                  Optimized Cost:
                  <span className="text-white ml-2">${rec.optimizedCost}</span>
                </p>
              </div>

              <div className="mt-5 bg-zinc-800 p-4 rounded-xl">
                <p className="text-zinc-300">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
