"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export default function PdfButton() {
  const [loading, setLoading] = useState(false);

  async function downloadPdf() {
    try {
      setLoading(true);

      await new Promise((r) => setTimeout(r, 120));

      window.print();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={downloadPdf}
      disabled={loading}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Preparing...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF
        </>
      )}
    </button>
  );
}
