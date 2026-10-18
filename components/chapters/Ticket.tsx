import { site } from "@/content/site";
import { Chapter, ChapterText } from "./Chapter";
import { SubChip } from "./SubChip";

function Stub() {
  const s = site.ticket.stub;
  const field = (k: string, v: string) => (
    <div>
      <dt className="text-[9px] tracking-[0.18em] text-mocha">{k}</dt>
      <dd className="text-[15px] font-medium text-espresso">{v}</dd>
    </div>
  );
  return (
    <div
      className="pointer-events-auto relative flex w-[min(92vw,420px)] rotate-[-2deg] font-mono shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
      aria-label={`ticket: ${s.from} to ${s.to}, ${s.year}, ${s.passengers} passenger, age ${s.age}`}
      role="img"
      data-reveal
    >
      <div className="relative flex-1 rounded-l-xl bg-crema px-5 py-4">
        <p className="text-[9px] tracking-[0.22em] text-mocha">BOARDING PASS · ONE WAY</p>
        <div className="mt-2 flex items-center gap-3 text-[22px] font-semibold tracking-tight text-espresso sm:text-[26px]">
          <span>{s.from}</span>
          <span aria-hidden className="text-[16px] text-cherry">
            ✈
          </span>
          <span>{s.to}</span>
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-2">
          {field("YEAR", s.year)}
          {field("PASSENGERS", s.passengers)}
          {field("AGE", s.age)}
        </dl>
      </div>
      {/* perforated edge */}
      <div
        aria-hidden
        className="w-[2px] bg-crema"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,13,9,0.55) 1.2px, transparent 1.6px)",
          backgroundSize: "2px 8px",
        }}
      />
      <div className="flex w-[92px] flex-col items-center justify-center rounded-r-xl bg-crema px-2 py-4 text-center sm:w-[104px]">
        <p className="text-[9px] tracking-[0.18em] text-mocha">SEAT</p>
        <p className="text-[20px] font-semibold text-espresso">{s.passengers}A</p>
        <p className="mt-2 text-[9px] tracking-[0.18em] text-mocha">{s.year}</p>
      </div>
      <span aria-hidden className="absolute -top-2 right-[100px] h-4 w-4 rounded-full bg-espresso sm:right-[112px]" />
      <span aria-hidden className="absolute -bottom-2 right-[100px] h-4 w-4 rounded-full bg-espresso sm:right-[112px]" />
    </div>
  );
}

export function Ticket() {
  const t = site.ticket;
  return (
    <Chapter id="ticket" index={2} height={130} label="ticket">
      <div className="pointer-events-none absolute inset-x-0 top-[calc(108px+var(--safe-top))] flex justify-center wide:inset-y-0 wide:left-auto wide:right-[7vw] wide:top-0 wide:items-center">
        <Stub />
      </div>
      <ChapterText id="ticket" title={t.title} body={t.body} align="left">
        <p className="mt-4 max-w-[38ch] font-mono text-[12px] leading-relaxed text-crema/75" data-reveal>
          {t.footnote}
        </p>
        <SubChip />
      </ChapterText>
    </Chapter>
  );
}
