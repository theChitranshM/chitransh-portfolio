export type AchievementId =
  | "first-sip"
  | "barista"
  | "prompt-engineer"
  | "reverse-psychologist"
  | "et-tu"
  | "night-owl"
  | "recruiter"
  | "twin";

export type Achievement = { id: AchievementId; title: string; line: string; icon: string };

export const achievements: Achievement[] = [
  { id: "first-sip", title: "first sip", line: "you showed up. that's most of it.", icon: "☕" },
  { id: "barista", title: "barista", line: "refilled the coffee. you'd fit in here.", icon: "🫗" },
  { id: "prompt-engineer", title: "prompt engineer", line: "typed \"fix\". that's literally my workflow 😭", icon: "⌨️" },
  {
    id: "reverse-psychologist",
    title: "reverse psychologist",
    line: "clicked the button i told you not to. it worked on my principal too.",
    icon: "🔴",
  },
  { id: "et-tu", title: "et tu", line: "found julius caesar. i played him in the school play.", icon: "🏛️" },
  { id: "night-owl", title: "night owl", line: "made it to 1am. same.", icon: "🦉" },
  { id: "recruiter", title: "recruiter", line: "opened recruiter mode. ok now we're talking.", icon: "💼" },
  { id: "twin", title: "talked to the twin", line: "you met my AI twin. it's nicer than me.", icon: "🤖" },
];

export const dialedIn = {
  title: "dialed in",
  line: "found all 8. you're dialed in. email me with \"dialed in\" in the subject and i'll know.",
  icon: "🏆",
};
