"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { site, type Leadership } from "@/content/site";
import { stopScroll } from "@/lib/scrollApi";
import { useStore } from "@/lib/store";

const tilts = [-3, 2, -1.5, 2.5, -2, 1.5];
const gradients = [
  "linear-gradient(135deg,#FFB547,#FF5A4E)",
  "linear-gradient(135deg,#4A3022,#FFB547)",
  "linear-gradient(135deg,#FF5A4E,#2A1A12)",
  "linear-gradient(135deg,#E9C9A1,#4A3022)",
  "linear-gradient(135deg,#FFB547,#4A3022)",
  "linear-gradient(135deg,#9CFF6E,#2A1A12)",
];

function Photo({ item, index, big = false }: { item: Leadership; index: number; big?: boolean }) {
  return item.photo ? (
    // eslint-disable-next-line @next/next/no-img-element -- local photos, sized by the frame
    <img src={`/photos/${item.photo}.jpg`} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
  ) : (
    <div className="flex h-full w-full items-center justify-center" style={{ background: gradients[index % gradients.length] }}>
      <span className={big ? "text-[96px]" : "text-[44px]"} aria-hidden>
        {item.icon}
      </span>
    </div>
  );
}

/** desktop: the 3D wall is the polaroid wall; these are its keyboard-friendly buttons */
export function PolaroidChips() {
  const setOpen = useStore((s) => s.setPolaroid);
  return (
    <ul className="mt-6 hidden flex-wrap gap-2 wide:flex" data-reveal aria-label="open a polaroid">
      {site.leadership.map((l, i) => (
        <li key={l.title}>
          <button
            type="button"
            onClick={() => setOpen(i)}
            className="rounded-full border border-milk/25 bg-espresso/40 px-3 py-1.5 font-mono text-[11.5px] text-milk/85 transition-colors hover:border-agent hover:text-agent"
          >
            {l.icon} {l.title}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function Polaroids() {
  const open = useStore((s) => s.polaroid);
  const setOpen = useStore((s) => s.setPolaroid);

  useEffect(() => {
    if (open === null) return;
    stopScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      stopScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const item = open !== null ? site.leadership[open] : null;

  return (
    <>
      <ul
        data-lenis-prevent
        className="pointer-events-auto flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 pt-3 no-scrollbar wide:hidden"
        aria-label="events and leadership"
      >
        {site.leadership.map((l, i) => (
          <li key={l.title} className="shrink-0 snap-center" style={{ transform: `rotate(${tilts[i]}deg)` }}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-[150px] bg-milk p-2 pb-3 text-left shadow-[0_14px_30px_-10px_rgba(0,0,0,0.75)] transition-transform hover:-translate-y-1 hover:rotate-0 wide:w-[clamp(128px,11vw,168px)]"
            >
              <span aria-hidden className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cherry shadow" />
              <span className="block aspect-square overflow-hidden">
                <Photo item={l} index={i} />
              </span>
              <span className="mt-2 block font-hand text-[19px] leading-[1.05] text-espresso">{l.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {item && open !== null && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          className="pointer-events-auto fixed inset-0 z-[48] flex items-center justify-center bg-espresso/80 p-6 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <figure
            className="w-[min(86vw,420px)] rotate-[-1.5deg] bg-milk p-3 pb-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square overflow-hidden">
              <Photo item={item} index={open} big />
            </div>
            <figcaption className="mt-3 px-1">
              <span className="block font-hand text-[30px] leading-none text-espresso">{item.title}</span>
              <span className="mt-2 block text-[15px] leading-snug text-espresso/80">{item.polaroid}</span>
            </figcaption>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(null)}
              className="mt-4 ml-1 font-mono text-[12px] text-mocha hover:text-espresso"
            >
              close ✕
            </button>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}
