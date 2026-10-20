import Link from "next/link";

// new copy (not in BUILD.md), flagged in the report
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center gap-5 px-6 wide:px-[8vw]">
      <p className="hud-label text-amber">404 · vancouver · way past 1:12 am</p>
      <h1 className="font-display text-[clamp(56px,11vw,150px)] leading-[0.9]">
        this page
        <br />
        <em className="text-amber">went cold.</em>
      </h1>
      <p className="max-w-[34ch] text-[18px] text-milk/85">nothing here but an empty mug 😭</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="rounded-full bg-amber px-5 py-2.5 font-mono text-[13px] text-espresso">
          back to the desk ☕
        </Link>
        <Link href="/recruiter" className="rounded-full border border-milk/30 px-5 py-2.5 font-mono text-[13px] text-milk">
          recruiter mode
        </Link>
      </div>
    </main>
  );
}
