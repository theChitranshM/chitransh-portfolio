import type { Metadata } from "next";
import Link from "next/link";
import { site, visibleProjects } from "@/content/site";
import { RecruiterBanner, RecruiterBeacon, ResumeButton } from "@/components/recruiter/RecruiterClient";

export const metadata: Metadata = {
  title: "Chitransh Motwani · Recruiter mode",
  description: `${site.recruiter.title}. Experience, projects, leadership and skills on one page.`,
  alternates: { canonical: "/recruiter" },
};

const recent = site.experience.filter((e) => !("earlier" in e && e.earlier));
const earlier = site.experience.filter((e) => "earlier" in e && e.earlier);
const featured = visibleProjects.filter((p) => p.featured);

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 border-b border-mocha/20 pb-2 font-mono text-[12px] uppercase tracking-[0.12em] text-mocha print:mb-1.5 print:pb-0.5 print:break-after-avoid">
      {children}
    </h2>
  );
}

const linkClass =
  "underline decoration-amber decoration-2 underline-offset-4 hover:decoration-espresso print:no-underline";

export default function RecruiterPage() {
  const contact = [
    { label: site.links.email, href: `mailto:${site.links.email}` },
    { label: "LinkedIn", href: site.links.linkedin, print: "linkedin.com/in/chitranshm" },
    { label: "GitHub", href: site.links.github, print: "github.com/theChitranshM" },
  ];

  return (
    <div className="recruiter min-h-dvh bg-milk text-espresso">
      <RecruiterBeacon />
      <RecruiterBanner />
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-10 sm:pt-16 print:max-w-none print:px-0 print:pb-0 print:pt-0">
        <header className="mb-10 print:mb-3">
          <h1 className="font-display text-[clamp(48px,10vw,84px)] leading-[0.95] print:text-[34px]">{site.name}</h1>
          <p className="mt-3 text-lg text-mocha print:mt-1 print:text-[13px]">
            {site.recruiter.title.replace(" · Vancouver", "")} · {site.location}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[15px] print:mt-1 print:gap-x-3 print:text-[11px]">
            {contact.map((c) => (
              <li key={c.href}>
                <a href={c.href} className={linkClass}>
                  <span className="print:hidden">{c.label}</span>
                  <span className="hidden print:inline">{c.print ?? c.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-4 print:hidden">
            <ResumeButton className="rounded-full bg-espresso px-6 py-3 font-medium text-milk transition-colors hover:bg-mocha" />
            <Link href="/" className="font-mono text-[13px] text-mocha hover:text-espresso">
              {site.recruiter.back}
            </Link>
          </div>
        </header>

        <section className="mb-10 space-y-3 text-[17px] leading-relaxed print:mb-3 print:space-y-0.5 print:text-[11px] print:leading-snug">
          {site.recruiter.summary.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </section>

        <section className="mb-10 print:mb-3" aria-labelledby="experience">
          <SectionTitle>
            <span id="experience">Experience</span>
          </SectionTitle>
          <ol className="space-y-5 print:space-y-2">
            {recent.map((e) => (
              <li key={e.company} className="print-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold print:text-[12px]">
                    {e.role} · {e.company}
                  </h3>
                  <span className="font-mono text-[13px] text-mocha print:text-[10.5px]">{e.dates}</span>
                </div>
                <p className="mt-1 text-[15.5px] text-espresso/85 print:mt-0 print:text-[10.5px] print:leading-snug">{e.recruiterLine}</p>
              </li>
            ))}
          </ol>
          {earlier.length > 0 && (
            <div className="mt-6 print:mt-2">
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mocha print:mb-1">
                Earlier experience
              </h3>
              <ul className="space-y-1.5 text-[15px] print:space-y-0.5 print:text-[11px]">
                {earlier.map((e) => (
                  <li key={e.company} className="flex flex-wrap justify-between gap-x-4">
                    <span>
                      <span className="font-medium">{e.role}</span>, {e.company}.{" "}
                      <span className="text-espresso/75">{e.recruiterLine}</span>
                    </span>
                    <span className="font-mono text-[13px] text-mocha print:text-[10.5px]">{e.dates}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="mb-10 print:mb-3" aria-labelledby="projects">
          <SectionTitle>
            <span id="projects">Selected projects</span>
          </SectionTitle>
          <ul className="grid gap-5 sm:grid-cols-2 print:grid-cols-3 print:gap-x-4 print:gap-y-1.5">
            {featured.map((p) => (
              <li key={p.id} className="print-avoid-break rounded-xl border border-mocha/15 bg-white/50 p-4 print:rounded-none print:border-0 print:bg-transparent print:p-0">
                <h3 className="font-semibold print:text-[12px]">
                  {p.link ? (
                    <a href={p.link} className={linkClass}>
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                  {p.date && <span className="ml-2 font-mono text-[12px] font-normal text-mocha print:text-[10px]">{p.date}</span>}
                </h3>
                <p className="mt-1 text-[15px] text-espresso/85 print:mt-0 print:text-[10.5px] print:leading-snug">{p.recruiterLine}</p>
                <p className="mt-2 font-mono text-[12px] text-mocha print:mt-0 print:text-[10px]">{p.stack.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 print:mb-3" aria-labelledby="leadership">
          <SectionTitle>
            <span id="leadership">Leadership</span>
          </SectionTitle>
          <ul className="space-y-2 text-[15.5px] print:space-y-0 print:text-[10.5px] print:leading-snug">
            {site.leadership.map((l) => (
              <li key={l.title} className="flex gap-3">
                <span aria-hidden className="text-amber">•</span>
                <span>{l.recruiter}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 print:mb-3" aria-labelledby="skills">
          <SectionTitle>
            <span id="skills">Skills</span>
          </SectionTitle>
          <dl className="grid gap-x-6 gap-y-3 text-[15px] sm:grid-cols-[180px_1fr] print:grid-cols-[150px_1fr] print:gap-y-0.5 print:text-[11px]">
            {[
              ["Languages", site.skills.languages],
              ["Data & ML", site.skills.dataMl],
              ["Platforms", site.skills.platforms],
              ["Consulting", site.skills.consulting],
            ].map(([k, v]) => (
              <div key={k as string} className="contents">
                <dt className="font-mono text-[12px] uppercase tracking-[0.1em] text-mocha print:text-[10px]">{k as string}</dt>
                <dd className="-mt-2 sm:mt-0 print:mt-0">{(v as string[]).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-10 print:mb-3" aria-labelledby="education">
          <SectionTitle>
            <span id="education">Education</span>
          </SectionTitle>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="print:text-[12px]">
              <span className="font-semibold">{site.education.school}</span>, {site.education.degree}
            </p>
            <span className="font-mono text-[13px] text-mocha print:text-[10.5px]">{site.education.dates}</span>
          </div>
        </section>

        <section aria-labelledby="contact" className="print:hidden">
          <SectionTitle>
            <span id="contact">Contact</span>
          </SectionTitle>
          <p className="text-[17px]">
            The fastest way to reach me is email:{" "}
            <a href={`mailto:${site.links.email}`} className={linkClass}>
              {site.links.email}
            </a>
            . I&apos;m also on{" "}
            <a href={site.links.linkedin} className={linkClass}>
              LinkedIn
            </a>{" "}
            and{" "}
            <a href={site.links.github} className={linkClass}>
              GitHub
            </a>
            .
          </p>
          <ResumeButton className="mt-6 flex w-full items-center justify-center rounded-2xl bg-espresso px-6 py-5 text-lg font-medium text-milk transition-colors hover:bg-mocha sm:w-auto" />
          <p className="mt-10">
            <Link href="/" className="font-mono text-[13px] text-mocha hover:text-espresso">
              {site.recruiter.back}
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
