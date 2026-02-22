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
    interiority: "You watched his face while he presented. He already knows what you're going to say.",
    personalContext: "Marcus was the first person who believed in you.",
  },
  {
    left: "Ship it now",
    right: "Delay the launch",
    context: "You're staring at a bug in the login flow. It'll break for maybe 2% of users. The launch email goes out in 30 minutes. Marketing has been teasing this for three weeks.",
    leftEffect: { company: 10, relationships: -8, energy: 3, integrity: -15 },
    rightEffect: { company: -12, relationships: 3, energy: -8, integrity: 8 },
    category: "product",
    leftForeshadow: "The bug is live now. Maybe nobody will notice.",
    personalContext: "Three engineers pulled an all-nighter for this launch.",
  },
  {
    left: "Chase the new market",
    right: "Stay with who loves you",
    context: "Your customer NPS is 72. But the market is shrinking by 8% a quarter. Priya showed you a deck — there's an adjacent market ten times bigger. You'd be starting from zero.",
    leftEffect: { company: 5, relationships: -12, energy: -10, integrity: -5 },
    rightEffect: { company: -8, relationships: 3, energy: 3, integrity: 5 },
    category: "product",
    leftForeshadow: "Your best customers got an email today. They don't know yet.",
    personalContext: "Your first customer still emails you every Friday.",
  },
  {
    left: "Build their feature",
    right: "Build yours instead",
    context: "Your competitor launched smart notifications yesterday. Your Slack is full of users asking when you'll have it. But your roadmap has something better — something they haven't thought of yet.",
    leftEffect: { company: 8, relationships: -5, energy: -10, integrity: -12 },
    rightEffect: { company: -10, relationships: 3, energy: 5, integrity: 8 },
    category: "product",
    format: "slack",
    sender: "Marcus",
    interiority: "You scrolled past the Slack messages three times before you opened them.",
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
    interiority: "You've been rehearsing this conversation in the shower for a week.",
    personalContext: "He moved across the country for this job.",
  },
  {
    left: "Let it go",
    right: "Have the conversation",
    context: "Priya went behind your back. She called David — your investor — to 'give him context' before the board meeting. She says she was protecting you. David now has a version of events you didn't write.",
    leftEffect: { company: -5, relationships: 5, energy: 5, integrity: -10 },
    rightEffect: { company: -3, relationships: -15, energy: -8, integrity: 10 },
    category: "people",
    rightForeshadow: "Priya closed her laptop and left early. She didn't say goodnight.",
    format: "email",
    sender: "David Chen",
    subject: "Quick note re: board prep",
    personalContext: "Priya was at your wedding. She gave a speech.",
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
    interiority: "You noticed you've been avoiding eye contact with them all week.",
    personalContext: "They taught you to code in college.",
  },

  // --- VALUES ---
  {
    left: "Decline the contract",
    right: "Take the money",
    context: "A Fortune 500 wants your product — but with their branding, their data terms, and a feature that bends your architecture. The contract is $800K. Your team would have to stop everything else for two months.",
    leftEffect: { company: -15, relationships: -5, energy: 3, integrity: 10 },
    rightEffect: { company: 12, relationships: -3, energy: -5, integrity: -15 },
    category: "values",
    format: "email",
    sender: "Lisa Park (VP, Procurement)",
    subject: "Partnership Agreement — Final Terms",
  },
  {
    left: "Tell the team the truth",
    right: "Keep it to yourself",
    context: "Runway is 4 months. The team doesn't know — they think the raise is a formality. Morale is the highest it's ever been. Priya just posted on Slack about how excited she is for Q3.",
    leftEffect: { company: -8, relationships: 3, energy: -5, integrity: 10 },
    rightEffect: { company: 3, relationships: -10, energy: 5, integrity: -15 },
    category: "values",
    rightForeshadow: "Secrets have weight. You can feel it when you walk into the room.",
    interiority: "You opened your mouth in the standup. Then closed it. Nobody noticed.",
    personalContext: "Priya just posted about Q3 with three exclamation marks.",
  },
  {
    left: "Say you were wrong",
    right: "Hold your ground",
    context: "The feature you championed against everyone's advice just cost the company its second-biggest client. The team is quiet in a way that feels loud. Priya won't look at you.",
    leftEffect: { company: -8, relationships: 8, energy: 3, integrity: -8 },
    rightEffect: { company: 3, relationships: -15, energy: -8, integrity: 8 },
    category: "values",
    leftForeshadow: "The room exhaled when you said it. Something shifted.",
    format: "observation",
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
    interiority: "Your mouth is dry. You take a sip of water before you answer.",
    personalContext: "David introduced you to your first three customers.",
  },
  {
    left: "Disclose the breach",
    right: "Fix it quietly",
    context: "3am. You're staring at a log file. Someone accessed 12,000 user records through an API endpoint that should have been locked. No one noticed. Disclosing this kills your Series B. Burying it might kill your sleep.",
    leftEffect: { company: -18, relationships: 3, energy: 3, integrity: 12 },
    rightEffect: { company: 5, relationships: -5, energy: -8, integrity: -20 },
    category: "values",
    rightForeshadow: "The log file is still there. Somewhere.",
    format: "phone",
    sender: "PagerDuty",
    personalContext: "Your security engineer quit last month. This was supposed to be on their list.",
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
    format: "email",
    sender: "Sarah Kim (Google)",
    subject: "Coffee next week?",
    personalContext: "You told the team last month: 'We're building for the long game.'",
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
    personalContext: "Your co-founder remortgaged her house for the last round.",
  },
  {
    left: "Accept the offer",
    right: "Walk away",
    context: "An acquisition offer is on the table: $45M. Clean exit. Everyone gets paid. But you ran the numbers — in 12 months you could be worth $80M. Your team hasn't slept a full night in six weeks.",
    leftEffect: { company: -3, relationships: 5, energy: 8, integrity: -5 },
    rightEffect: { company: 5, relationships: -12, energy: -12, integrity: -3 },
    category: "strategy",
    interiority: "You keep opening the term sheet and closing it. Open. Close. Open.",
    personalContext: "Twelve people would get life-changing money if you say yes.",
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
    format: "phone",
    sender: "Home",
    personalContext: "Last week, your partner said: 'I miss who you were before this.'",
  },
  {
    left: "Tell them to go home",
    right: "One more push",
    context: "Three people slept in the office this week. Elena's eyes are red. Marcus is on his fourth coffee and it's only Tuesday. But you're about to close the biggest deal of the year.",
    leftEffect: { company: -12, relationships: 5, energy: 10, integrity: 3 },
    rightEffect: { company: 10, relationships: -12, energy: -18, integrity: -5 },
    category: "life",
    rightForeshadow: "Elena's light was still on when you left. It's been on every night this week.",
    format: "observation",
    interiority: "You noticed Elena hasn't laughed in two weeks.",
    personalContext: "Elena has a two-year-old at home.",
  },
  {
    left: "Take a week off",
    right: "Push through",
    context: "You forgot your sister's birthday. You can't remember the last meal you didn't eat at your desk. The launch is in 7 days. Your hands are shaking when you type.",
    leftEffect: { company: -12, relationships: 3, energy: 15, integrity: 3 },
    rightEffect: { company: 8, relationships: -8, energy: -18, integrity: -3 },
    category: "life",
    format: "intimate",
    interiority: "Your hands are shaking. You watched them for ten seconds before you noticed.",
    personalContext: "Your doctor said 'burnout' last month. You didn't tell anyone.",
  },
  {
    left: "Go to the wedding",
    right: "Work the weekend",
    context: "Your college roommate's wedding is Saturday. You RSVP'd six months ago. Your Series B term sheet expires Monday. David wants 'one more conversation' before he signs.",
    leftEffect: { company: -15, relationships: 12, energy: 5, integrity: 5 },
    rightEffect: { company: 10, relationships: -18, energy: -8, integrity: -8 },
    category: "life",
  },

  // --- INTIMATE TENSIONS ---
  // One sentence. The weight is in what's unsaid.
  {
    left: "Answer it",
    right: "Let it ring",
    context: "Your phone is ringing. It's your dad.",
    leftEffect: { company: -5, relationships: 8, energy: -3, integrity: 3 },
    rightEffect: { company: 3, relationships: -8, energy: 3, integrity: -5 },
    category: "life",
    format: "intimate",
    interiority: "He never calls during the day.",
    personalContext: "You haven't called him in three months.",
  },
  {
    left: "Read it",
    right: "Close the tab",
    context: "Someone posted your company in a 'startups that will die this year' thread.",
    leftEffect: { company: -3, relationships: -3, energy: -8, integrity: 3 },
    rightEffect: { company: 3, relationships: 3, energy: 5, integrity: -3 },
    category: "life",
    format: "intimate",
  },
  {
    left: "Say something",
    right: "Pretend you didn't hear",
    context: "You overheard Marcus in the kitchen: 'I don't think they know what they're doing anymore.'",
    leftEffect: { company: 3, relationships: -10, energy: -5, integrity: 8 },
    rightEffect: { company: -3, relationships: -5, energy: -8, integrity: -8 },
    category: "people",
    format: "observation",
    interiority: "Your coffee went cold while you stood there.",
    personalContext: "Six months ago, Marcus told his wife this was the best job he'd ever had.",
  },

  // --- FORCED-CHOICE MOMENTS ---
  // Sometimes you don't get to choose. The world decided for you.
  {
    left: "Okay",
    right: "Okay",
    context: "Your co-founder just told you she's pregnant. She's taking three months off starting next week. There's nothing to decide. There's just what comes next.",
    leftEffect: { company: -8, relationships: 5, energy: -5, integrity: 5 },
    rightEffect: { company: -8, relationships: 5, energy: -5, integrity: 5 },
    category: "life",
    format: "forced",
    forcedChoice: "left",
    interiority: "You smiled. You meant it. Then you did the math.",
  },
  {
    left: "Continue",
    right: "Continue",
    context: "The market crashed 12% overnight. Every startup in your space lost a third of their valuation. Your investor's fund is pausing new checks. This isn't about you. It's about everyone.",
    leftEffect: { company: -10, relationships: -3, energy: -8, integrity: 0 },
    rightEffect: { company: -10, relationships: -3, energy: -8, integrity: 0 },
    category: "strategy",
    format: "forced",
    forcedChoice: "left",
    interiority: "You refreshed the news feed four times before you believed it.",
  },

  // --- FOURTH WALL MOMENT ---
  // Around week 28-35, the game breaks. One moment that isn't about the company.
  // It's about the person playing. The silence after this one is the point.
  {
    left: "Reply",
    right: "Put the phone down",
    context: "Your phone buzzes. Not Slack. Not email. A text from someone you haven't talked to in a while. Not Marcus. Not Priya. Someone from before all this. 'Hey. Just thinking about you. Are you okay?'",
    leftEffect: { company: -3, relationships: 5, energy: 8, integrity: 3 },
    rightEffect: { company: 3, relationships: -3, energy: -5, integrity: -3 },
    category: "life",
    format: "intimate",
    interiority: "You stared at the screen for a long time.",
    personalContext: "You used to talk every week.",
    fourthWall: true,
  },
  {
    left: "Go",
    right: "You can't",
    context: "There's a voicemail from your mother. She didn't ask about the company. She asked if you were eating. She asked if you were sleeping. She said she saw your face on a screen somewhere and you looked tired.",
    leftEffect: { company: -5, relationships: 8, energy: 10, integrity: 5 },
    rightEffect: { company: 3, relationships: -8, energy: -8, integrity: -3 },
    category: "life",
    format: "intimate",
    interiority: "You listened to it twice. Then once more.",
    personalContext: "She still thinks you work at that other place.",
    fourthWall: true,
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
    callbackLine: "You let Marcus go. Now his desk is empty and engineering has no lead.",
  },

  {
    left: "Text them",
    right: "Let it fade",
    context: "Your friend hasn't responded to your texts in three weeks. You saw on Instagram that they went to a concert with people from the office. Mutual friends keep asking what happened.",
    leftEffect: { company: -3, relationships: 8, energy: -5, integrity: 5 },
    rightEffect: { company: 3, relationships: -5, energy: 3, integrity: -8 },
    category: "people",
    requires: { choice: "Do what a CEO would do" },
    format: "intimate",
    interiority: "You typed 'hey' and deleted it. Twice.",
    callbackLine: "You chose the CEO move over the friendship. Now the silence is louder.",
  },

  {
    left: "Tell David everything",
    right: "Dig deeper",
    context: "David's analyst pulled the real numbers. They don't match what you told him. He hasn't called yet — but his assistant blocked an hour on your calendar for Thursday. No agenda.",
    leftEffect: { company: -15, relationships: 5, energy: -5, integrity: 12 },
    rightEffect: { company: 5, relationships: -15, energy: -10, integrity: -18 },
    category: "values",
    requires: { choice: "Buy yourself a quarter" },
    format: "phone",
    sender: "David's Office",
    callbackLine: "You told David you'd hit Q3 numbers. You didn't. Now his analyst knows.",
  },

  {
    left: "Issue a recall",
    right: "Patch it overnight",
    context: "The bug you shipped caused data loss for 200 users. A tech blogger has screenshots. Your inbox has three emails with subject lines that start with 'Regarding the incident—'",
    leftEffect: { company: -18, relationships: 3, energy: -5, integrity: 10 },
    rightEffect: { company: -5, relationships: -8, energy: -3, integrity: -15 },
    category: "product",
    requires: { choice: "Ship it now" },
    format: "email",
    sender: "support@meridian.io",
    subject: "Fwd: URGENT — data loss report (x3)",
    callbackLine: "You shipped the bug. 200 users just found out.",
  },

  {
    left: "Bootstrap through it",
    right: "Call the investor back",
    context: "You turned down the money. Three months later, payroll is in 6 weeks and your pipeline is bone dry. The investor you rejected left a voicemail yesterday. 'No hard feelings. Let's talk.'",
    leftEffect: { company: -8, relationships: 5, energy: -10, integrity: 8 },
    rightEffect: { company: 10, relationships: -8, energy: -5, integrity: -10 },
    category: "strategy",
    requires: { choice: "Stay independent" },
    format: "phone",
    sender: "Missed Call",
    interiority: "You listened to the voicemail three times. His voice was kind. That made it worse.",
    callbackLine: "You turned down the money. Independence felt different when payroll was real.",
  },

  {
    left: "Cover for her",
    right: "Find a replacement",
    context: "Elena stopped showing up. Three days now. Her team lead says she was crying in the parking lot last Friday. Her Slack status says 'away.' She was the best engineer you had.",
    leftEffect: { company: -10, relationships: 8, energy: -5, integrity: 5 },
    rightEffect: { company: 5, relationships: -15, energy: -3, integrity: -8 },
    category: "life",
    requires: { choice: "One more push" },
    format: "slack",
    sender: "Elena's Team Lead",
    callbackLine: "You pushed the team one more time. Elena didn't come back.",
  },

  {
    left: "Deny the meeting happened",
    right: "Tell them the truth",
    context: "Someone leaked that you met with Google. Priya is standing in your doorway. Her arms are crossed. 'Were you going to tell us, or were we going to find out from Twitter?'",
    leftEffect: { company: 3, relationships: -12, energy: -3, integrity: -15 },
    rightEffect: { company: -5, relationships: 5, energy: -5, integrity: 8 },
    category: "values",
    requires: { choice: "Take the meeting" },
    interiority: "You felt your face get hot before you said anything.",
    callbackLine: "You took the meeting with Google. Someone found out.",
  },

  {
    left: "Resign before it breaks",
    right: "Fight it",
    context: "A security researcher found the breach you buried. They emailed you directly: '48 hours before I publish.' Your lawyer says you have options. Your stomach says you don't.",
    leftEffect: { company: -20, relationships: 5, energy: 5, integrity: 15 },
    rightEffect: { company: -5, relationships: -10, energy: -15, integrity: -10 },
    category: "values",
    requires: { choice: "Fix it quietly" },
    format: "email",
    sender: "Unknown",
    subject: "Responsible Disclosure — 48hr Notice",
    callbackLine: "You buried the breach. Someone just dug it up.",
  },
];

