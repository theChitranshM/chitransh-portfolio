import { site } from "@/content/site";
import { Chapter, ChapterText } from "./Chapter";
import { Polaroids } from "./Polaroids";

export function Events() {
  const e = site.events;
  return (
    <Chapter id="events" index={5} height={140} label="events">
      <div className="pointer-events-none absolute inset-x-0 top-[calc(96px+var(--safe-top))] wide:inset-y-0 wide:left-auto wide:right-[6vw] wide:top-0 wide:flex wide:items-center">
        <Polaroids />
      </div>
      <ChapterText id="events" label={e.label} title={e.title} body={e.body} align="left" />
    </Chapter>
  );
}
