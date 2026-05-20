import AuditForm from "@/components/audit-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-black to-zinc-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-6xl font-bold">AI Spend Audit</h1>

        <p className="text-zinc-400 text-xl mt-6">
          Discover AI overspending in minutes.
        </p>

        <AuditForm />
      </div>
    </main>
  );
}
