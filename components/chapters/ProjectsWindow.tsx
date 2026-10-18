"use client";

import { useState } from "react";
import { site, visibleProjects, type Project } from "@/content/site";
import { useStore } from "@/lib/store";

const groups = [
  { id: "featured", label: site.work.sidebar.featured, items: visibleProjects.filter((p) => p.featured) },
  { id: "more", label: site.work.sidebar.more, items: visibleProjects.filter((p) => !p.featured) },
] as const;

function FileIcon({ p }: { p: Project }) {
  return (
    <svg viewBox="0 0 40 48" className="h-11 w-9 shrink-0" aria-hidden>
      <path d="M4 2h22l10 10v32a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#F7F1E8" />
      <path d="M26 2v8a2 2 0 0 0 2 2h8" fill="#E9C9A1" />
      <rect x="2" y="30" width="34" height="11" fill={p.featured ? "#9CFF6E" : "#FFB547"} />
      <text x="19" y="39" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#140D09">
        {p.stack[0]?.slice(0, 4).toUpperCase()}
      </text>
    </svg>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li key={s} className="rounded-full border border-crema/20 px-2 py-0.5 font-mono text-[11px] text-crema/80">
          {s}
        </li>
      ))}
    </ul>
  );
}

export function ProjectsWindow() {
  const [group, setGroup] = useState<"featured" | "more">("featured");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = useStore((s) => s.chapter === 3);
  const items = groups.find((g) => g.id === group)!.items;
  const detail = visibleProjects.find((p) => p.id === openId);

  return (
    <div
      data-open={open}
      className="pointer-events-auto absolute inset-x-0 bottom-0 flex h-[68svh] flex-col overflow-hidden rounded-t-2xl border border-mocha/70 bg-roast/95 shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] data-[open=false]:translate-y-6 data-[open=false]:scale-[0.96] data-[open=false]:opacity-0 data-[open=false]:pointer-events-none data-[open=false]:focus-within:opacity-100 data-[open=false]:focus-within:pointer-events-auto wide:inset-x-auto wide:bottom-auto wide:left-1/2 wide:top-1/2 wide:h-[min(76vh,640px)] wide:w-[min(84vw,980px)] wide:-translate-x-1/2 wide:-translate-y-1/2 wide:rounded-xl wide:data-[open=false]:-translate-y-[46%] wide:data-[open=false]:scale-[0.6]"
    >
      {/* title bar */}
      <div className="relative flex h-10 shrink-0 items-center border-b border-mocha/60 bg-espresso/60 px-4">
        <div className="flex gap-2" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-cherry" />
          <span className="h-3 w-3 rounded-full bg-amber" />
          <span className="h-3 w-3 rounded-full bg-agent" />
        </div>
        <p className="absolute inset-x-16 truncate text-center font-mono text-[12px] text-crema/80">{site.work.windowTitle}</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col wide:flex-row">
        {/* sidebar (segmented control on phones) */}
        <nav aria-label="project folders" className="flex shrink-0 gap-1 border-b border-mocha/50 p-2 wide:w-44 wide:flex-col wide:border-b-0 wide:border-r wide:p-3">
          <p className="hidden px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-crema/45 wide:block">folders</p>
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setGroup(g.id);
                setOpenId(null);
              }}
              aria-pressed={group === g.id}
              className="flex flex-1 items-center justify-between gap-3 rounded-md px-3 py-2 text-left font-mono text-[13px] text-milk/80 transition-colors hover:bg-mocha/40 aria-pressed:bg-mocha/70 aria-pressed:text-milk wide:flex-none"
            >
              <span>📁 {g.label}</span>
              <span className="text-[11px] text-crema/50">{g.items.length}</span>
            </button>
          ))}
        </nav>

        {/* files */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 wide:p-5" data-lenis-prevent>
          {detail ? (
            <article>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="mb-4 font-mono text-[12px] text-crema/70 hover:text-agent"
              >
                ← back
              </button>
              <div className="flex items-start gap-4">
                <FileIcon p={detail} />
                <div>
                  <h3 className="font-display text-[34px] leading-none">{detail.title}</h3>
                  {detail.date && <p className="mt-1 font-mono text-[12px] text-crema/60">{detail.date}</p>}
                </div>
              </div>
              <p className="mt-4 text-[16px] leading-relaxed text-milk/90">{detail.line}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-crema/80">{detail.recruiterLine}</p>
              <Stack items={detail.stack} />
              {detail.link && (
                <a
                  href={detail.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-block rounded-full bg-agent px-4 py-2 font-mono text-[13px] text-espresso hover:bg-milk"
                >
                  open on github ↗
                </a>
              )}
            </article>
          ) : (
            <>
              <p className="mb-4 font-mono text-[12px] text-crema/70">{site.work.intro}</p>
              <ul className="grid gap-3 wide:grid-cols-2">
                {items.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(p.id)}
                      className="flex w-full items-start gap-3 rounded-lg border border-transparent p-3 text-left transition-colors hover:border-mocha hover:bg-espresso/40"
                    >
                      <FileIcon p={p} />
                      <span className="min-w-0">
                        <span className="block font-medium text-milk">{p.title}</span>
                        <span className="mt-1 block text-[14px] leading-snug text-milk/75">{p.line}</span>
                        <Stack items={p.stack} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
