"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

const pill =
  "pointer-events-auto inline-flex min-h-[36px] items-center rounded-full border border-milk/20 bg-espresso/50 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-milk/85 backdrop-blur-md transition-colors hover:border-agent hover:text-agent";

export function RecruiterButton() {
  return (
    <Link href="/recruiter" className={`${pill} border-crema/40`} onClick={() => track("recruiter_mode_opened", { from: "hud" })}>
      recruiter mode
    </Link>
  );
}
