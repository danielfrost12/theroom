import { Tension } from './types';

export const UNSPLASH_SCENES: Record<string, string> = {
  // Clean modern startup office — morning light, desks, whiteboards
  office_morning: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  // Late-night office — screens glowing, empty desks, someone still working
  office_night: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
  // Laptop at a café table — quick informal meeting, coffee cups
  coffee_shop: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80",
  // Glass-walled conference room — serious meeting, chairs around long table
  boardroom: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80",
  // Dimly lit apartment at night — laptop on couch, alone, exhaustion
  apartment_night: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
  // City skyline from rooftop — late-stage, looking out over the city
  rooftop: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
  // Airport terminal — travel, deals, the grind never stops
  airport: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&q=80",
  // Dark moody office/lounge — integrity crisis, shadows, moral weight
  bar: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&q=80",
  // Open-plan coworking space — energy, collaboration, whiteboards
  coworking: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
  // Park or outdoor bench — solitude, reflection, relationships fraying
  park_bench: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80",
  // Sterile hallway / waiting room — crisis, burnout, institutional feel
  hospital: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1200&q=80",
  // Modern office hallway — transition, walking between meetings
  elevator: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
};

export const SCENE_KEYS = Object.keys(UNSPLASH_SCENES);

export const BREATHING_MOMENTS: Record<string, string[]> = {
  good: [
    "Marcus pushed a commit at 2am. The tests all passed.",
    "Someone put a succulent on the shared desk. Nobody knows who.",
    "Priya sent a Slack emoji — just a rocket ship. No context needed.",
    "The lo-fi playlist has been running for six hours. Nobody changed it.",
    "Elena closed a deal and didn't tell anyone. You saw it in the CRM.",
    "David's assistant scheduled a 'quick catch-up.' No agenda attached.",
    "Three new applicants in the inbox. Word is getting out.",
    "The whiteboard in the kitchen has a new goal. Someone's ambitious.",
  ],
  neutral: [
    "Slack is quiet. Someone put on a lo-fi playlist.",
    "Three people are typing in #general. Then they all stop.",
    "The office smells like someone's leftover Thai food.",
    "Marcus has his headphones on. He's been in the zone since lunch.",
    "An email from a recruiter. Not for you — for your engineer.",
    "The printer jammed again. Elena is handling it with surprising intensity.",
    "Someone left a half-eaten sandwich in the fridge. Tensions are rising.",
    "Your co-founder is on a call with the door closed.",
  ],
  bad: [
    "Two people called in sick today. It's Tuesday.",
    "Marcus hasn't committed code in three days.",
    "Your investor's email: 'Let's talk.' No context. No agenda.",
    "The office is quiet for a Tuesday. Too quiet.",
    "Elena updated her LinkedIn profile. You noticed.",
    "Priya canceled your 1:1. Rescheduled to 'next week.'",
    "Someone Googled 'startup failure statistics' on the shared computer.",
    "The coffee machine broke. Morale somehow dropped further.",
  ],
  crisis: [
    "The Slack channel went silent after your message.",
    "Three dots appeared in your investor's chat. Then disappeared.",
    "You heard someone crying in the bathroom. You kept walking.",
    "Your co-founder texted: 'We need to talk. Tonight.'",
    "A Glassdoor review appeared. One star. 'Leadership is lost.'",
    "Your phone rang at 11pm. You stared at it for ten seconds.",
    "The parking lot was empty when you left. It was 4pm.",
    "An email from a lawyer. Subject: 'Preliminary Inquiry.'",
  ],
};

