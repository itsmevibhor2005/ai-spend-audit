"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 sm:px-4 py-3 shadow-xl">
        <p className="text-zinc-400 text-[10px] sm:text-xs uppercase tracking-widest mb-1">
          {label}
        </p>

        <p className="text-white font-bold text-base sm:text-lg">
          ${payload[0].value.toLocaleString()}
          <span className="text-zinc-500 text-xs sm:text-sm font-normal">
            /mo
          </span>
        </p>
      </div>
    );
  }

  return null;
};

export default function SavingsChart({
  current,
  optimized,
}: {
  current: number;
  optimized: number;
}) {
  const savings = current - optimized;

  const savingsPct = current > 0 ? Math.round((savings / current) * 100) : 0;

  const data = [
    {
      name: "Current",
      value: current,
    },
    {
      name: "Optimized",
      value: optimized,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            label: "Current Monthly",
            value: `$${current.toLocaleString()}`,
            muted: true,
          },
          {
            label: "Optimized Monthly",
            value: `$${optimized.toLocaleString()}`,
            green: true,
          },
          {
            label: "You Save",
            value: `${savingsPct}%`,
            highlight: true,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-zinc-800/60 rounded-2xl px-4 sm:px-5 py-4 border border-zinc-700/50"
          >
            <p className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-widest">
              {s.label}
            </p>

            <p
              className={`text-xl sm:text-2xl font-bold mt-1 ${
                s.green
                  ? "text-emerald-400"
                  : s.highlight
                    ? "text-amber-400"
                    : "text-white"
              }`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="h-65 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={56} barGap={16}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#71717a",
                fontSize: 12,
                fontWeight: 500,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#52525b",
                fontSize: 11,
              }}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
              width={56}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "rgba(255,255,255,0.03)",
              }}
            />

            <Bar dataKey="value" radius={[10, 10, 4, 4]}>
              <Cell fill="#3f3f46" />
              <Cell fill="#10b981" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Current spend</span>

            <span>${current.toLocaleString()}</span>
          </div>

          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-500 rounded-full w-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Optimized spend</span>

            <span className="text-emerald-400">
              ${optimized.toLocaleString()}
            </span>
          </div>

          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{
                width: `${current > 0 ? (optimized / current) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