// --- COMPRESSION SUMMARIES ---
// One line per skipped week, keyed to game state + act. Handwritten, not AI-generated.
export const COMPRESSION_LINES: Record<string, string[]> = {
  act1_good: [
    "Elena closed two deals. Marcus pushed a clean build.",
    "The office had a good hum. Someone brought donuts.",
    "Three new hires started. The energy was contagious.",
    "David sent a thumbs up emoji. No context. Good sign.",
    "Priya presented to the team. Standing ovation.",
    "Product velocity was the highest it's been.",
  ],
  act1_rough: [
    "Onboarding was rocky. Two hires already seem wrong.",
    "The product demo crashed in front of a prospect.",
    "Marcus and Priya had a disagreement about priorities.",
    "You spent the week in back-to-back meetings. No building.",
    "A customer churned. The support ticket went unanswered.",
  ],
  act2_holding: [
    "The team found its rhythm. Quiet weeks. Good weeks.",
    "Elena hit quota three weeks early. She didn't celebrate.",
    "Board prep took the whole week. David had follow-up questions.",
    "A competitor launched something mediocre. You felt relieved, then guilty.",
    "Priya reorganized the roadmap. Nobody complained.",
  ],
  act2_grinding: [
    "Three people asked for raises. You could only say yes to one.",
    "The all-hands was quiet. Too many open laptops.",
    "Marcus went on PTO. The deploys slowed immediately.",
    "You ate lunch at your desk every day this week.",
    "An engineer asked if the company was okay. You said yes too fast.",
  ],
  act3_hope: [
    "The product started selling itself. Inbound was up 40%.",
    "You caught yourself smiling at your desk for no reason.",
    "David's tone shifted. He started talking about 'the long game.'",
    "An old customer emailed to say thank you. No ask attached.",
    "The team shipped without you asking. That's when you knew.",
  ],
  act3_heavy: [
    "You sat in the parking lot for ten minutes before going in.",
    "The office felt smaller. Or maybe you just needed air.",
    "Your co-founder's birthday was last week. You forgot.",
    "The financials looked fine. You didn't feel fine.",
    "Someone left a resignation letter on your desk. You read it twice.",
  ],
  burnout: [
    "You slept at the office. Again.",
    "Your hands were shaking during the morning standup.",
    "You cancelled a doctor's appointment. Third time this month.",
    "The coffee didn't help anymore. Nothing helped.",
    "You stared at your screen for forty minutes without typing.",
  ],
  isolation: [
    "Lunch was quiet. Nobody invited you.",
    "Marcus walked past your office without looking up.",
    "The team Slack had a channel you weren't in.",
    "Priya stopped scheduling 1:1s. You didn't ask why.",
    "The only notifications were from investors.",
  ],
  compromise: [
    "You deleted an email before reading it. You knew what it said.",
    "The numbers looked good. The method didn't.",
    "Someone asked how you sleep at night. You laughed. They didn't.",
    "The press release said 'industry-leading.' You wrote it yourself.",
    "An old mentor called. You let it go to voicemail.",
  ],
  momentum: [
    "Revenue was up again. The graphs were pointing right.",
    "A Series B term sheet arrived. You didn't open it immediately.",
    "The pipeline was full. For the first time, you weren't worried about money.",
    "A major publication asked for an interview. You said next month.",
    "The board meeting lasted twelve minutes. That's a good sign.",
  ],
};

