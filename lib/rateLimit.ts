// 15 twin messages per IP per 10 minutes.
// In-memory by default (per serverless instance, fine for v1). If Upstash env vars exist,
// a shared fixed-window counter is used instead (plain REST, no extra dependency).

const LIMIT = 15;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

async function upstash(ip: string): Promise<boolean | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const key = `twin:${ip}:${Math.floor(Date.now() / WINDOW_MS)}`;
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(WINDOW_MS / 1000)],
      ]),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const [incr] = (await res.json()) as { result: number }[];
    return incr.result <= LIMIT;
  } catch {
    return null; // fall back to memory
  }
}

export async function allow(ip: string): Promise<boolean> {
  const shared = await upstash(ip);
  if (shared !== null) return shared;
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return true;
}
