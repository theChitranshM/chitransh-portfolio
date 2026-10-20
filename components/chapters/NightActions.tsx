"use client";

import { site } from "@/content/site";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { DoNotClick } from "@/components/eggs/DoNotClick";

const base = "inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 font-mono text-[13px] transition-colors";
const btn = `${base} border-milk/25 text-milk hover:border-agent hover:text-agent`;

export function NightActions() {
  const unlock = useStore((s) => s.unlock);
  const l = site.links;
  return (
    <div className="mt-7 flex flex-col gap-5 wide:items-center" data-reveal>
      <div className="flex flex-wrap gap-2 wide:justify-center">
        <a href={`mailto:${l.email}?subject=coffee%3F`} className={`${base} border-agent bg-agent font-medium text-espresso hover:border-milk hover:bg-milk`}>
          email ☕
        </a>
        <a href={l.linkedin} target="_blank" rel="noreferrer" className={btn}>
          linkedin
        </a>
        <a href={l.github} target="_blank" rel="noreferrer" className={btn}>
          github
        </a>
        <a href={l.instagram} target="_blank" rel="noreferrer" className={btn}>
          instagram
        </a>
        <a
          href={l.resume}
          download="Chitransh_Motwani_Resume.pdf"
          className={btn}
          onClick={() => {
            track("resume_downloaded");
            unlock("recruiter");
          }}
        >
          resume ↓
        </a>
      </div>
      <div>
        <DoNotClick />
      </div>
    </div>
  );
}
