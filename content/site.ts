// ALL copy and facts for the site. Single source of truth.
// Facts come from BUILD.md plus Chitransh's resume files (dates, titles, Starbucks/Nordstrom).
// No Insight/company project details: Chitransh asked for none.

export type Experience = {
  company: string;
  role: string;
  dates: string; // formal, recruiter mode ("Present" becomes "now" on the receipt)
  receiptRole: string;
  receiptLine?: string;
  recruiterLine: string;
  /** shown under "Earlier experience" in recruiter mode */
  earlier?: boolean;
};

export type Project = {
  id: string;
  title: string;
  line: string;
  recruiterLine: string;
  stack: string[];
  link?: string;
  date?: string;
  featured: boolean;
  /** only shown once Chitransh confirms it can be public */
  confirm?: boolean;
};

export type Leadership = {
  title: string;
  polaroid: string;
  recruiter: string;
  /** icon shown on the polaroid until a real photo exists */
  icon: string;
  /** /public/photos/<photo>.jpg, TODO(chitransh) */
  photo?: string;
};

export const site = {
  name: "Chitransh Motwani",
  shortName: "chitransh",
  location: "Vancouver, BC",
  tagline: "builds AI in vancouver. runs on espresso.",
  links: {
    email: "chitransh.m.dev@gmail.com",
    linkedin: "https://www.linkedin.com/in/chitranshm/",
    github: "https://github.com/theChitranshM",
    instagram: "https://www.instagram.com/chitranshmotwani/",
    resume: "/resume.pdf", // generated from /recruiter (npm run resume). Swap in your own any time.
  },

  loader: [
    "dialing in the grinder (inner burr: 3)",
    "pulling a shot",
    "waking up the agents",
    "ok. mostly ready.",
  ],
  enterButton: "pull the shot ☕",

  hero: {
    kicker: "vancouver · 4:47 pm · caffeine 100%",
    titleLine1: "i build AI.",
    titleLine2: "mostly on espresso.",
    sub: "everyone wants AI. nobody knows what for. that's my job 😭",
    scrollHint: "scroll. the coffee's getting cold.",
    recruiterCta: "recruiter mode (30 seconds)",
  },

  origin: {
    label: "ajmer, before all this",
    title: "robotics kid.",
    body: "led the robotics club at mayoor school. taught robotics to the juniors. won a few competitions. peaked early 😭",
    robotClick: "beep.",
    laurelTooltip: "played julius caesar in the annual school play. et tu, recruiter? 💀",
  },

  ticket: {
    stub: { from: "AJMER", to: "VANCOUVER", year: "2021", passengers: "1", age: "19" },
    title: "moved to canada alone at 19.",
    body: "first day at sfu was the day the student union building opened. we've both been here since 2021 😭",
    footnote: "computing science, simon fraser university. final semester. graduating december 2026.",
    subTooltip: "the SUB. same first day, 2021.",
  },

  work: {
    label: "the laptop",
    windowTitle: "~/projects (sorted by espresso consumed)",
    intro: "things i built. some for work, some for fun, one for this website.",
    sidebar: { featured: "featured", more: "more" },
  },

  receipt: {
    // label/title/body are new lines (not in BUILD.md), flagged in the report
    label: "the work history",
    title: "itemized.",
    body: "ex starbucks barista (2021–22). still pulling shots. nobody tips anymore ☕",
    header: "CAFÉ CHITRANSH · VANCOUVER",
    order: "order #2026 · table: final semester",
    extrasLabel: "extras",
    extras: ["python", "sql", "azure", "docker", "pytorch", "tensorflow", "spark"],
    subtotal: "subtotal: 5 years of CS",
    tip: "tip: hire me",
    footer: "thank you, come again ☕",
  },

  events: {
    label: "before AI, i threw parties",
    title: "events guy.",
    body: "turns out a 784-ticket concert is great practice for client calls.",
  },

  twin: {
    label: "talk to my AI twin",
    title: "i built an AI version of me.",
    body: "it replies faster than i do and it's never had a coffee 😭",
    chips: [
      "what do you actually do?",
      "best project?",
      "why should i hire you?",
      "how much coffee, honestly?",
      "tell me the reverse psychology story",
    ],
    placeholder: "ask me anything (work stuff pls)",
    unknown: "the real chitransh hasn't told me that yet. ask him: ",
    disclaimer: "AI twin. it can be wrong. the real one is better (debatable).",
    limit: "that's enough twin for today. the real one's on email.",
    maxMessages: 10,
  },

  night: {
    kicker: "vancouver · 1:12 am · caffeine: concerning",
    title: "let's grab a coffee.",
    body: "still up? same. i'll bring the beans. i have way too many.",
    doNotClick: "do not click",
    doNotClickAfter: "you clicked it 😭",
    footer: "built with claude code, three.js and too much espresso · vancouver · 2026",
  },

  caffeine: {
    low: "caffeine low. click the espresso machine ☕",
    refilled: "refilled. back to 100%.",
  },

  sneakers: "~40 pairs. zero of them help me code.", // TODO(chitransh): confirm you're fine showing this
  showSneakers: false,

  consoleMessage: "hey. if you opened devtools on a portfolio, we should talk. email me: ",

  experience: [
    {
      company: "Insight",
      role: "Data & AI Consultant, Forward Deployed Engineer",
      dates: "Jun 2026 – Present",
      receiptRole: "data & AI consultant, FDE",
      receiptLine: "ai agents, presales, client-facing work",
      recruiterLine:
        "Consultant on the Cloud, Data & AI team, working on AI agent solutions, presales and client-facing delivery.",
    },
    {
      company: "SAP",
      role: "Data Engineer Intern (iXp), Sales & Marketing",
      dates: "Sep 2025 – May 2026",
      receiptRole: "data engineer intern (iXp)",
      receiptLine: "datasphere, databricks, migrations",
      recruiterLine:
        "Data engineering with SAP Datasphere and Databricks on the Sales & Marketing team. Nominated by my manager for SAP's Fast Track alumni program.",
    },
    {
      company: "Pattison Food Group",
      role: "Information Technology Analyst (Co-op)",
      dates: "Jan 2024 – Aug 2024",
      receiptRole: "IT analyst co-op",
      receiptLine: "infrastructure, troubleshooting",
      recruiterLine: "IT co-op supporting infrastructure and troubleshooting across retail and office teams.",
    },
    {
      company: "Dyson",
      role: "Retail Expert",
      dates: "Oct 2023 – Dec 2024",
      receiptRole: "retail expert",
      receiptLine: "learned to sell. (vacuums.)",
      recruiterLine: "Explained technical products to customers and ran in-store demos.",
      earlier: true,
    },
    {
      company: "Nordstrom",
      role: "Service Experience Representative",
      dates: "May 2022 – Jun 2023",
      receiptRole: "service experience rep",
      receiptLine: "client service. consulting, but with returns.",
      recruiterLine: "Client service, concierge requests and point-of-sale support.",
      earlier: true,
    },
    {
      company: "Starbucks",
      role: "Barista",
      dates: "Aug 2021 – Oct 2022",
      receiptRole: "barista",
      receiptLine: "pulled shots before i pulled data.",
      recruiterLine: "Barista in Burnaby: drink preparation and customer service during peak hours.",
      earlier: true,
    },
  ] satisfies Experience[],

  projects: [
    {
      id: "fraud",
      title: "Financial Fraud Detector",
      line: "caught fraud at 0.985 AUC-ROC. then explained why with SHAP and LIME, because \"the model said so\" isn't an answer.",
      recruiterLine:
        "XGBoost fraud detection model at 0.985 AUC-ROC, with SHAP and LIME explanations and a Streamlit dashboard.",
      stack: ["Python", "XGBoost", "SHAP", "LIME", "Streamlit"],
      link: "https://github.com/theChitranshM/Financial-Fraud-Detector",
      featured: true,
    },
    {
      id: "hammer",
      title: "Project Hammer",
      line: "predicted grocery prices across 8 canadian grocers. loblaws was the most predictable. make of that what you will.",
      recruiterLine:
        "Price prediction on the open Canadian grocery price dataset (8 grocers), comparing error by vendor. Loblaws had the lowest MAE.",
      stack: ["Python", "Pandas"],
      date: "Nov 2024",
      featured: true,
    },
    {
      id: "shopify",
      title: "Magento → Shopify Migration Tool",
      line: "moved a whole store between platforms with validation, batching and retries. built for a technical challenge.",
      recruiterLine:
        "Magento-to-Shopify ETL with validation, batching and retry logic, built for a data migration technical challenge.",
      stack: ["Python", "SQL", "JSON", "Shopify API"],
      featured: true,
    },
    {
      id: "food",
      title: "Food Image Classifier",
      line: "a CNN that knows 101 kinds of food. i still can't decide what to order.",
      recruiterLine: "Food-101 image classifier (CNN) with a Dockerized Streamlit app.",
      stack: ["TensorFlow", "Docker", "Streamlit"],
      featured: true,
    },
    {
      id: "melody",
      title: "Melody Generator",
      line: "taught RNNs to write music, one note at a time. group project, i did the data side.",
      recruiterLine:
        "Note-by-note melody generation with RNN, LSTM and GRU models in PyTorch (ABC notation). Group project; I owned data preprocessing and metadata parsing.",
      stack: ["PyTorch"],
      featured: true,
    },
    {
      id: "olist",
      title: "Olist Sales + Sentiment",
      line: "e-commerce sales analysis plus a hugging face sentiment pipeline on the reviews.",
      recruiterLine: "E-commerce sales analysis with a Hugging Face sentiment pipeline on customer reviews.",
      stack: ["Python", "SQL", "Tableau", "Hugging Face"],
      date: "Dec 2024",
      featured: false,
    },
    {
      id: "earthshot",
      title: "Mining Site Recommender",
      line: "an AI recommendation engine for mining sites, built for earthshot factory through riipen.",
      recruiterLine: "AI-powered mining-site recommendation engine for Earthshot Factory (Riipen, Dec 2025).",
      stack: ["Python"],
      date: "Dec 2025",
      featured: false,
    },
    {
      id: "resume-parser",
      title: "Resume Parser",
      line: "parses resumes so humans don't have to.",
      recruiterLine: "Resume parsing tool built with Python and NLTK, containerized with Docker.",
      stack: ["Python", "NLTK", "Docker"],
      featured: false,
    },
    {
      id: "this-site",
      title: "This Website",
      line: "you're in it. next.js, three.js, gsap, and an AI twin on the claude API.",
      recruiterLine: "This portfolio: Next.js, React Three Fiber, GSAP, and an AI twin on the Claude API.",
      stack: ["Next.js", "React Three Fiber", "GSAP", "Claude API"],
      link: "https://github.com/theChitranshM/chitransh-portfolio",
      featured: false,
    },
  ] satisfies Project[],

  leadership: [
    {
      title: "fall kickoff 2024",
      polaroid: "SFU's first big welcome-back concert in about 5 years. 784 tickets sold the day before the show.",
      recruiter:
        "Led Fall Kickoff 2024, the SFSS's first large welcome-back concert at SFU in about five years: event plan, tiered ticketing, sponsorship, security and campus comms. 784 tickets sold the day before the show.",
      icon: "🎤",
      // photo: "fall-kickoff-2024", // TODO(chitransh): add /public/photos/fall-kickoff-2024.jpg, then uncomment
    },
    {
      title: "SFSS VP events & student affairs",
      polaroid: "2024–25. club nights, munchie mondays, diwali, holi, the works.",
      recruiter: "Elected VP Events & Student Affairs, Simon Fraser Student Society (May 2024 – Apr 2025).",
      icon: "🪩",
      // photo: "sfss-vp-events", // TODO(chitransh): add /public/photos/sfss-vp-events.jpg, then uncomment
    },
    {
      title: "back 2 school 2025",
      polaroid: "ran \"SFU's biggest welcome back party\" as VP events at the forum.",
      recruiter: "VP Events, The Forum at SFU (Jul – Dec 2025). Led the 4th annual Back 2 School party.",
      icon: "🎉",
      // photo: "back-2-school-2025", // TODO(chitransh): add /public/photos/back-2-school-2025.jpg, then uncomment
    },
    {
      title: "TEDxSFU",
      polaroid: "event production director, 2023.",
      recruiter: "Event Production Director, TEDxSFU (Aug – Nov 2023).",
      icon: "🎙️",
      // photo: "tedxsfu", // TODO(chitransh): add /public/photos/tedxsfu.jpg, then uncomment
    },
    {
      title: "indian student federation",
      polaroid: "co-president for 2+ years. now an advisor.",
      recruiter: "Co-President, Indian Student Federation at SFU (Dec 2021 – Apr 2024); Advisor since May 2025.",
      icon: "🪔",
      // photo: "indian-student-federation", // TODO(chitransh): add /public/photos/indian-student-federation.jpg, then uncomment
    },
    {
      title: "right now",
      polaroid: "project manager at the SFU open source development club. fellow at maple leaf venture club.",
      recruiter:
        "Project Manager, SFU Open Source Development Club (since Jan 2026). Fellow, Maple Leaf Venture Club (since Jul 2026).",
      icon: "🧭",
      // photo: "right-now", // TODO(chitransh): add /public/photos/right-now.jpg, then uncomment
    },
  ] satisfies Leadership[],

  skills: {
    languages: ["Python", "SQL", "Java", "C/C++", "JavaScript", "HTML/CSS"],
    dataMl: ["PyTorch", "TensorFlow", "Apache Spark", "Pandas", "SHAP/LIME", "Streamlit", "Tableau"],
    platforms: ["Azure", "Docker", "Git", "Databricks", "SAP Datasphere"],
    consulting: ["Client-facing consulting", "Presales", "Technical documentation"],
  },

  education: {
    school: "Simon Fraser University",
    degree: "BSc, Computing Science",
    dates: "2021 – Dec 2026",
  },

  recruiter: {
    title: "Data & AI Consultant · Vancouver",
    summary: [
      "I'm a Data & AI Consultant and Forward Deployed Engineer on Insight's Cloud, Data & AI team, where I work on AI agent solutions and the client conversations around them.",
      "I'm finishing a BSc in Computing Science at Simon Fraser University (December 2026).",
      "Before this I was a data engineering intern at SAP, and as VP Events at the Simon Fraser Student Society I led a campus concert with 784 tickets sold the day before the show.",
    ],
    banner: "you're in recruiter mode. the full experience is here →",
    back: "back to the experience ☕",
  },

  seo: {
    title: "Chitransh Motwani · builds AI in Vancouver",
    description:
      "Chitransh Motwani is an AI consultant in Vancouver. Scroll through one evening at his desk, or open recruiter mode for the 30-second version.",
  },
};

/** keep false: projects with `confirm: true` stay hidden until Chitransh says yes */
export const SHOW_UNCONFIRMED = false;

export const visibleProjects = site.projects.filter(
  (p: Project) => SHOW_UNCONFIRMED || !p.confirm,
);

export const chapters = [
  { id: "hero", label: "hero" },
  { id: "origin", label: "origin" },
  { id: "ticket", label: "ticket" },
  { id: "work", label: "work" },
  { id: "receipt", label: "receipt" },
  { id: "events", label: "events" },
  { id: "twin", label: "twin" },
  { id: "night", label: "night" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
