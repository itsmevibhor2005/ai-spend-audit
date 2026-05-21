"use client";

import { useState } from "react";

interface Tool {
  tool: string;
  plan: string;
  monthlySpend: string;
  seats: string;
  useCase: string;
}

export default function AuditForm() {
  const [tools, setTools] = useState<Tool[]>([
    {
      tool: "",
      plan: "",
      monthlySpend: "",
      seats: "",
      useCase: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateTool(index: number, field: keyof Tool, value: string) {
    setTools((prev) => {
      const newTools = [...prev];
      newTools[index] = {
        ...newTools[index],
        [field]: value,
      };
      return newTools;
    });
  }

  function addTool() {
    setTools((prev) => [
      ...prev,
      {
        tool: "",
        plan: "",
        monthlySpend: "",
        seats: "",
        useCase: "",
      },
    ]);
  }

  function removeTool(index: number) {
    setTools((prev) => prev.filter((_, i) => i !== index));
  }

  function validateForm(): boolean {
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      if (!tool.tool.trim()) {
        alert(`Please enter tool name for Tool #${i + 1}`);
        return false;
      }
      if (!tool.plan.trim()) {
        alert(`Please enter plan name for ${tool.tool || `Tool #${i + 1}`}`);
        return false;
      }
      if (!tool.monthlySpend || Number(tool.monthlySpend) <= 0) {
        alert(
          `Please enter valid monthly spend for ${tool.tool || `Tool #${i + 1}`}`,
        );
        return false;
      }
      if (!tool.seats || Number(tool.seats) <= 0) {
        alert(
          `Please enter valid number of seats for ${tool.tool || `Tool #${i + 1}`}`,
        );
        return false;
      }
    }
    return true;
  }

  async function handleSubmit() {
    if (loading || isSubmitting) return;

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setLoading(true);

      const cleanedTools = tools.map((tool) => ({
        tool: tool.tool.trim(),
        plan: tool.plan.trim(),
        monthlySpend: Number(tool.monthlySpend),
        seats: Number(tool.seats),
        useCase: tool.useCase.trim(),
      }));

      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tools: cleanedTools,
        }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = `/audit/${data.auditId}`;
      } else {
        alert(data.message || "Failed to create audit");
        setIsSubmitting(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
      setLoading(false);
    }
  }

  return (
    <form className="mt-10 space-y-6">
      {tools.map((tool, index) => (
        <div
          key={index}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tool #{index + 1}</h2>

            {tools.length > 1 && (
              <button
                type="button"
                onClick={() => removeTool(index)}
                className="text-red-400 hover:text-red-300 transition text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-400">AI Tool</label>
            <input
              type="text"
              placeholder="e.g., Cursor, ChatGPT, Claude"
              value={tool.tool}
              onChange={(e) => updateTool(index, "tool", e.target.value)}
              className="w-full bg-zinc-800 rounded-xl p-3 border border-zinc-700 outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-400">
              Current Plan
            </label>
            <input
              type="text"
              placeholder="e.g., Pro, Business, Team"
              value={tool.plan}
              onChange={(e) => updateTool(index, "plan", e.target.value)}
              className="w-full bg-zinc-800 rounded-xl p-3 border border-zinc-700 outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-400">
              Monthly Spend ($)
            </label>
            <input
              type="number"
              placeholder="100"
              value={tool.monthlySpend}
              onChange={(e) =>
                updateTool(index, "monthlySpend", e.target.value)
              }
              className="w-full bg-zinc-800 rounded-xl p-3 border border-zinc-700 outline-none focus:border-white focus:ring-1 focus:ring-white"
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-400">
              Number of Seats
            </label>
            <input
              type="number"
              placeholder="5"
              value={tool.seats}
              onChange={(e) => updateTool(index, "seats", e.target.value)}
              className="w-full bg-zinc-800 rounded-xl p-3 border border-zinc-700 outline-none focus:border-white focus:ring-1 focus:ring-white"
              min="1"
              step="1"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-400">
              Primary Use Case (Optional)
            </label>
            <textarea
              placeholder="e.g., Coding assistant, Content writing, Research"
              value={tool.useCase}
              onChange={(e) => updateTool(index, "useCase", e.target.value)}
              className="w-full bg-zinc-800 rounded-xl p-3 border border-zinc-700 outline-none focus:border-white focus:ring-1 focus:ring-white min-h-[100px]"
              rows={3}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addTool}
        className="bg-zinc-800 hover:bg-zinc-700 transition px-5 py-3 rounded-xl"
      >
        + Add Another Tool
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || isSubmitting}
        className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading || isSubmitting ? "Generating Audit..." : "Run AI Spend Audit"}
      </button>
    </form>
  );
}
