"use client";

import { useState } from "react";

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
      className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 transition px-4 sm:px-5 py-3 rounded-2xl text-sm font-medium"
    >
      {copied ? "Copied!" : "Copy Share Link"}
    </button>
  );
}
