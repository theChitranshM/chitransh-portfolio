"use client";

/** Calls onFix when "f", "i", "x" are typed in a row outside any input. */
export function listenForFix(onFix: () => void) {
  let buffer = "";
  const onKey = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement | null;
    if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-3);
    if (buffer === "fix") {
      buffer = "";
      onFix();
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}
