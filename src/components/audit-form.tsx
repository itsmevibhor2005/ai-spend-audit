"use client";

import { useState } from "react";

export default function AuditForm() {
  const [company, setCompany] = useState("");
  const [tool, setTool] = useState("");
  const [monthlySpend, setMonthlySpend] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        tool,
        monthlySpend,
      }),
    });

    const data = await res.json();

    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-zinc-900 p-6 rounded-2xl mt-10"
    >
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company Name"
        className="w-full p-3 rounded-lg bg-zinc-800"
      />

      <input
        value={tool}
        onChange={(e) => setTool(e.target.value)}
        placeholder="AI Tool Used"
        className="w-full p-3 rounded-lg bg-zinc-800"
      />

      <input
        value={monthlySpend}
        onChange={(e) => setMonthlySpend(e.target.value)}
        placeholder="Monthly Spend ($)"
        className="w-full p-3 rounded-lg bg-zinc-800"
      />

      <button
        type="submit"
        className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
      >
        Run Audit
      </button>
    </form>
  );
}
