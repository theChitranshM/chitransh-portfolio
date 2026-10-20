import type { ReactNode } from "react";

/**
 * A chapter is a tall section with a sticky, full-screen stage inside.
 * The extra height is the "hold" while the camera sits on the subject.
 * Default layout is portrait (text in the bottom 40%); `wide:` is landscape desktop.
 */
export function Chapter({
  id,
  index,
  height,
  children,
  label,
}: {
  id: string;
  index: number;
  height: number; // in svh
  children: ReactNode;
  label: string;
}) {
  return (
    <section
      id={id}
      data-chapter={index}
      aria-label={label}
      className="chapter relative"
      style={{ height: `${height}svh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">{children}</div>
    </section>
  );
}

export function ChapterText({
  id,
  label,
  title,
  body,
  align = "left",
  children,
  className = "",
}: {
  id: string;
  label?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "right";
  children?: ReactNode;
  className?: string;
}) {
  const side =
    align === "left"
      ? "wide:left-0 wide:pl-[6vw] wide:pr-0 wide:bg-[linear-gradient(90deg,rgba(20,13,9,0.82)_0%,rgba(20,13,9,0.5)_55%,transparent_100%)]"
      : "wide:right-0 wide:left-auto wide:pr-[7vw] wide:pl-0 wide:bg-[linear-gradient(270deg,rgba(20,13,9,0.82)_0%,rgba(20,13,9,0.5)_55%,transparent_100%)] wide:justify-end";
  return (
    <div
      className={`absolute inset-x-0 bottom-0 flex min-h-[40svh] items-end bg-[linear-gradient(0deg,rgba(20,13,9,0.94)_0%,rgba(20,13,9,0.78)_55%,transparent_100%)] px-5 pb-[calc(28px+var(--safe-bottom))] pt-20 wide:inset-y-0 wide:min-h-0 wide:w-[50vw] wide:items-center wide:pb-0 wide:pt-0 ${side} ${className}`}
    >
      <div className="pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto max-w-[30rem]" data-reveal-group>
        {label && (
          <p className="hud-label mb-3 text-amber" data-reveal>
            {label}
          </p>
        )}
        <h2 id={`${id}-title`} className="font-display text-[clamp(44px,7.2vw,104px)] leading-[0.92]" data-reveal>
          {title}
        </h2>
        {body && (
          <p className="mt-4 max-w-[34ch] text-[17px] leading-snug text-milk/90 wide:text-[19px]" data-reveal>
            {body}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
