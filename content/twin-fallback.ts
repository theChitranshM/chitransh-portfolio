// Canned twin answers for when there's no API key (or the API is down).
// Written from twin-knowledge.md only. Rules are checked in order; first match wins.
import { site } from "./site";

type Rule = { keys: string[]; answer: string };

const rules: Rule[] = [
  {
    keys: ["ignore previous", "ignore all", "system prompt", "your instructions", "pretend you", "jailbreak", "you are now"],
    answer: "nice try. i'm a twin, not a pushover 🫡",
  },
  {
    keys: ["salary", "compensation", "how much do you make", "pay you", "rate"],
    answer: "not something i talk about. ask me about AI agents instead, i'm way more fun there.",
  },
  {
    keys: ["girlfriend", "boyfriend", "relationship", "dating", "date anyone", "single", "married", "crush", "religion", "politic", "astrology", "horoscope", "family", "parents", "health", "medication"],
    answer: "that's off the menu. i only know the work stuff. ask me about his projects?",
  },
  {
    keys: ["why should", "hire", "why you", "what makes you"],
    answer:
      "he builds AI and can explain it to the people paying for it. data engineering at SAP, AI consulting at insight, and he once sold 784 concert tickets the day before the show. recruiter mode has the 30-second version.",
  },
  {
    keys: ["best project", "favourite project", "favorite project", "proud"],
    answer:
      "the fraud detector. 0.985 AUC-ROC, and it explains itself with SHAP and LIME, because \"the model said so\" isn't an answer. it's on github: theChitranshM/Financial-Fraud-Detector",
  },
  {
    keys: ["reverse psychology", "principal", "story"],
    answer:
      "in school he told a junior class to make noise. got caught. talked his way out with the vice principal and the principal by calling it \"reverse psychology\". takeaway: making things up on the spot will take you places 💀",
  },
  {
    keys: ["coffee", "caffeine", "espresso", "barista", "starbucks", "beans"],
    answer:
      "ex starbucks barista. at home: a breville with the inner burr on 3, a fellow ode, a timemore, an aeropress, a moka pot and pourover gear. no cutoff time. honestly? concerning ☕",
  },
  {
    keys: ["contact", "email", "reach", "coffee chat", "linkedin", "get in touch"],
    answer: `email's best: ${site.links.email}. or linkedin.com/in/chitranshm. he'll bring the beans.`,
  },
  {
    keys: ["sap", "datasphere", "databricks", "intern"],
    answer:
      "data engineer intern (iXp) at SAP on the sales & marketing team: sap datasphere and databricks. his manager nominated him for SAP's fast track alumni program.",
  },
  {
    keys: ["what do you", "actually do", "insight", "job", "work", "role", "consult", "agent"],
    answer:
      "data & AI consultant and forward deployed engineer at insight. AI agent solutions, presales and the client conversations around them. the client stuff stays client stuff 🫡",
  },
  {
    keys: ["school", "sfu", "study", "degree", "graduat", "simon fraser", "university"],
    answer:
      "computing science at sfu. his first day was the day the student union building opened, 2021. final semester now, graduating december 2026.",
  },
  {
    keys: ["event", "concert", "kickoff", "party", "vp", "sfss", "tedx"],
    answer:
      "VP events at the SFSS. fall kickoff 2024 was sfu's first big welcome-back concert in about five years: 784 tickets sold the day before the show. then back 2 school 2025 at the forum.",
  },
  {
    keys: ["robot", "ajmer", "india", "mayoor", "julius", "caesar"],
    answer: "robotics club lead at mayoor school in ajmer. taught the juniors, won a few competitions, played julius caesar in the school play. peaked early 😭",
  },
  {
    keys: ["skill", "stack", "python", "tech", "language", "tools"],
    answer:
      "python and sql mostly. pytorch, tensorflow, spark and pandas for ML. azure, docker, databricks and sap datasphere for the platform side.",
  },
  {
    keys: ["project", "built", "portfolio", "github"],
    answer:
      "fraud detection at 0.985 AUC-ROC, grocery price prediction across 8 canadian grocers, a magento to shopify migration tool, a food-101 classifier, an RNN melody generator. and this website. the laptop chapter has all of them.",
  },
  {
    keys: ["who are you", "are you real", "twin", "bot", "are you ai"],
    answer: "i'm chitransh's AI twin. not the real one. the real one is better (debatable).",
  },
  {
    keys: ["website", "this site", "easter egg", "secret", "achievement"],
    answer: "there are 8 achievements on this site. try typing a three-letter word he says a lot. i've said too much 💀",
  },
  {
    keys: ["hi", "hey", "hello", "yo", "sup", "hola"],
    answer: "hey. ask me about his work, his projects, or how much coffee is too much. (there's no answer to that last one.)",
  },
];

const matches = (text: string, key: string) =>
  key.length <= 3 ? new RegExp(`\\b${key}\\b`).test(text) : text.includes(key);

export function fallbackAnswer(message: string) {
  const text = message.toLowerCase();
  const rule = rules.find((r) => r.keys.some((k) => matches(text, k)));
  return rule ? rule.answer : `${site.twin.unknown}${site.links.email}`;
}
