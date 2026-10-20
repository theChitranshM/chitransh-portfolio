import Link from "next/link";
import { site } from "@/content/site";
import { Chapter } from "./Chapter";

export function Hero() {
  const h = site.hero;
  return (
    <Chapter id="hero" index={0} height={125} label="hero">
      <div className="absolute inset-x-0 bottom-0 flex min-h-[46svh] flex-col justify-end bg-[linear-gradient(0deg,rgba(20,13,9,0.95)_0%,rgba(20,13,9,0.7)_60%,transparent_100%)] px-5 pb-[calc(26px+var(--safe-bottom))] pt-16 wide:inset-y-0 wide:w-[62vw] wide:min-h-0 wide:justify-center wide:bg-[linear-gradient(90deg,rgba(20,13,9,0.85)_0%,rgba(20,13,9,0.45)_60%,transparent_100%)] wide:pb-0 wide:pl-[6vw] wide:pt-0">
        <div className="pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto" data-reveal-group>
          <p className="hud-label mb-4 text-crema" data-reveal>
            {h.kicker}
          </p>
          <h1 className="font-display text-[clamp(56px,12vw,168px)] leading-[0.9]">
            <span className="block" data-reveal>
              {h.titleLine1}
            </span>
            <em className="block text-amber" data-reveal>
              {h.titleLine2}
            </em>
          </h1>
          <p className="mt-5 max-w-[32ch] text-[18px] leading-snug text-milk/90 wide:text-[21px]" data-reveal>
            {h.sub}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" data-reveal>
            <Link
              href="/recruiter"
              className="rounded-full border border-crema/40 px-4 py-2 font-mono text-[13px] text-crema transition-colors hover:border-agent hover:text-agent"
            >
              {h.recruiterCta}
            </Link>
            <span className="flex items-center gap-2 font-mono text-[13px] text-milk/60">
              <span aria-hidden className="inline-block h-6 w-[1px] animate-pulse bg-milk/50" />
              {h.scrollHint}
            </span>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
