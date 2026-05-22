"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Sparkles, ChevronRight, Bot } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toolsData } from "@/data/tools";
import { calculatePrice } from "@/lib/calculate-price";

interface Tool {
  tool: string;
  plan: string;
  monthlySpend: string;
  seats: string;
  useCase: string;
}

const defaultTool: Tool = {
  tool: "",
  plan: "",
  monthlySpend: "",
  seats: "",
  useCase: "",
};

const inputClass =
  "w-full bg-[#1a1d24] rounded-xl px-4 py-3 border border-[#2a2d36] text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition text-sm";

const labelClass =
  "block mb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.1em]";

// Shared classes injected into shadcn Select primitives to force dark theme
const triggerClass =
  "w-full h-11 rounded-xl border border-[#2a2d36] bg-[#1a1d24] text-sm text-zinc-100 px-3 focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 data-[placeholder]:text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed";

const contentClass =
  "z-50 rounded-xl border border-[#2a2d36] bg-[#1a1d24] shadow-2xl shadow-black/60 text-zinc-100 overflow-hidden p-1";

const itemClass =
  "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm text-zinc-300 outline-none transition-colors hover:bg-[#252830] hover:text-white focus:bg-[#FFFFFF] focus:text-black data-[state=checked]:bg-[#FFFFFF] data-[state=checked]:text-black data-[disabled]:pointer-events-none data-[disabled]:opacity-40";

export default function AuditForm() {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([{ ...defaultTool }]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateToolFields(index: number, updates: Partial<Tool>) {
    setTools((prev) => {
      const newTools = [...prev];
      newTools[index] = { ...newTools[index], ...updates };
      return newTools;
    });
  }

  function updateTool(index: number, field: keyof Tool, value: string) {
    updateToolFields(index, { [field]: value });
  }

  function addTool() {
    setTools((prev) => [...prev, { ...defaultTool }]);
  }

  function removeTool(index: number) {
    setTools((prev) => prev.filter((_, i) => i !== index));
  }

  function validateForm(): boolean {
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      if (!tool.tool.trim()) {
        alert(`Please select a tool for Tool #${i + 1}`);
        return false;
      }
      if (!tool.plan.trim()) {
        alert(`Please select a plan for ${tool.tool || `Tool #${i + 1}`}`);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: cleanedTools }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/audit/${data.auditId}`);
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
    <div className="mt-10 space-y-4">
      {tools.map((tool, index) => (
        <div
          key={index}
          className="bg-[#13151b] border border-[#22252f] rounded-2xl overflow-hidden transition-colors hover:border-[#2e3140]"
        >
          {/* ── Card header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#22252f] bg-[#0f1117]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#1e2028] border border-[#2a2d36] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-200">
                {tool.tool || `Tool #${index + 1}`}
              </span>
              {tool.plan && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-shadow-zinc-300" />
                  <span className="text-sm text-zinc-500">{tool.plan}</span>
                </>
              )}
            </div>

            {tools.length > 1 && (
              <button
                type="button"
                onClick={() => removeTool(index)}
                className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-400 transition px-2.5 py-1.5 rounded-lg hover:bg-red-500/8"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>

          {/* ── Card body ── */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* AI Tool */}
            <div>
              <label className={labelClass}>AI Tool</label>
              <Select
                value={tool.tool}
                onValueChange={(value) => {
                  updateToolFields(index, {
                    tool: value,
                    plan: toolsData[value as keyof typeof toolsData][0],
                    seats: "",
                    monthlySpend: "",
                  });
                }}
              >
                <SelectTrigger className={triggerClass}>
                  <SelectValue placeholder="Select AI Tool" />
                </SelectTrigger>
                <SelectContent className={contentClass}>
                  {Object.keys(toolsData).map((toolName) => (
                    <SelectItem
                      key={toolName}
                      value={toolName}
                      className={itemClass}
                    >
                      {toolName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current Plan */}
            <div>
              <label className={labelClass}>Current Plan</label>
              <Select
                value={tool.plan}
                onValueChange={(value) => {
                  updateToolFields(index, {
                    plan: value,
                    seats: "",
                    monthlySpend: "",
                  });
                }}
                disabled={!tool.tool}
              >
                <SelectTrigger className={triggerClass}>
                  <SelectValue placeholder="Select Plan" />
                </SelectTrigger>
                <SelectContent className={contentClass}>
                  {tool.tool &&
                    toolsData[tool.tool as keyof typeof toolsData]?.map(
                      (plan) => (
                        <SelectItem
                          key={plan}
                          value={plan}
                          className={itemClass}
                        >
                          {plan}
                        </SelectItem>
                      ),
                    )}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Seats */}
            <div>
              <label className={labelClass}>Number of Seats</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={tool.seats}
                onChange={(e) => {
                  const seats = e.target.value;
                  const price = calculatePrice(
                    tool.tool,
                    tool.plan,
                    Number(seats),
                  );
                  updateToolFields(index, {
                    seats,
                    monthlySpend: String(price),
                  });
                }}
                className={inputClass}
                min="1"
                step="1"
              />
            </div>

            {/* Monthly Spend */}
            <div>
              <label className={labelClass}>Monthly Spend (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  placeholder="100"
                  value={tool.monthlySpend}
                  onChange={(e) =>
                    updateTool(index, "monthlySpend", e.target.value)
                  }
                  className={`${inputClass} pl-7`}
                />
              </div>
            </div>

            {/* Use Case — full width */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                Primary Use Case{" "}
                <span className="text-zinc-700 normal-case tracking-normal font-normal">
                  (optional)
                </span>
              </label>
              <textarea
                placeholder="e.g. Coding assistant for 3 engineers, content writing for marketing team…"
                value={tool.useCase}
                onChange={(e) => updateTool(index, "useCase", e.target.value)}
                className={`${inputClass} min-h-[80px] resize-none`}
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add tool */}
      <button
        type="button"
        onClick={addTool}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 border border-dashed border-[#22252f] hover:border-[#3a3d4a] transition px-5 py-3.5 rounded-2xl w-full justify-center hover:bg-[#13151b]"
      >
        <Plus className="w-4 h-4" />
        Add Another Tool
      </button>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || isSubmitting}
        className="w-full bg-white text-[#0f1117] py-4 rounded-2xl font-semibold text-base hover:bg-zinc-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group mt-2"
      >
        {loading || isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            Generating your audit…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 opacity-60 group-hover:opacity-100 transition" />
            Run AI Spend Audit
          </>
        )}
      </button>
    </div>
  );
}
