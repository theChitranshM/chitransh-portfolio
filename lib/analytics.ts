import { track as vercelTrack } from "@vercel/analytics";

type EventName =
  | "achievement_unlocked"
  | "twin_message_sent"
  | "recruiter_mode_opened"
  | "resume_downloaded"
  | "caffeine_refilled";

// Never send message contents. Only names and small counts.
export function track(name: EventName, props?: Record<string, string | number | boolean>) {
  try {
    vercelTrack(name, props);
  } catch {
    // analytics must never break the page
  }
}
