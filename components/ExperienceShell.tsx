"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { detectQuality } from "@/lib/quality";
import { initScroll, stopScroll } from "@/lib/scroll";
import { setupReveals } from "@/lib/reveal";
import { listenForFix } from "@/lib/eggs";
import { startReel } from "@/lib/reel";
import { consoleHello } from "@/components/eggs/ConsoleHello";
import { FixBro } from "@/components/eggs/FixBro";
import { Confetti } from "@/components/eggs/Confetti";
import { Backdrop } from "@/components/experience/Backdrop";
import { Hud } from "@/components/hud/Hud";
import { Loader } from "@/components/hud/Loader";
import { AchievementsPanel, Cursor, Toasts, Tooltip } from "@/components/hud/Overlays";

// the whole 3D chunk loads only on the client, after the shell
const Scene = dynamic(() => import("@/components/experience/Scene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    useStore.getState().setLoaded(true);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Sleepy() {
  const sleepy = useStore((s) => s.sleepy);
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[5] transition-opacity duration-[1500ms] ${sleepy ? "opacity-100" : "opacity-0"}`}
      style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(10,6,4,0.75) 100%)", backdropFilter: sleepy ? "saturate(0.65)" : undefined }}
    />
  );
}

export function ExperienceShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const quality = useStore((s) => s.quality);
  const entered = useStore((s) => s.entered);
  const reduced = useStore((s) => s.reducedMotion);
  const reel = useStore((s) => s.reel);

  useEffect(() => {
    const st = useStore.getState();
    st.hydrate();
    consoleHello();
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    const isReel = params.get("reel") === "1";
    const full = params.get("full") === "1";
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    st.setReel(isReel);
    st.setReducedMotion(rm && !isReel);
    const mq = window.matchMedia("(orientation: portrait)");
    const onOrient = () => st.setPortrait(mq.matches);
    onOrient();
    mq.addEventListener("change", onOrient);
    let cancelled = false;
    void detectQuality().then((q) => {
      if (cancelled) return;
      // no WebGL, very low-end, or reduced motion: recruiter mode, with a link back here
      if ((q === "none" || rm) && !full && !isReel) {
        router.replace("/recruiter?from=auto");
        return;
      }
      st.setQuality(q);
      if (q === "none") st.setLoaded(true);
      setReady(true);
    });
    const stopFix = listenForFix(() => useStore.getState().triggerFixBro());
    return () => {
      cancelled = true;
      mq.removeEventListener("change", onOrient);
      stopFix();
    };
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    return initScroll({ smooth: !reduced });
  }, [ready, reduced]);

  useEffect(() => {
    stopScroll(!entered);
  }, [entered, ready]);

  useEffect(() => {
    if (!entered || reduced) return;
    return setupReveals();
  }, [entered, reduced]);

  useEffect(() => {
    if (!entered || !reel) return;
    return startReel();
  }, [entered, reel]);

  return (
    <>
      <Backdrop />
      {ready && quality !== "none" && (
        <SceneBoundary>
          <Scene />
        </SceneBoundary>
      )}
      <Sleepy />
      <main id="experience" className={`pointer-events-none relative z-10 ${reel ? "reel" : ""}`}>
        {children}
      </main>
      <Hud />
      <Toasts />
      <Tooltip />
      <AchievementsPanel />
      <FixBro />
      <Confetti />
      {!reel && <Cursor />}
      <Loader />
    </>
  );
}
