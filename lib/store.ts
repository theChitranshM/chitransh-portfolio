"use client";

import { create } from "zustand";
import { achievements, dialedIn, type AchievementId } from "@/content/achievements";
import { site } from "@/content/site";
import { readJSON, writeJSON } from "./storage";
import { track } from "./analytics";
import { sound } from "./sound";

export type Quality = "high" | "medium" | "low" | "none";

export type Toast = {
  id: number;
  kind: "achievement" | "info" | "gold";
  title?: string;
  line: string;
  icon?: string;
};

type Unlocked = Partial<Record<AchievementId, number>>;

const ACH_KEY = "dialed-in:achievements";
const SOUND_KEY = "dialed-in:sound";
const CAFFEINE_FLOOR = 10;

type State = {
  // scroll
  progress: number;
  chapter: number;
  /** chapter index + fraction scrolled through it, drives the camera */
  chapterFloat: number;
  maxProgress: number;
  // caffeine
  caffeine: number;
  refilling: boolean;
  lowWarned: boolean;
  // flow
  loaded: boolean;
  /** 0..1, real load stages for the loader */
  loadProgress: number;
  entered: boolean;
  reel: boolean;
  reducedMotion: boolean;
  quality: Quality;
  portrait: boolean;
  // play
  sound: boolean;
  unlocked: Unlocked;
  toasts: Toast[];
  panelOpen: boolean;
  cursorLabel: string | null;
  tooltip: { id: string; text: string } | null;
  robotWave: number;
  fixBro: number;
  confetti: number;
  sleepy: boolean;
  /** index of the enlarged polaroid, if any */
  polaroid: number | null;

  setScroll: (progress: number, chapter: number, chapterFloat: number) => void;
  refill: () => void;
  setLoaded: (v: boolean) => void;
  setLoadProgress: (v: number) => void;
  enter: () => void;
  setQuality: (q: Quality) => void;
  setPortrait: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setReel: (v: boolean) => void;
  toggleSound: () => void;
  hydrate: () => void;
  unlock: (id: AchievementId) => void;
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
  setPanelOpen: (v: boolean) => void;
  setCursorLabel: (label: string | null) => void;
  setTooltip: (t: { id: string; text: string } | null) => void;
  waveRobot: () => void;
  triggerFixBro: () => void;
  setPolaroid: (i: number | null) => void;
};

let toastId = 0;

export const useStore = create<State>((set, get) => ({
  progress: 0,
  chapter: 0,
  chapterFloat: 0,
  maxProgress: 0,
  caffeine: 100,
  refilling: false,
  lowWarned: false,
  loaded: false,
  loadProgress: 0.05,
  entered: false,
  reel: false,
  reducedMotion: false,
  quality: "medium",
  portrait: false,
  sound: false,
  unlocked: {},
  toasts: [],
  panelOpen: false,
  cursorLabel: null,
  tooltip: null,
  robotWave: 0,
  fixBro: 0,
  confetti: 0,
  sleepy: false,
  polaroid: null,

  setScroll: (progress, chapter, chapterFloat) => {
    const s = get();
    let { caffeine, maxProgress, lowWarned } = s;
    // caffeine only drains going forward, 100 -> 10 over the whole scroll
    if (progress > maxProgress && !s.refilling) {
      caffeine = Math.max(CAFFEINE_FLOOR, caffeine - (progress - maxProgress) * 90);
      maxProgress = progress;
    }
    if (caffeine <= 20 && !lowWarned) {
      lowWarned = true;
      get().pushToast({ kind: "info", line: site.caffeine.low, icon: "☕" });
    }
    const last = chapter === 7;
    if (last && chapter !== s.chapter) get().unlock("night-owl");
    set({
      progress,
      chapter,
      chapterFloat,
      caffeine,
      maxProgress,
      lowWarned,
      sleepy: last && caffeine < 15,
    });
  },

  refill: () => {
    if (get().refilling) return;
    set({ refilling: true });
    sound.play("pour");
    track("caffeine_refilled");
    const start = get().caffeine;
    const t0 = performance.now();
    const dur = 1500;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      set({ caffeine: start + (100 - start) * eased });
      if (k < 1) requestAnimationFrame(step);
      else {
        set({ refilling: false, lowWarned: false, maxProgress: get().progress, sleepy: false });
        get().pushToast({ kind: "info", line: site.caffeine.refilled, icon: "☕" });
        get().unlock("barista");
      }
    };
    requestAnimationFrame(step);
  },

  setLoaded: (v) => set(v ? { loaded: true, loadProgress: 1 } : { loaded: false }),
  setLoadProgress: (v) => set({ loadProgress: Math.max(get().loadProgress, v) }),
  enter: () => {
    if (get().entered) return;
    set({ entered: true });
    sound.unlock();
    if (get().sound) sound.setAmbience(true);
    get().unlock("first-sip");
  },
  setQuality: (q) => set({ quality: q }),
  setPortrait: (v) => set({ portrait: v }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setReel: (v) => set({ reel: v }),

  toggleSound: () => {
    const next = !get().sound;
    set({ sound: next });
    writeJSON(SOUND_KEY, next);
    sound.setEnabled(next);
    if (next) {
      sound.unlock();
      sound.setAmbience(get().entered);
      sound.play("click");
    } else sound.setAmbience(false);
  },

  hydrate: () => {
    const soundOn = readJSON<boolean>(SOUND_KEY, false);
    sound.setEnabled(soundOn);
    set({ unlocked: readJSON<Unlocked>(ACH_KEY, {}), sound: soundOn });
  },

  unlock: (id) => {
    // merge with storage so an unlock before hydrate never wipes saved progress
    const unlocked = { ...readJSON<Unlocked>(ACH_KEY, {}), ...get().unlocked };
    if (unlocked[id]) return;
    const next = { ...unlocked, [id]: Date.now() };
    set({ unlocked: next });
    writeJSON(ACH_KEY, next);
    const a = achievements.find((x) => x.id === id);
    if (!a) return;
    track("achievement_unlocked", { id });
    sound.play("achievement");
    get().pushToast({ kind: "achievement", title: a.title, line: a.line, icon: a.icon });
    if (achievements.every((x) => next[x.id])) {
      setTimeout(() => {
        get().pushToast({ kind: "gold", title: dialedIn.title, line: dialedIn.line, icon: dialedIn.icon });
        set({ confetti: Date.now() });
        track("achievement_unlocked", { id: "dialed-in" });
      }, 900);
    }
  },

  pushToast: (t) => {
    const toast = { ...t, id: ++toastId };
    set({ toasts: [...get().toasts, toast].slice(-3) });
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  setPanelOpen: (v) => set({ panelOpen: v }),
  setCursorLabel: (label) => set({ cursorLabel: label }),
  setTooltip: (t) => set({ tooltip: t }),
  waveRobot: () => {
    set({ robotWave: Date.now(), tooltip: { id: "robot", text: site.origin.robotClick } });
    sound.play("beep");
  },
  setPolaroid: (i) => set({ polaroid: i }),
  triggerFixBro: () => {
    set({ fixBro: Date.now() });
    get().unlock("prompt-engineer");
  },
}));

export const unlockedCount = (u: Unlocked) => achievements.filter((a) => u[a.id]).length;
