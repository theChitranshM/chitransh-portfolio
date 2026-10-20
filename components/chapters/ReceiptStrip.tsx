"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site";
import { useStore } from "@/lib/store";
import { sound } from "@/lib/sound";

const r = site.receipt;
const rule = <div className="my-1 border-t border-dashed border-espresso/50" />;

// generated from site.experience + site.receipt, never hardcoded
const lines: ReactNode[] = [
  <p key="h" className="text-center font-semibold tracking-wide">{r.header}</p>,
  <p key="o" className="text-center text-[11px] text-espresso/70">{r.order}</p>,
  <div key="r1">{rule}</div>,
  ...site.experience.flatMap((e) => [
    <div key={`${e.company}-a`} className="flex justify-between gap-3 pt-1">
      <span className="min-w-0 flex-1">1x {e.receiptRole}</span>
      <span className="max-w-[46%] text-right lowercase">{e.company}</span>
    </div>,
    <div key={`${e.company}-b`} className="pl-[3ch] text-[11px] text-espresso/65">
      {e.dates.toLowerCase().replace("present", "now")}
    </div>,
    ...(e.receiptLine
      ? [
          <div key={`${e.company}-c`} className="pl-[3ch] text-espresso/80">
            {e.receiptLine}
          </div>,
        ]
      : []),
  ]),
  <div key="r2">{rule}</div>,
  <p key="x">
    {r.extrasLabel}: {r.extras.join(", ")}
  </p>,
  <p key="s" className="pt-1 font-semibold">{r.subtotal}</p>,
  <p key="t" className="font-semibold">{r.tip}</p>,
  <div key="r3">{rule}</div>,
  <p key="f" className="pt-1 text-center">{r.footer}</p>,
  <div key="bc" aria-hidden className="mx-auto mt-2 h-8 w-4/5" style={{ background: "repeating-linear-gradient(90deg,#140D09 0 2px,transparent 2px 4px,#140D09 4px 5px,transparent 5px 8px)" }} />,
];

export function ReceiptStrip() {
  const active = useStore((s) => s.chapter === 4);
  const reduced = useStore((s) => s.reducedMotion);
  const [shown, setShown] = useState(lines.length);
  const printed = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);

  // hide lines until the chapter is reached (server render shows everything for no-JS).
  // reduced motion: the whole receipt, no printing. The flag can arrive after first mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with the reduced-motion flag
    if (reduced) setShown(lines.length);
    else if (!printed.current) setShown(0);
  }, [reduced]);

  useEffect(() => {
    if (!active || printed.current) return;
    printed.current = true;
    if (reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(i);
      sound.play("tick");
      const el = scroller.current;
      if (el) el.scrollTop = el.scrollHeight;
      if (i >= lines.length) clearInterval(id);
    }, 120);
    return () => clearInterval(id);
  }, [active, reduced]);

  return (
    <div className="pointer-events-auto flex flex-col items-center">
      {/* printer slot */}
      <div aria-hidden className="relative z-10 h-4 w-[min(88vw,372px)] rounded-full bg-roast shadow-[inset_0_3px_6px_rgba(0,0,0,0.8)] ring-1 ring-mocha" />
      <div
        ref={scroller}
        data-lenis-prevent
        className="-mt-2 max-h-[46svh] w-[min(80vw,340px)] overflow-y-auto overscroll-contain no-scrollbar wide:max-h-[70vh]"
      >
        <div
          role="list"
          aria-label="work history receipt"
          className="receipt-paper px-4 pb-6 pt-5 font-mono text-[12px] leading-[1.55] text-espresso shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]"
        >
          {lines.map((l, i) => (
            <div key={i} role="listitem" className={i < shown ? "receipt-line" : "hidden"}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
