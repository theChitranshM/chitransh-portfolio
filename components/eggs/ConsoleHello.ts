import { site } from "@/content/site";

let printed = false;

export function consoleHello() {
  if (printed || typeof window === "undefined") return;
  printed = true;
  const art = [
    "   ( (",
    "    ) )",
    "  ........",
    "  |      |]",
    "  \\      /",
    "   `----'",
  ].join("\n");
  console.log(
    `%c${art}\n\n${site.consoleMessage}${site.links.email}`,
    "background:#140D09;color:#9CFF6E;font-family:monospace;font-size:13px;line-height:1.4;padding:14px 18px;border-radius:8px;",
  );
}
