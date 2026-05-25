"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      onClick={copyLink}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 text-zinc-300" />
          Copy Share Link
        </>
      )}
    </button>
  );
}
