"use client";

export default function ScrollToFormButton() {
  const handleClick = () => {
    document.getElementById("audit-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-xl bg-emerald-500 px-6 py-4 font-medium text-black transition hover:bg-emerald-400"
    >
      Run Free Audit
    </button>
  );
}
