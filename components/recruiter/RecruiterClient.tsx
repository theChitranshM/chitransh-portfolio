"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";

/** Unlocks the recruiter achievement and logs the visit. Renders nothing. */
export function RecruiterBeacon() {
  useEffect(() => {
    useStore.getState().hydrate();
    useStore.getState().unlock("recruiter");
    track("recruiter_mode_opened", { from: new URLSearchParams(window.location.search).get("from") ?? "direct" });
  }, []);
  return null;
}

/** Shown when the experience sent someone here (no WebGL, reduced motion, low-end device). */
export function RecruiterBanner() {
  const [reason, setReason] = useState<string | null>(null);
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once after mount
    if (from === "auto") setReason(from);
  }, []);
  if (!reason) return null;
  return (
    <div className="print:hidden bg-espresso text-milk">
      <Link
        href="/?full=1"
        className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3 font-mono text-[13px]"
      >
        <span>{site.recruiter.banner}</span>
      </Link>
    </div>
  );
}

export function ResumeButton({ className }: { className?: string }) {
  return (
    <a
      href={site.links.resume}
      download="Chitransh_Motwani_Resume.pdf"
      onClick={() => {
        track("resume_downloaded");
        useStore.getState().unlock("recruiter");
      }}
      className={className}
    >
      Download resume
    </a>
  );
}