export const TENSIONS: Tension[] = [
  // --- PRODUCT ---
  // Every context is a SCENE, not a summary. You're in the room. You can smell the coffee.
  // Choice labels are personal, specific, lowercase — they feel like decisions, not commands.
  {
    left: "Let Marcus rebuild",
    right: "Override him",
    context: "Marcus pulled up the competitor's product on the big screen. The room went quiet. His version is cleaner, faster, and they shipped it last Tuesday. He's asking for two weeks to start over.",
    leftEffect: { company: -12, relationships: 8, energy: 3, integrity: 5 },
    rightEffect: { company: 5, relationships: -15, energy: -8, integrity: -3 },
    category: "product",
    leftForeshadow: "Marcus hasn't coded this fast in months.",
  },
  {
    left: "Ship it now",
    right: "Delay the launch",
    context: "You're staring at a bug in the login flow. It'll break for maybe 2% of users. The launch email goes out in 30 minutes. Marketing has been teasing this for three weeks.",
    leftEffect: { company: 10, relationships: -8, energy: 3, integrity: -15 },
    rightEffect: { company: -12, relationships: 3, energy: -8, integrity: 8 },
    category: "product",
    leftForeshadow: "The bug is live now. Maybe nobody will notice.",
  },
  {
    left: "Chase the new market",
    right: "Stay with who loves you",
    context: "Your customer NPS is 72. But the market is shrinking by 8% a quarter. Priya showed you a deck — there's an adjacent market ten times bigger. You'd be starting from zero.",
    leftEffect: { company: 5, relationships: -12, energy: -10, integrity: -5 },
    rightEffect: { company: -8, relationships: 3, energy: 3, integrity: 5 },
    category: "product",
    leftForeshadow: "Your best customers got an email today. They don't know yet.",
  },
  {
    left: "Build their feature",
    right: "Build yours instead",
    context: "Your competitor launched smart notifications yesterday. Your Slack is full of users asking when you'll have it. But your roadmap has something better — something they haven't thought of yet.",
    leftEffect: { company: 8, relationships: -5, energy: -10, integrity: -12 },
    rightEffect: { company: -10, relationships: 3, energy: 5, integrity: 8 },
    category: "product",
  },

  // --- PEOPLE ---
  {
    left: "Give him more time",
    right: "Let him go",
    context: "Marcus was employee #1. He stayed when nobody else would. But his last three pull requests were rejected, and the junior engineers are fixing his code. He knows you know.",
    leftEffect: { company: -15, relationships: 5, energy: 3, integrity: 3 },
    rightEffect: { company: 8, relationships: -18, energy: -5, integrity: -5 },
    category: "people",
    rightForeshadow: "The team watched him pack his desk. Nobody said goodbye.",
  },
  {
    left: "Let it go",
    right: "Have the conversation",
    context: "Priya went behind your back. She called David — your investor — to 'give him context' before the board meeting. She says she was protecting you. David now has a version of events you didn't write.",
    leftEffect: { company: -5, relationships: 5, energy: 5, integrity: -10 },
    rightEffect: { company: -3, relationships: -15, energy: -8, integrity: 10 },
    category: "people",
    rightForeshadow: "Priya closed her laptop and left early. She didn't say goodnight.",
  },
  {
    left: "Hire the one available now",
    right: "Wait for the right one",
    context: "You need a head of sales. Your pipeline is dying. One candidate can start Monday — decent, not great. The candidate you actually want is wrapping up somewhere else and won't be free for six weeks.",
    leftEffect: { company: 8, relationships: -8, energy: 3, integrity: -8 },
    rightEffect: { company: -10, relationships: 3, energy: -8, integrity: 5 },
    category: "people",
  },
  {
    left: "Protect the friendship",
    right: "Do what a CEO would do",
    context: "Your best friend at the company — the one who moved across the country to join you — is the weakest performer on the team. Everyone can see it. Nobody will say it.",
    leftEffect: { company: -15, relationships: 8, energy: 3, integrity: -8 },
    rightEffect: { company: 8, relationships: -18, energy: -5, integrity: 3 },
    category: "people",
    rightForeshadow: "Your phone buzzed three times that night. You didn't look.",
  },

  // --- VALUES ---
  {
    left: "Decline the contract",
    right: "Take the money",
    context: "A Fortune 500 wants your product — but with their branding, their data terms, and a feature that bends your architecture. The contract is $800K. Your team would have to stop everything else for two months.",
    leftEffect: { company: -15, relationships: -5, energy: 3, integrity: 10 },
    rightEffect: { company: 12, relationships: -3, energy: -5, integrity: -15 },
    category: "values",
  },
  {
    left: "Tell the team the truth",
    right: "Keep it to yourself",
    context: "Runway is 4 months. The team doesn't know — they think the raise is a formality. Morale is the highest it's ever been. Priya just posted on Slack about how excited she is for Q3.",
    leftEffect: { company: -8, relationships: 3, energy: -5, integrity: 10 },
    rightEffect: { company: 3, relationships: -10, energy: 5, integrity: -15 },
    category: "values",
    rightForeshadow: "Secrets have weight. You can feel it when you walk into the room.",
  },
  {
    left: "Say you were wrong",
    right: "Hold your ground",
    context: "The feature you championed against everyone's advice just cost the company its second-biggest client. The team is quiet in a way that feels loud. Priya won't look at you.",
    leftEffect: { company: -8, relationships: 8, energy: 3, integrity: -8 },
    rightEffect: { company: 3, relationships: -15, energy: -8, integrity: 8 },
    category: "values",
    leftForeshadow: "The room exhaled when you said it. Something shifted.",
  },
  {
    left: "Credit the engineer",
    right: "Take it yourself",
    context: "The feature that saved the quarter was your idea — the architecture, the positioning, the urgency. But your engineer built it in 72 hours of straight coding. The board asks: 'Whose work was this?'",
    leftEffect: { company: -8, relationships: 10, energy: 3, integrity: 8 },
    rightEffect: { company: 8, relationships: -15, energy: 3, integrity: -12 },
    category: "values",
  },
  {
    left: "Tell him the truth",
    right: "Buy yourself a quarter",
    context: "David leans forward on the Zoom. 'Will you hit Q3 numbers?' You won't — you're 30% behind. But the pipeline looks strong for Q4. He's deciding whether to lead your next round.",
    leftEffect: { company: -12, relationships: 5, energy: 3, integrity: 12 },
    rightEffect: { company: 5, relationships: -8, energy: -5, integrity: -18 },
    category: "values",
    rightForeshadow: "David nodded. But he wrote something down.",
  },
  {
    left: "Disclose the breach",
    right: "Fix it quietly",
    context: "3am. You're staring at a log file. Someone accessed 12,000 user records through an API endpoint that should have been locked. No one noticed. Disclosing this kills your Series B. Burying it might kill your sleep.",
    leftEffect: { company: -18, relationships: 3, energy: 3, integrity: 12 },
    rightEffect: { company: 5, relationships: -5, energy: -8, integrity: -20 },
    category: "values",
    rightForeshadow: "The log file is still there. Somewhere.",
  },

  // --- STRATEGY ---
  {
    left: "Take the meeting",
    right: "Decline",
    context: "A VP at Google wants to 'explore synergies.' Your team just shipped the best product of their lives. You know what 'explore synergies' means. Taking the meeting changes what you think about at 2am.",
    leftEffect: { company: 5, relationships: -12, energy: -8, integrity: -5 },
    rightEffect: { company: -5, relationships: 3, energy: 5, integrity: 5 },
    category: "strategy",
    leftForeshadow: "You blocked your calendar. Priya asked why.",
  },
  {
    left: "Bet on marketing",
    right: "Bet on engineering",
    context: "You have $1.2M left. A marketing agency showed you case studies — 10x pipeline in 60 days. But your lead engineer is burning out and begging for a hire. You can't afford both.",
    leftEffect: { company: 8, relationships: -8, energy: -5, integrity: -5 },
    rightEffect: { company: -8, relationships: 3, energy: 5, integrity: 3 },
    category: "strategy",
  },
  {
    left: "Take the money",
    right: "Stay independent",
    context: "An investor offers $5M at a $30M valuation. You think you're worth $50M. But you have 8 months of runway, and the market is getting colder. The term sheet expires Friday.",
    leftEffect: { company: 10, relationships: -10, energy: -5, integrity: -8 },
    rightEffect: { company: -5, relationships: 3, energy: 3, integrity: 8 },
    category: "strategy",
    rightForeshadow: "The bank balance doesn't lie. The clock is louder now.",
  },
  {
    left: "Accept the offer",
    right: "Walk away",
    context: "An acquisition offer is on the table: $45M. Clean exit. Everyone gets paid. But you ran the numbers — in 12 months you could be worth $80M. Your team hasn't slept a full night in six weeks.",
    leftEffect: { company: -3, relationships: 5, energy: 8, integrity: -5 },
    rightEffect: { company: 5, relationships: -12, energy: -12, integrity: -3 },
    category: "strategy",
  },

  // --- LIFE ---
  {
    left: "Go home",
    right: "Fix the demo",
    context: "The demo is broken and your biggest client needs it by 9am. Your partner texted 'dinner's ready' forty minutes ago. You haven't responded. The office is empty except for you.",
    leftEffect: { company: -15, relationships: 10, energy: 8, integrity: 3 },
    rightEffect: { company: 10, relationships: -15, energy: -15, integrity: -3 },
    category: "life",
    rightForeshadow: "By the time you got home, the food was in the fridge. The lights were off.",
  },
  {
    left: "Tell them to go home",
    right: "One more push",
    context: "Three people slept in the office this week. Elena's eyes are red. Marcus is on his fourth coffee and it's only Tuesday. But you're about to close the biggest deal of the year.",
    leftEffect: { company: -12, relationships: 5, energy: 10, integrity: 3 },
    rightEffect: { company: 10, relationships: -12, energy: -18, integrity: -5 },
    category: "life",
    rightForeshadow: "Elena's light was still on when you left. It's been on every night this week.",
  },
  {
    left: "Take a week off",
    right: "Push through",
    context: "You forgot your sister's birthday. You can't remember the last meal you didn't eat at your desk. The launch is in 7 days. Your hands are shaking when you type.",
    leftEffect: { company: -12, relationships: 3, energy: 15, integrity: 3 },
    rightEffect: { company: 8, relationships: -8, energy: -18, integrity: -3 },
    category: "life",
  },
  {
    left: "Go to the wedding",
    right: "Work the weekend",
    context: "Your college roommate's wedding is Saturday. You RSVP'd six months ago. Your Series B term sheet expires Monday. David wants 'one more conversation' before he signs.",
    leftEffect: { company: -15, relationships: 12, energy: 5, integrity: 5 },
    rightEffect: { company: 10, relationships: -18, energy: -8, integrity: -8 },
    category: "life",
  },

  // --- CONSEQUENCE TENSIONS ---
  // These only appear if you made a specific choice earlier. The game remembers.

  {
    left: "Promote from within",
    right: "Hire a replacement",
    context: "It's been two weeks since Marcus left. The team is quieter now. Someone needs to lead engineering, but your best candidate has only been here three months. The wrong choice splits the team again.",
    leftEffect: { company: -5, relationships: 8, energy: 3, integrity: 5 },
    rightEffect: { company: 5, relationships: -12, energy: -5, integrity: -3 },
    category: "people",
    requires: { choice: "Let him go" },
  },

  {
    left: "Text them",
    right: "Let it fade",
    context: "Your friend hasn't responded to your texts in three weeks. You saw on Instagram that they went to a concert with people from the office. Mutual friends keep asking what happened.",
    leftEffect: { company: -3, relationships: 8, energy: -5, integrity: 5 },
    rightEffect: { company: 3, relationships: -5, energy: 3, integrity: -8 },
    category: "people",
    requires: { choice: "Do what a CEO would do" },
  },

  {
    left: "Tell David everything",
    right: "Dig deeper",
    context: "David's analyst pulled the real numbers. They don't match what you told him. He hasn't called yet — but his assistant blocked an hour on your calendar for Thursday. No agenda.",
    leftEffect: { company: -15, relationships: 5, energy: -5, integrity: 12 },
    rightEffect: { company: 5, relationships: -15, energy: -10, integrity: -18 },
    category: "values",
    requires: { choice: "Buy yourself a quarter" },
  },

  {
    left: "Issue a recall",
    right: "Patch it overnight",
    context: "The bug you shipped caused data loss for 200 users. A tech blogger has screenshots. Your inbox has three emails with subject lines that start with 'Regarding the incident—'",
    leftEffect: { company: -18, relationships: 3, energy: -5, integrity: 10 },
    rightEffect: { company: -5, relationships: -8, energy: -3, integrity: -15 },
    category: "product",
    requires: { choice: "Ship it now" },
  },

  {
    left: "Bootstrap through it",
    right: "Call the investor back",
    context: "You turned down the money. Three months later, payroll is in 6 weeks and your pipeline is bone dry. The investor you rejected left a voicemail yesterday. 'No hard feelings. Let's talk.'",
    leftEffect: { company: -8, relationships: 5, energy: -10, integrity: 8 },
    rightEffect: { company: 10, relationships: -8, energy: -5, integrity: -10 },
    category: "strategy",
    requires: { choice: "Stay independent" },
  },

  {
    left: "Cover for her",
    right: "Find a replacement",
    context: "Elena stopped showing up. Three days now. Her team lead says she was crying in the parking lot last Friday. Her Slack status says 'away.' She was the best engineer you had.",
    leftEffect: { company: -10, relationships: 8, energy: -5, integrity: 5 },
    rightEffect: { company: 5, relationships: -15, energy: -3, integrity: -8 },
    category: "life",
    requires: { choice: "One more push" },
  },

  {
    left: "Deny the meeting happened",
    right: "Tell them the truth",
    context: "Someone leaked that you met with Google. Priya is standing in your doorway. Her arms are crossed. 'Were you going to tell us, or were we going to find out from Twitter?'",
    leftEffect: { company: 3, relationships: -12, energy: -3, integrity: -15 },
    rightEffect: { company: -5, relationships: 5, energy: -5, integrity: 8 },
    category: "values",
    requires: { choice: "Take the meeting" },
  },

  {
    left: "Resign before it breaks",
    right: "Fight it",
    context: "A security researcher found the breach you buried. They emailed you directly: '48 hours before I publish.' Your lawyer says you have options. Your stomach says you don't.",
    leftEffect: { company: -20, relationships: 5, energy: 5, integrity: 15 },
    rightEffect: { company: -5, relationships: -10, energy: -15, integrity: -10 },
    category: "values",
    requires: { choice: "Fix it quietly" },
  },
];

export const FONTS = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};
