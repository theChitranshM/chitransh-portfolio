import { ExperienceShell } from "@/components/ExperienceShell";
import { Hero } from "@/components/chapters/Hero";
import { Origin } from "@/components/chapters/Origin";
import { Ticket } from "@/components/chapters/Ticket";
import { Work } from "@/components/chapters/Work";
import { Receipt } from "@/components/chapters/Receipt";
import { Events } from "@/components/chapters/Events";
import { Twin } from "@/components/chapters/Twin";
import { Night } from "@/components/chapters/Night";

export default function Home() {
  return (
    <ExperienceShell>
      <Hero />
      <Origin />
      <Ticket />
      <Work />
      <Receipt />
      <Events />
      <Twin />
      <Night />
    </ExperienceShell>
  );
}