export const FONTS = {
  display: "'DM Sans', 'Helvetica Neue', sans-serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

export const TEMPO = {
  silence: 1800,         // blank screen after heavy choices
  breathe: 2200,         // breathing moment display
  consequenceDelay: 600, // pause before consequence tensions
  fadeOut: 300,          // screen transition fade out
  fadeIn: 250,           // screen transition fade in
  holdBlack: 150,        // hold on black between screens
  choiceReveal: 800,     // delay before choices appear (default)
  choiceRevealHigh: 1800,// delay for high-stakes
  choiceRevealCrit: 2500,// delay for critical / consequence
  narrativeSpeed: 25,    // typewriter ms per character (default)
  intimateSpeed: 45,     // typewriter for intimate format
  criticalSpeed: 35,     // typewriter for critical stakes
  fastNarrative: 15,     // typewriter for short text
  narrativeTapDelay: 1500,// delay before showing "tap to continue"
  milestoneDisplay: 2200,// how long milestone stays (inline, not blocking)
  surpriseDisplay: 2500, // how long surprise event stays
  surpriseResolve: 2000, // delay after surprise before next tension
  compressDisplay: 2200, // time compression animation
  endingDelay: 3000,     // delay before transitioning to endgame
  forcedChoiceDelay: 2000,// auto-select delay for forced choices
};

// Act-scaled tempo — the game's heartbeat changes shape
// Act 1: quick, energetic, you're learning the rhythm
// Act 2: heavier, the grind has weight, moments linger
// Act 3: vast, silences expand, less text, more void
export function getActTempo(act: 1 | 2 | 3) {
  if (act === 1) return {
    narrativeTapDelay: 1200,    // quick — keep the energy up
    breathe: 1800,              // short breathing moments
    compressDisplay: 1800,      // time skips feel light
    silence: 1200,              // brief pauses
    compressChance: 0.15,       // minimal compression — early weeks should HURT individually
    noCompressBefore: 5,        // no compression at all before week 5
  };
  if (act === 2) return {
    narrativeTapDelay: 1800,    // heavier — let choices sink in
    breathe: 2500,              // breathing moments drag
    compressDisplay: 2500,      // time skips feel weighted
    silence: 2200,              // silence has more gravity
    compressChance: 0.45,       // moderate compression
  };
  // Act 3
  return {
    narrativeTapDelay: 2500,    // vast — silence between moments
    breathe: 3200,              // breathing moments are meditative
    compressDisplay: 3000,      // the world slows down
    silence: 3500,              // long silences, like you can hear yourself think
    compressChance: 0.35,       // fewer skips — every week matters now
  };
}

// Earned silence: after truly heavy choices, replace breathing moments with void
// Returns true if this moment deserves darkness instead of a breathing quote
export function shouldEarnSilence(week: number, stakes: string, isConsequence: boolean): boolean {
  const act = week <= 7 ? 1 : week <= 17 ? 2 : 3;
  // Act 1: never — you're still learning
  if (act === 1) return false;
  // Act 2: only after consequence tensions
  if (act === 2) return isConsequence;
  // Act 3: after any high-stakes or critical choice
  return stakes === 'critical' || stakes === 'high' || isConsequence;
}

// Dashboard visibility by act — the HUD dissolves as you go deeper
// Returns opacity values for different dashboard sections
export function getDashboardVisibility(week: number) {
  const act = week <= 7 ? 1 : week <= 17 ? 2 : 3;
  if (act === 1) return {
    header: 1.0,       // full header
    dims: 1.0,         // all dim bars visible
    dimValues: true,    // show numeric values
    timeline: 1.0,     // full timeline
    cash: 1.0,         // cash visible
    weekCount: true,    // show "Week X of 24"
    overall: 1.0,      // full dashboard opacity
  };
  if (act === 2) return {
    header: 0.9,
    dims: 0.85,
    dimValues: true,    // still show numbers
    timeline: 0.7,     // timeline fading
    cash: 0.9,
    weekCount: true,
    overall: 0.85,
  };
  // Act 3: minimal. You're not managing anymore. You're just... here.
  return {
    header: 0.7,
    dims: 0.5,         // bars barely visible
    dimValues: false,   // no more numbers — you feel it, you don't measure it
    timeline: 0.3,     // timeline almost gone
    cash: week > 21 ? 0.3 : 0.5,  // cash fades further in final weeks
    weekCount: false,   // no more "Week X of 24"
    overall: 0.5,       // the whole dashboard is a ghost
  };
}

export const COLORS = {
  // Dimension health — centralized from DimBar, CEOCard, ShareImage
  healthy: { bar: 'rgba(134,239,172,0.6)', text: 'rgba(134,239,172,0.9)' },
  warning: { bar: 'rgba(253,224,71,0.5)', text: 'rgba(253,224,71,0.85)' },
  danger:  { bar: 'rgba(248,113,113,0.6)', text: 'rgba(248,113,113,0.95)' },
  // Semantic text colors
  foreshadow: 'rgba(255,255,255,0.25)',
  interiority: 'rgba(255,255,255,0.4)',
  context: 'rgba(255,255,255,0.75)',
  muted: 'rgba(255,255,255,0.3)',
  bg: '#0a0a0f',
};

// Shared helper: dimension value → color
export function dimColor(value: number): string {
  if (value > 60) return COLORS.healthy.text;
  if (value > 30) return COLORS.warning.text;
  return COLORS.danger.text;
}

// Shared helper: dimension value → bar color
export function dimBarColor(value: number): string {
  if (value > 60) return COLORS.healthy.bar;
  if (value > 30) return COLORS.warning.bar;
  return COLORS.danger.bar;
}

// Shared helper: week emoji → dot color
export function weekDotColor(emoji: string): string {
  if (emoji === "🟩" || emoji === "🏆") return COLORS.healthy.text;
  if (emoji === "🟨") return COLORS.warning.text;
  if (emoji === "🟥") return COLORS.danger.text;
  if (emoji === "💀") return "rgba(248,113,113,1)";
  return "rgba(255,255,255,0.2)";
}
