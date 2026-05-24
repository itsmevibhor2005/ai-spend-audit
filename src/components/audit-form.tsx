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
import AuditLoading from "@/components/audit-loading";
import { toolsData } from "@/data/tools";
import { calculatePrice } from "@/lib/calculate-price";

interface Tool {
  tool: string;
  plan: string;
  monthlySpend: string;
  seats: string;
  useCase: string;
}

interface Lead {
  email: string;
  company: string;
  role: string;
  teamSize: string;
  website: string;
}

const defaultTool: Tool = {
  tool: "",
  plan: "",
  monthlySpend: "",
  seats: "",
  useCase: "",
};

const inputClass =
  "w-full bg-[#1a1d24] rounded-xl px-4 py-3 border border-[#2a2d36] text-zinc-100 placeholder-zinc-300 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition text-sm";

const labelClass =
  "block mb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.1em]";

const triggerClass =
  "w-full h-11 rounded-xl border border-[#2a2d36] bg-[#1a1d24] text-sm text-zinc-100 px-3 focus:ring-1 focus:ring-zinc-500";

const contentClass =
  "z-50 rounded-xl border border-[#2a2d36] bg-[#1a1d24] text-zinc-100 overflow-hidden p-1";

const itemClass =
  "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-[#252830]";

export default function AuditForm() {
  const router = useRouter();

  const [tools, setTools] = useState<Tool[]>([{ ...defaultTool }]);

  const [lead, setLead] = useState<Lead>({
    email: "",
    company: "",
    role: "",
    teamSize: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateToolFields(index: number, updates: Partial<Tool>) {
    setTools((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        ...updates,
      };
      return next;
    });
  }

  function updateTool(index: number, field: keyof Tool, value: string) {
    updateToolFields(index, {
      [field]: value,
    });
  }

  function addTool() {
    setTools((prev) => [...prev, { ...defaultTool }]);
  }

  function removeTool(index: number) {
    setTools((prev) => prev.filter((_, i) => i !== index));
  }

  function validateForm() {
    if (!lead.email.trim()) {
      alert("Please enter work email");
      return false;
    }

    for (const tool of tools) {
      if (
        !tool.tool ||
        !tool.plan ||
        Number(tool.monthlySpend) < 0 ||
        Number(tool.seats) <= 0
      ) {
        alert("Please complete all tool fields");
        return false;
      }
    }

    return true;
  }

  async function handleSubmit() {
    if (loading || isSubmitting) return;

    if (!validateForm()) return;

    try {
      setLoading(true);
      setIsSubmitting(true);

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
          lead,
          tools: cleanedTools,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/audit/${data.auditId}`);
      } else {
        alert(data.message || "Failed");
        setLoading(false);
        setIsSubmitting(false);
      }
    } catch {
      alert("Something went wrong");
      setLoading(false);
      setIsSubmitting(false);
    }
  }

  return (
    <>
    {loading && <AuditLoading />}
    <div className="mt-8 space-y-4">
      <div className="bg-[#13151b] border border-[#22252f] rounded-2xl p-4 sm:p-6 space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
          Get your audit report
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Work email"
            value={lead.email}
            onChange={(e) =>
              setLead({
                ...lead,
                email: e.target.value,
              })
            }
            className={inputClass}
          />

          <input
            placeholder="Company"
            value={lead.company}
            onChange={(e) =>
              setLead({
                ...lead,
                company: e.target.value,
              })
            }
            className={inputClass}
          />

          <input
            placeholder="Role"
            value={lead.role}
            onChange={(e) =>
              setLead({
                ...lead,
                role: e.target.value,
              })
            }
            className={inputClass}
          />

          <input
            placeholder="Team size"
            value={lead.teamSize}
            onChange={(e) =>
              setLead({
                ...lead,
                teamSize: e.target.value,
              })
            }
            className={inputClass}
          />

          <input
            type="text"
            className="hidden"
            value={lead.website}
            onChange={(e) =>
              setLead({
                ...lead,
                website: e.target.value,
              })
            }
          />
        </div>
      </div>

      {tools.map((tool, index) => (
        <div
          key={index}
          className="bg-[#13151b] border border-[#22252f] rounded-2xl overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-b border-[#22252f] bg-[#0f1117]">
            <div className="flex flex-wrap items-center gap-2">
              <Bot className="w-4 h-4 text-zinc-400" />

              <span className="text-sm font-semibold text-zinc-200">
                {tool.tool || `Tool #${index + 1}`}
              </span>

              {tool.plan && (
                <>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />

                  <span className="text-xs sm:text-sm text-zinc-500">
                    {tool.plan}
                  </span>
                </>
              )}
            </div>

            {tools.length > 1 && (
              <button
                type="button"
                onClick={() => removeTool(index)}
                className="self-start sm:self-auto text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>AI Tool</label>

              <Select
                value={tool.tool}
                onValueChange={(value) =>
                  updateToolFields(index, {
                    tool: value,
                    plan: toolsData[value as keyof typeof toolsData][0],
                    seats: "",
                    monthlySpend: "",
                  })
                }
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

            <div>
              <label className={labelClass}>Current Plan</label>

              <Select
                value={tool.plan}
                onValueChange={(value) =>
                  updateToolFields(index, {
                    plan: value,
                    seats: "",
                    monthlySpend: "",
                  })
                }
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

            <div>
              <label className={labelClass}>Number of Seats</label>

              <input
                type="number"
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
              />
            </div>

            <div>
              <label className={labelClass}>Monthly Spend</label>

              <input
                type="number"
                value={tool.monthlySpend}
                onChange={(e) =>
                  updateTool(index, "monthlySpend", e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Primary Use Case</label>

              <textarea
                rows={3}
                value={tool.useCase}
                onChange={(e) => updateTool(index, "useCase", e.target.value)}
                className={`${inputClass} min-h-[90px] resize-none`}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addTool}
        className="w-full flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white border border-dashed border-[#22252f] px-4 py-3 rounded-2xl"
      >
        <Plus className="w-4 h-4" />
        Add Another Tool
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || isSubmitting}
        className="w-full bg-white text-black py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
      >
        {loading ? (
          "Generating..."
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Run AI Spend Audit
          </>
        )}
      </button>
    </div>
    </>
  );
}
