import { site } from "@/content/site";
import { Chapter, ChapterText } from "./Chapter";
import { ReceiptStrip } from "./ReceiptStrip";

export function Receipt() {
  const r = site.receipt;
  return (
    <Chapter id="receipt" index={4} height={150} label="receipt">
      <div className="pointer-events-none absolute inset-x-0 top-[calc(104px+var(--safe-top))] flex justify-center wide:inset-y-0 wide:left-auto wide:right-[10vw] wide:top-[13vh] wide:items-start">
        <ReceiptStrip />
      </div>
      <ChapterText id="receipt" label={r.label} title={r.title} body={r.body} align="left" />
    </Chapter>
  );
}
