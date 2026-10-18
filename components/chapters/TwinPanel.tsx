"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { fallbackAnswer } from "@/content/twin-fallback";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";

type Msg = { role: "user" | "assistant"; content: string };
const t = site.twin;

async function streamText(text: string, onChunk: (s: string) => void, speed = 14) {
  for (let i = 0; i < text.length; i += 2) {
    onChunk(text.slice(0, i + 2));
    await new Promise((r) => setTimeout(r, speed));
  }
  onChunk(text);
}

export function TwinPanel() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const unlock = useStore((s) => s.unlock);
  const sent = messages.filter((m) => m.role === "user").length;
  const limited = sent >= t.maxMessages;

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const setLast = (content: string) =>
    setMessages((m) => [...m.slice(0, -1), { role: "assistant", content }]);

  const send = useCallback(
    async (text: string, opts: { demo?: boolean } = {}) => {
      const q = text.trim().slice(0, 500);
      if (!q || busy || limited) return;
      setInput("");
      setBusy(true);
      const history: Msg[] = [...messages, { role: "user", content: q }];
      setMessages([...history, { role: "assistant", content: "" }]);
      unlock("twin");
      track("twin_message_sent", { count: history.filter((m) => m.role === "user").length });

      if (opts.demo) {
        await streamText(fallbackAnswer(q), setLast, 22);
        setBusy(false);
        return;
      }
      try {
        const res = await fetch("/api/twin", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-10) }),
        });
        if (res.status === 429) {
          await streamText(await res.text(), setLast);
        } else if (!res.ok || !res.body) {
          throw new Error(`twin ${res.status}`);
        } else {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = "";
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            acc += decoder.decode(value, { stream: true });
            setLast(acc);
          }
          if (!acc.trim()) await streamText(fallbackAnswer(q), setLast);
        }
      } catch {
        await streamText(fallbackAnswer(q), setLast);
      } finally {
        setBusy(false);
      }
    },
     
    [busy, limited, messages, unlock],
  );

  // reel mode: type a question and answer from the canned replies, no API call
  useEffect(() => {
    const onDemo = async (e: Event) => {
      const q = (e as CustomEvent<string>).detail;
      for (let i = 1; i <= q.length; i++) {
        setInput(q.slice(0, i));
        await new Promise((r) => setTimeout(r, 45));
      }
      await new Promise((r) => setTimeout(r, 200));
      void send(q, { demo: true });
    };
    window.addEventListener("twin:demo", onDemo);
    return () => window.removeEventListener("twin:demo", onDemo);
  }, [send]);

  return (
    <div className="pointer-events-auto flex h-full flex-col overflow-hidden rounded-t-2xl border border-mocha/70 bg-[#0c0806]/95 font-mono text-[13px] shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-md wide:rounded-xl">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-mocha/60 px-4">
        <span className="h-2 w-2 animate-pulse rounded-full bg-agent shadow-[0_0_10px_#9CFF6E]" aria-hidden />
        <h2 id="twin-title" className="text-[12px] uppercase tracking-[0.12em] text-agent">
          {t.label}
        </h2>
        <span className="ml-auto text-[11px] text-crema/40">
          {Math.min(sent, t.maxMessages)}/{t.maxMessages}
        </span>
      </div>

      <div ref={scroller} data-lenis-prevent className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
        <p className="text-milk">
          <span className="text-agent">twin&gt;</span> {t.title}
        </p>
        <p className="text-milk/80">
          <span className="text-agent">twin&gt;</span> {t.body}
        </p>
        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="text-crema">
              <span className="text-amber">you&gt;</span> {m.content}
            </p>
          ) : (
            <p key={i} className="whitespace-pre-wrap text-milk">
              <span className="text-agent">twin&gt;</span> {m.content}
              {busy && i === messages.length - 1 && (
                <span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[0.6em] translate-y-[2px] animate-[blink_1s_steps(1)_infinite] bg-agent" />
              )}
            </p>
          ),
        )}
        {limited && !busy && (
          <p className="text-crema/80">
            <span className="text-agent">twin&gt;</span> {t.limit}{" "}
            <a href={`mailto:${site.links.email}`} className="underline decoration-agent underline-offset-4">
              {site.links.email}
            </a>
          </p>
        )}
      </div>

      {messages.length === 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar wide:flex-wrap" data-lenis-prevent>
          {t.chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => void send(c)}
              className="shrink-0 rounded-full border border-agent/40 px-3 py-1.5 text-[12px] text-agent/90 transition-colors hover:bg-agent hover:text-espresso"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex shrink-0 items-center gap-2 border-t border-mocha/60 px-4 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <span className="text-amber" aria-hidden>
          &gt;
        </span>
        <label htmlFor="twin-input" className="sr-only">
          message the AI twin
        </label>
        <input
          id="twin-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 500))}
          placeholder={limited ? t.limit : t.placeholder}
          disabled={limited}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-[16px] text-milk placeholder:text-milk/35 focus:outline-none wide:text-[14px]"
        />
        <button
          type="submit"
          disabled={busy || limited || !input.trim()}
          className="rounded-md bg-agent px-3 py-1.5 text-[12px] font-medium text-espresso transition-opacity disabled:opacity-30"
        >
          send
        </button>
      </form>
      <p className="shrink-0 px-4 pb-[calc(10px+var(--safe-bottom))] text-[10.5px] text-milk/40 wide:pb-3">{t.disclaimer}</p>
    </div>
  );
}
