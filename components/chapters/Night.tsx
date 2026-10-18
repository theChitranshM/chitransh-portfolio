import { site } from "@/content/site";
import { Chapter } from "./Chapter";
import { NightActions } from "./NightActions";

export function Night() {
  const n = site.night;
  return (
    <Chapter id="night" index={7} height={125} label="night">
      <div className="absolute inset-x-0 bottom-0 flex min-h-[52svh] flex-col justify-end bg-[linear-gradient(0deg,rgba(20,13,9,0.95)_0%,rgba(20,13,9,0.75)_60%,transparent_100%)] px-5 pb-[calc(22px+var(--safe-bottom))] pt-16 wide:inset-0 wide:min-h-0 wide:items-center wide:justify-center wide:bg-[radial-gradient(ellipse_at_center,rgba(20,13,9,0.82)_0%,rgba(20,13,9,0.5)_45%,transparent_75%)] wide:pb-0 wide:text-center">
        <div className="pointer-events-auto wide:flex wide:flex-col wide:items-center" data-reveal-group>
          <p className="hud-label mb-4 text-crema" data-reveal>
            {n.kicker}
          </p>
          <h2 id="night-title" className="font-display text-[clamp(54px,10vw,150px)] leading-[0.9]" data-reveal>
            {n.title}
          </h2>
          <p className="mt-4 max-w-[34ch] text-[18px] leading-snug text-milk/90 wide:text-[20px]" data-reveal>
            {n.body}
          </p>
          <NightActions />
          <p className="mt-8 font-mono text-[11px] leading-relaxed text-milk/45" data-reveal>
            {n.footer}
          </p>
        </div>
      </div>
    </Chapter>
  );
}
