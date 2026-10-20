"use client";

import { useEffect } from "react";
import { useStore, type Toast } from "@/lib/store";

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useStore((s) => s.dismissToast);
  useEffect(() => {
    const id = setTimeout(() => dismiss(toast.id), toast.kind === "gold" ? 7000 : 3800);
    return () => clearTimeout(id);
  }, [toast, dismiss]);
  const gold = toast.kind === "gold";
  const ach = toast.kind === "achievement";
  return (
    <li
      className={`toast-in pointer-events-auto flex w-[min(92vw,380px)] items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md ${
        gold ? "border-amber bg-[linear-gradient(135deg,#3a2614,#140D09)]" : ach ? "border-agent/50 bg-espresso/90" : "border-milk/15 bg-espresso/90"
      }`}
      role="status"
    >
      {toast.icon && (
        <span className="text-[22px] leading-none" aria-hidden>
          {toast.icon}
        </span>
      )}
      <span className="min-w-0">
        {toast.title && (
          <span className={`block font-mono text-[11px] uppercase tracking-[0.12em] ${gold ? "text-amber" : "text-agent"}`}>
            {ach ? "achievement · " : ""}
            {toast.title}
          </span>
        )}
        <span className="block text-[14.5px] leading-snug text-milk/90">{toast.line}</span>
      </span>
    </li>
  );
}


export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  return (
    <ul className="pointer-events-none fixed inset-x-0 bottom-[calc(18px+var(--safe-bottom))] z-40 flex flex-col items-center gap-2 wide:bottom-16" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </ul>
  );
}
