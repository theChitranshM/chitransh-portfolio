import { site } from "@/content/site";
import { Chapter } from "./Chapter";
import { TwinPanel } from "./TwinPanel";

export function Twin() {
  return (
    <Chapter id="twin" index={6} height={160} label="twin">
      <div aria-hidden className="absolute inset-y-0 left-0 hidden w-[46vw] bg-[linear-gradient(90deg,rgba(20,13,9,0.85)_0%,rgba(20,13,9,0.5)_60%,transparent_100%)] wide:block" />
      <div className="pointer-events-none absolute left-[6vw] top-1/2 hidden max-w-[30vw] -translate-y-1/2 wide:block" data-reveal-group>
        <p className="hud-label mb-3 text-agent" data-reveal>
          {site.twin.label}
        </p>
        <p className="font-display text-[clamp(44px,5.6vw,88px)] leading-[0.92]" data-reveal>
          {site.twin.title}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[72svh] wide:inset-x-auto wide:bottom-auto wide:right-[6vw] wide:top-1/2 wide:h-[min(78vh,640px)] wide:w-[min(46vw,560px)] wide:-translate-y-1/2">
        <TwinPanel />
      </div>
    </Chapter>
  );
}
