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
      className="bg-zinc-800 hover:bg-zinc-700 transition px-5 py-3 rounded-2xl"
    >
      {copied ? "Copied!" : "Copy Share Link"}
    </button>
  );
}
