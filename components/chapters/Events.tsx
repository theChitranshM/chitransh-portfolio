import { site } from "@/content/site";
import { Chapter, ChapterText } from "./Chapter";
import { PolaroidChips, Polaroids } from "./Polaroids";

export function Events() {
  const e = site.events;
  return (
    <Chapter id="events" index={5} height={140} label="events">
      <div className="pointer-events-none absolute inset-x-0 top-[calc(96px+var(--safe-top))]">
        <Polaroids />
      </div>
      <ChapterText id="events" label={e.label} title={e.title} body={e.body} align="left">
        <PolaroidChips />
      </ChapterText>
    </Chapter>
  );
}
