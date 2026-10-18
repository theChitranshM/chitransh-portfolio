import { site } from "@/content/site";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-6">
      <p className="hud-label text-crema">{site.hero.kicker}</p>
      <h1 className="font-display text-[clamp(56px,12vw,168px)] leading-[0.9]">
        {site.hero.titleLine1}
        <br />
        <em>{site.hero.titleLine2}</em>
      </h1>
    </main>
  );
}
