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
    leftEffect: { company: -8, relationships: 8, energy: 3, integrity: 5 },
    rightEffect: { company: 5, relationships: -10, energy: -5, integrity: -3 },
    category: "product",
    leftForeshadow: "Marcus hasn't coded this fast in months.",
    interiority: "You watched his face while he presented. He already knows what you're going to say.",
    personalContext: "Marcus was the first person who believed in you.",
  },
  {
    left: "Ship it now",
    right: "Delay the launch",
    context: "You're staring at a bug in the login flow. It'll break for maybe 2% of users. The launch email goes out in 30 minutes. Marketing has been teasing this for three weeks.",
    leftEffect: { company: 10, relationships: -5, energy: 3, integrity: -10 },
    rightEffect: { company: -8, relationships: 3, energy: -5, integrity: 8 },
    category: "product",
    leftForeshadow: "The bug is live now. Maybe nobody will notice.",
    personalContext: "Three engineers pulled an all-nighter for this launch.",
  },
  {
    left: "Chase the new market",
    right: "Stay with who loves you",
    context: "Your customer NPS is 72. But the market is shrinking by 8% a quarter. Priya showed you a deck — there's an adjacent market ten times bigger. You'd be starting from zero.",
    leftEffect: { company: 7, relationships: -10, energy: -8, integrity: -3 },
    rightEffect: { company: -8, relationships: 5, energy: 3, integrity: 5 },
    category: "product",
    leftForeshadow: "Your best customers got an email today. They don't know yet.",
    personalContext: "Your first customer still emails you every Friday.",
  },
  {
    left: "Build their feature",
    right: "Build yours instead",
    context: "Your competitor launched smart notifications yesterday. Your Slack is full of users asking when you'll have it. But your roadmap has something better — something they haven't thought of yet.",
    leftEffect: { company: 10, relationships: -5, energy: -8, integrity: -10 },
    rightEffect: { company: -8, relationships: 5, energy: 5, integrity: 8 },
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
    leftEffect: { company: -10, relationships: 8, energy: 5, integrity: 5 },
    rightEffect: { company: 10, relationships: -12, energy: -3, integrity: -3 },
    category: "people",
    rightForeshadow: "The team watched him pack his desk. Nobody said goodbye.",
    interiority: "You've been rehearsing this conversation in the shower for a week.",
    personalContext: "He moved across the country for this job.",
  },
  {
    left: "Let it go",
    right: "Have the conversation",
    context: "Priya went behind your back. She called David — your investor — to 'give him context' before the board meeting. She says she was protecting you. David now has a version of events you didn't write.",
    leftEffect: { company: -3, relationships: 5, energy: 5, integrity: -8 },
    rightEffect: { company: -3, relationships: -10, energy: -3, integrity: 12 },
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
    leftEffect: { company: 8, relationships: -5, energy: 3, integrity: -5 },
    rightEffect: { company: -8, relationships: 5, energy: -5, integrity: 5 },
    category: "people",
  },
  {
    left: "Protect the friendship",
    right: "Do what a CEO would do",
    context: "Your best friend at the company — the one who moved across the country to join you — is the weakest performer on the team. Everyone can see it. Nobody will say it.",
    leftEffect: { company: -10, relationships: 10, energy: 5, integrity: -5 },
    rightEffect: { company: 10, relationships: -12, energy: -3, integrity: 5 },
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
    leftEffect: { company: -10, relationships: -3, energy: 5, integrity: 12 },
    rightEffect: { company: 12, relationships: -3, energy: -3, integrity: -12 },
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
    rightEffect: { company: 5, relationships: -8, energy: 5, integrity: -12 },
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
    rightEffect: { company: 5, relationships: -11, energy: -5, integrity: 10 },
    category: "values",
    leftForeshadow: "The room exhaled when you said it. Something shifted.",
    format: "observation",
  },
  {
    left: "Credit the engineer",
    right: "Take it yourself",
    context: "The feature that saved the quarter was your idea — the architecture, the positioning, the urgency. But your engineer built it in 72 hours of straight coding. The board asks: 'Whose work was this?'",
    leftEffect: { company: -5, relationships: 8, energy: 3, integrity: 5 },
    rightEffect: { company: 8, relationships: -10, energy: 3, integrity: -10 },
    category: "values",
  },
  {
    left: "Tell him the truth",
    right: "Buy yourself a quarter",
    context: "David leans forward on the Zoom. 'Will you hit Q3 numbers?' You won't — you're 30% behind. But the pipeline looks strong for Q4. He's deciding whether to lead your next round.",
    leftEffect: { company: -12, relationships: 5, energy: 3, integrity: 12 },
    rightEffect: { company: 8, relationships: -5, energy: -3, integrity: -12 },
    category: "values",
    rightForeshadow: "David nodded. But he wrote something down.",
    interiority: "Your mouth is dry. You take a sip of water before you answer.",
    personalContext: "David introduced you to your first three customers.",
  },
  {
    left: "Disclose the breach",
    right: "Fix it quietly",
    context: "3am. You're staring at a log file. Someone accessed 12,000 user records through an API endpoint that should have been locked. No one noticed. Disclosing this kills your Series B. Burying it might kill your sleep.",
    leftEffect: { company: -12, relationships: 5, energy: 5, integrity: 12 },
    rightEffect: { company: 8, relationships: -5, energy: -5, integrity: -12 },
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
    leftEffect: { company: 8, relationships: -10, energy: -5, integrity: -3 },
    rightEffect: { company: -5, relationships: 5, energy: 5, integrity: 5 },
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
    rightEffect: { company: 8, relationships: -10, energy: -10, integrity: -3 },
    category: "strategy",
    interiority: "You keep opening the term sheet and closing it. Open. Close. Open.",
    personalContext: "Twelve people would get life-changing money if you say yes.",
  },

  // --- LIFE ---
  {
    left: "Go home",
    right: "Fix the demo",
    context: "The demo is broken and your biggest client needs it by 9am. Your partner texted 'dinner's ready' forty minutes ago. You haven't responded. The office is empty except for you.",
    leftEffect: { company: -10, relationships: 10, energy: 8, integrity: 5 },
    rightEffect: { company: 10, relationships: -10, energy: -10, integrity: -3 },
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
    leftEffect: { company: -10, relationships: 8, energy: 10, integrity: 5 },
    rightEffect: { company: 10, relationships: -10, energy: -12, integrity: -3 },
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
    leftEffect: { company: -10, relationships: 5, energy: 12, integrity: 5 },
    rightEffect: { company: 10, relationships: -5, energy: -12, integrity: -3 },
    category: "life",
    format: "intimate",
    interiority: "Your hands are shaking. You watched them for ten seconds before you noticed.",
    personalContext: "Your doctor said 'burnout' last month. You didn't tell anyone.",
  },
  {
    left: "Go to the wedding",
    right: "Work the weekend",
    context: "Your college roommate's wedding is Saturday. You RSVP'd six months ago. Your Series B term sheet expires Monday. David wants 'one more conversation' before he signs.",
    leftEffect: { company: -10, relationships: 10, energy: 8, integrity: 5 },
    rightEffect: { company: 10, relationships: -10, energy: -5, integrity: -5 },
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
    leftEffect: { company: -5, relationships: 3, energy: -3, integrity: 3 },
    rightEffect: { company: -5, relationships: 3, energy: -3, integrity: 3 },
    category: "strategy",
    format: "forced",
    forcedChoice: "left",
    interiority: "You refreshed the news feed four times before you believed it.",
  },

  // --- FOURTH WALL MOMENT ---
  // Around week 14-17 (late Act 2), the game breaks. One moment that isn't about the company.
  // It's about the person playing. The silence after this one is the point.
  {
    left: "Reply",
    right: "Put the phone down",
    context: "Your phone buzzes. Not Slack. Not email. A text from someone you haven't talked to in a while. Not Marcus. Not Priya. Someone from before all this. 'Hey. Just thinking about you. Are you okay?'",
    leftEffect: { company: -3, relationships: 5, energy: 5, integrity: 3 },
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
    leftEffect: { company: -5, relationships: 5, energy: 8, integrity: 5 },
    rightEffect: { company: 3, relationships: -5, energy: -5, integrity: -3 },
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
    rightEffect: { company: 8, relationships: -10, energy: -3, integrity: -3 },
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
    leftEffect: { company: -10, relationships: 8, energy: -3, integrity: 12 },
    rightEffect: { company: 8, relationships: -11, energy: -8, integrity: -12 },
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
    leftEffect: { company: -12, relationships: 5, energy: -3, integrity: 12 },
    rightEffect: { company: -3, relationships: -8, energy: -3, integrity: -12 },
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
    leftEffect: { company: -5, relationships: 5, energy: -8, integrity: 10 },
    rightEffect: { company: 10, relationships: -5, energy: -5, integrity: -8 },
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
    rightEffect: { company: 8, relationships: -11, energy: -3, integrity: -5 },
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
    leftEffect: { company: 5, relationships: -10, energy: -3, integrity: -12 },
    rightEffect: { company: -3, relationships: 8, energy: -3, integrity: 10 },
    category: "values",
    requires: { choice: "Take the meeting" },
    interiority: "You felt your face get hot before you said anything.",
    callbackLine: "You took the meeting with Google. Someone found out.",
  },

  {
    left: "Resign before it breaks",
    right: "Fight it",
    context: "A security researcher found the breach you buried. They emailed you directly: '48 hours before I publish.' Your lawyer says you have options. Your stomach says you don't.",
    leftEffect: { company: -12, relationships: 5, energy: 5, integrity: 12 },
    rightEffect: { company: -3, relationships: -8, energy: -10, integrity: -8 },
    category: "values",
    requires: { choice: "Fix it quietly" },
    format: "email",
    sender: "Unknown",
    subject: "Responsible Disclosure — 48hr Notice",
    callbackLine: "You buried the breach. Someone just dug it up.",
  },

  // ============================================================
  // NEW TENSIONS — expanding the pool to 60+
  // ============================================================

  // --- PRODUCT (new) ---
  {
    left: "Kill the feature",
    right: "Let it ship ugly",
    context: "Marcus has the prototype on screen. The idea is right but the UI looks like a tax form. Elena's biggest prospect demo is tomorrow. Marcus says he needs four more days. Elena says four more days is four deals gone.",
    leftEffect: { company: -5, relationships: 5, energy: 3, integrity: 8 },
    rightEffect: { company: 8, relationships: -5, energy: -3, integrity: -5 },
    category: "product",
    personalContext: "This feature was your idea at 1am on a whiteboard.",
  },
  {
    left: "Open-source it",
    right: "Keep it proprietary",
    context: "Your internal tool for data pipelines is better than anything on the market. A developer community is already reverse-engineering your API. Priya wants to open-source it and build a moat around the ecosystem. David thinks you're giving away the farm.",
    leftEffect: { company: -8, relationships: 5, energy: 3, integrity: 8 },
    rightEffect: { company: 8, relationships: -3, energy: -3, integrity: -5 },
    category: "product",
    leftForeshadow: "The GitHub repo hit 500 stars overnight. Your inbox is different now.",
    personalContext: "Marcus built it on nights and weekends. He'd want it open.",
  },
  {
    left: "Sunset the old product",
    right: "Keep both alive",
    context: "Your v2 is better in every way. But 340 customers are still on v1 and they don't want to migrate. Supporting both is bleeding the engineering team dry — Marcus says it's like maintaining two different companies.",
    leftEffect: { company: 5, relationships: -8, energy: 5, integrity: -5 },
    rightEffect: { company: -5, relationships: 5, energy: -8, integrity: 3 },
    category: "product",
    rightForeshadow: "The v1 backlog grew again this sprint. It always grows.",
  },
  {
    left: "Launch the free tier",
    right: "Stay premium only",
    context: "Priya's been running the numbers on a freemium model. It would 10x your user base but cannibalize 15% of paid revenue. The spreadsheet is still open on her laptop and she's watching your face as you scroll.",
    leftEffect: { company: 5, relationships: 3, energy: -5, integrity: -3 },
    rightEffect: { company: -3, relationships: -3, energy: 3, integrity: 5 },
    category: "product",
    format: "slack",
    sender: "Priya",
    interiority: "The numbers make sense on paper. Nothing about this company has ever stayed on paper.",
  },
  {
    left: "Rebuild the mobile app",
    right: "Stick with responsive web",
    context: "Users are complaining. The mobile experience is duct-taped together — a responsive wrapper around a desktop product. Marcus wants three months and two new hires to build native. Elena says customers are leaving now, not in three months.",
    leftEffect: { company: -8, relationships: 3, energy: -5, integrity: 5 },
    rightEffect: { company: 5, relationships: -5, energy: 3, integrity: -3 },
    category: "product",
    personalContext: "Your last product review, a customer said 'I love it on desktop. I avoid it on my phone.'",
  },

  // --- PEOPLE (new) ---
  {
    left: "Give her the title",
    right: "Make her earn it",
    context: "Elena is standing in your office. She's been outselling everyone for six months and she wants 'VP of Sales' on her LinkedIn. She's not asking — she's telling you this is the last conversation before she starts taking calls from recruiters.",
    leftEffect: { company: 3, relationships: 8, energy: 3, integrity: -5 },
    rightEffect: { company: -3, relationships: -8, energy: -3, integrity: 8 },
    category: "people",
    rightForeshadow: "Elena updated her LinkedIn that night. She changed her title to 'Sales Lead.' Not VP.",
    interiority: "You can hear her phone buzzing. She silenced it without looking.",
    personalContext: "Elena turned down a job at Stripe to stay.",
  },
  {
    left: "Hire the expensive one",
    right: "Promote the junior",
    context: "The final two candidates for engineering manager are on the whiteboard. One is a senior from Meta — brilliant, expensive, starts in two weeks. The other is your junior dev who's been here since day one. She's raw but the team would walk through walls for her.",
    leftEffect: { company: 8, relationships: -8, energy: -3, integrity: -3 },
    rightEffect: { company: -5, relationships: 8, energy: 5, integrity: 5 },
    category: "people",
    personalContext: "The junior stayed when three other engineers left last quarter.",
  },
  {
    left: "Let the interns stay late",
    right: "Send them home at six",
    context: "Your two summer interns are crushing it. They're in the office until midnight voluntarily, shipping code, soaking it all in. Marcus loves mentoring them. But one of their parents called the office yesterday asking if everything was okay.",
    leftEffect: { company: 5, relationships: 3, energy: -5, integrity: -8 },
    rightEffect: { company: -3, relationships: 5, energy: 3, integrity: 8 },
    category: "people",
    format: "observation",
    interiority: "You remember being that age. You remember not knowing when to stop.",
  },
  {
    left: "Back Priya publicly",
    right: "Stay neutral",
    context: "Priya and Marcus are in a heated argument in the all-hands about technical direction. The room is watching you. Priya is right — you know it. But Marcus will take your siding against him as a betrayal. His jaw is already tight.",
    leftEffect: { company: 5, relationships: -8, energy: -3, integrity: 8 },
    rightEffect: { company: -3, relationships: 3, energy: 3, integrity: -5 },
    category: "people",
    personalContext: "Marcus told you last month he feels like the odd one out.",
  },
  {
    left: "Match the counter-offer",
    right: "Let her walk",
    context: "Elena got an offer from a competitor. 40% more equity, a VP title, a team twice this size. She's sitting across from you with the offer letter face-down on the table. She hasn't said anything yet.",
    leftEffect: { company: -5, relationships: 8, energy: -3, integrity: -3 },
    rightEffect: { company: -8, relationships: -8, energy: 3, integrity: 5 },
    category: "people",
    format: "intimate",
    interiority: "You already know what the letter says. You saw her face in the parking lot.",
    personalContext: "Elena closed the deal that kept the lights on last December.",
  },
  {
    left: "Introduce the PIP",
    right: "Give one more quarter",
    context: "Your head of marketing has been coasting for months. Nice person. Terrible results. The pipeline is drying up and three campaigns failed back to back. HR drafted a Performance Improvement Plan. It's sitting in your inbox.",
    leftEffect: { company: 5, relationships: -8, energy: -3, integrity: 5 },
    rightEffect: { company: -5, relationships: 5, energy: -5, integrity: -3 },
    category: "people",
    format: "email",
    sender: "HR",
    subject: "Draft PIP — Review Required",
    personalContext: "She recommended her best friend for a role here last month.",
  },

  // --- VALUES (new) ---
  {
    left: "Report the error",
    right: "Pocket the difference",
    context: "Your payment processor double-charged 800 customers. But the money landed in your account, not theirs. It's $47,000. Nobody's noticed yet. Your accountant is on vacation until Monday.",
    leftEffect: { company: -3, relationships: 3, energy: -3, integrity: 12 },
    rightEffect: { company: 8, relationships: -3, energy: 3, integrity: -12 },
    category: "values",
    format: "observation",
    interiority: "You refreshed the bank balance three times to be sure.",
  },
  {
    left: "Pull the ad",
    right: "Let it run",
    context: "Your marketing team created an ad that works incredibly well. Conversions are up 300%. The problem: it implies your product does something it doesn't quite do yet. It's not a lie. It's not the truth. It's the space between.",
    leftEffect: { company: -8, relationships: 3, energy: 3, integrity: 10 },
    rightEffect: { company: 10, relationships: -3, energy: -3, integrity: -8 },
    category: "values",
    leftForeshadow: "Conversions dropped 70% the next day. The truth is expensive.",
    personalContext: "Your first investor backed you because you were 'refreshingly honest.'",
  },
  {
    left: "Decline the interview",
    right: "Shape the narrative",
    context: "A journalist from TechCrunch wants to write a profile. She'll make you look great — she already has the angle. But she also wants to ask about the layoffs. You can steer it. You can't control it.",
    leftEffect: { company: -5, relationships: 3, energy: 5, integrity: 5 },
    rightEffect: { company: 8, relationships: -3, energy: -5, integrity: -5 },
    category: "values",
    format: "email",
    sender: "Maya Torres (TechCrunch)",
    subject: "Profile piece — quick chat?",
  },
  {
    left: "Give everyone the same raise",
    right: "Reward the top performers",
    context: "Budget review. You have enough for raises but not enough for fair ones. Equal raises feel right but your two best people will leave for companies that reward output. Performance-based raises will gut morale for the majority.",
    leftEffect: { company: -5, relationships: 5, energy: 3, integrity: 5 },
    rightEffect: { company: 5, relationships: -8, energy: -3, integrity: -3 },
    category: "values",
    interiority: "You stared at the spreadsheet until the numbers blurred.",
    personalContext: "Last all-hands you said 'we're a team, not a leaderboard.'",
  },
  {
    left: "Return the data",
    right: "Use it",
    context: "A former employee at your competitor accidentally sent you their customer list. 2,000 names, emails, contract values. Your sales team could close a quarter's worth of pipeline in a week. Nobody knows you have it.",
    leftEffect: { company: -8, relationships: 3, energy: 3, integrity: 12 },
    rightEffect: { company: 12, relationships: -3, energy: -3, integrity: -12 },
    category: "values",
    format: "email",
    sender: "Unknown Sender",
    subject: "RE: Q4 Account List (CONFIDENTIAL)",
    interiority: "You read three lines before you realized what you were looking at.",
  },

  // --- STRATEGY (new) ---
  {
    left: "Partner with them",
    right: "Go it alone",
    context: "A bigger company wants to integrate your product into their platform. It means 50,000 new users overnight — but you'd be a feature inside their ecosystem, not a standalone product. Priya calls it 'distribution.' Marcus calls it 'surrender.'",
    leftEffect: { company: 10, relationships: -5, energy: -3, integrity: -5 },
    rightEffect: { company: -5, relationships: 5, energy: 3, integrity: 5 },
    category: "strategy",
    leftForeshadow: "Your logo got smaller on their landing page. Then smaller again.",
    personalContext: "You told your team the mission was to 'own the category.'",
  },
  {
    left: "Raise now",
    right: "Wait for better terms",
    context: "David says the fundraising window is closing. Interest rates, geopolitics, the usual. He can get you a term sheet this week at $40M. Priya ran scenarios — if you wait three months and hit your targets, you're worth $65M. If you miss, you're worth nothing.",
    leftEffect: { company: 8, relationships: 3, energy: 5, integrity: -3 },
    rightEffect: { company: -5, relationships: -5, energy: -8, integrity: 5 },
    category: "strategy",
    format: "phone",
    sender: "David Chen",
    personalContext: "Priya whispered 'don't take it' as you picked up the phone.",
  },
  {
    left: "Expand to Europe",
    right: "Double down domestically",
    context: "Three enterprise customers in London want to sign. GDPR compliance will take eight weeks and $200K. Your domestic pipeline is strong but not growing. Elena has a suitcase packed and a flight booked pending your word.",
    leftEffect: { company: 5, relationships: -3, energy: -8, integrity: 3 },
    rightEffect: { company: 3, relationships: 3, energy: 5, integrity: -3 },
    category: "strategy",
    personalContext: "Elena already learned to say 'contract terms' in French.",
  },
  {
    left: "Pivot to enterprise",
    right: "Stay with SMBs",
    context: "Your three biggest customers are all enterprise. They pay 20x more than your SMBs and churn 4x less. But enterprise means 6-month sales cycles, a compliance team, and losing the scrappy culture that got you here. The whiteboard says 'who are we building for?'",
    leftEffect: { company: 8, relationships: -5, energy: -8, integrity: -3 },
    rightEffect: { company: -3, relationships: 5, energy: 3, integrity: 5 },
    category: "strategy",
    interiority: "You built this for the underdog. Now the underdogs can't afford you.",
    personalContext: "Your first customer was a five-person shop in Ohio.",
  },
  {
    left: "Hire a COO",
    right: "Keep running it yourself",
    context: "David pulls you aside after the board meeting. 'You're a great founder. You're a terrible operator.' He has someone in mind — experienced, expensive, connected. Priya would report to her. You would too, in a way.",
    leftEffect: { company: 8, relationships: -5, energy: 8, integrity: -3 },
    rightEffect: { company: -5, relationships: 5, energy: -10, integrity: 3 },
    category: "strategy",
    rightForeshadow: "The to-do list was three pages long by Friday. You finished half.",
    personalContext: "You haven't taken a full day off in seven months.",
  },

  // --- LIFE (new) ---
  {
    left: "See the doctor",
    right: "Not this week",
    context: "Your chest has been tight for three days. You Googled the symptoms at 2am and closed the tab. Your calendar has a board meeting, two customer calls, and a hiring panel. There's a cancellation slot at your doctor's office at 10am.",
    leftEffect: { company: -5, relationships: 3, energy: 8, integrity: 5 },
    rightEffect: { company: 3, relationships: -3, energy: -8, integrity: -5 },
    category: "life",
    format: "phone",
    sender: "Dr. Patel's Office",
    interiority: "You pressed on your chest and counted to ten. Then you opened Slack.",
    personalContext: "Your dad had a heart scare at 42. You're 38.",
  },
  {
    left: "Go to the recital",
    right: "Take the investor call",
    context: "Your daughter's piano recital is at 4pm. She's been practicing for weeks. David's partner — the one who writes the big checks — is only available at 4:15 for a call that could change everything. Your daughter asked this morning if you'd be in the front row.",
    leftEffect: { company: -8, relationships: 10, energy: 5, integrity: 5 },
    rightEffect: { company: 10, relationships: -10, energy: -3, integrity: -5 },
    category: "life",
    format: "intimate",
    interiority: "She played the first three bars for you last night. She didn't miss a note.",
    personalContext: "You missed her birthday party last year for a client dinner.",
  },
  {
    left: "Join the team dinner",
    right: "Finish the deck",
    context: "The team just closed the biggest quarter in company history. Elena booked a restaurant. Everyone is going. The board deck is due Monday and it's half-done. Priya texted 'you better not skip this one.'",
    leftEffect: { company: -3, relationships: 8, energy: 5, integrity: 3 },
    rightEffect: { company: 5, relationships: -8, energy: -5, integrity: -3 },
    category: "life",
    format: "slack",
    sender: "Elena",
    leftForeshadow: "Marcus told a joke. You laughed so hard you forgot about Monday.",
    personalContext: "Last team dinner, you left early. Nobody mentioned it, which was worse.",
  },
  {
    left: "Take the sabbatical",
    right: "Maybe next quarter",
    context: "Your therapist said it. Your partner said it. Your body said it — you fell asleep in a board meeting last Tuesday. Priya offered to cover for a month. She's ready. The question isn't whether you need it. It's whether you'll let yourself.",
    leftEffect: { company: -5, relationships: 5, energy: 12, integrity: 5 },
    rightEffect: { company: 3, relationships: -5, energy: -10, integrity: -3 },
    category: "life",
    format: "observation",
    interiority: "You opened the PTO form and stared at the 'start date' field for five minutes.",
    personalContext: "You haven't had a week off since you incorporated the company.",
  },
  {
    left: "Call your co-founder",
    right: "Handle it alone",
    context: "It's Sunday night. The numbers don't add up and you can't sleep. Priya's light is off — she went to her sister's wedding this weekend. You could figure this out alone by morning. Or you could call and ruin her night too.",
    leftEffect: { company: 3, relationships: -5, energy: 5, integrity: 3 },
    rightEffect: { company: -3, relationships: 3, energy: -8, integrity: -3 },
    category: "life",
    format: "intimate",
    interiority: "You picked up the phone. Put it down. Picked it up again.",
    personalContext: "Priya once told you: 'We're in this together. Don't be a hero.'",
  },

  // --- ADDITIONAL MIXED (product/people/values/strategy/life) ---
  {
    left: "Announce the pivot",
    right: "Test quietly first",
    context: "The data is clear — your core product is plateauing. Priya has a new direction that could reignite growth. Announcing it rallies the team but burns the bridge back. Testing quietly buys time but feels like you're hiding something.",
    leftEffect: { company: 5, relationships: 5, energy: -5, integrity: 3 },
    rightEffect: { company: -3, relationships: -5, energy: 3, integrity: -3 },
    category: "strategy",
    leftForeshadow: "The Slack channel exploded. Half excitement. Half terror.",
  },
  {
    left: "Apologize to the customer",
    right: "Stand behind the team",
    context: "Your biggest customer is on a Zoom call, furious. The implementation was late and buggy. They want someone fired. Marcus is sitting next to you, headphones half on, listening. He worked 80-hour weeks on this. It wasn't enough.",
    leftEffect: { company: 5, relationships: -5, energy: -5, integrity: -3 },
    rightEffect: { company: -8, relationships: 8, energy: 3, integrity: 5 },
    category: "people",
    format: "observation",
    interiority: "You could feel Marcus watching your mouth form the words.",
    personalContext: "This customer pays 18% of your revenue.",
  },
  {
    left: "Write the blog post",
    right: "Keep it internal",
    context: "You made a major mistake last quarter — a pricing change that cost you 40 customers. You learned from it. Priya wants to write a transparent blog post about what went wrong. It could build trust. It could also become ammo for competitors.",
    leftEffect: { company: -3, relationships: 5, energy: -3, integrity: 10 },
    rightEffect: { company: 5, relationships: -3, energy: 3, integrity: -5 },
    category: "values",
    personalContext: "The competitor's CEO already subtweeted about your churn.",
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
    narrativeTapDelay: 800,     // fast — you're falling forward
    breathe: 1200,              // breathing moments are brief
    compressDisplay: 1800,      // time skips feel light
    silence: 1200,              // brief pauses
    compressChance: 0.15,       // minimal compression — early weeks should HURT individually
    noCompressBefore: 5,        // no compression at all before week 5
    skipBreathingBefore: 4,     // no breathing moments weeks 1-3 — just choice → consequence → choice
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
  interiority: 'rgba(255,238,220,0.45)',   // warm off-white — inner voice has temperature
  context: 'rgba(255,255,255,0.75)',
  muted: 'rgba(255,255,255,0.3)',
  bg: '#0a0a0f',
  // Warmth — the human temperature of the game
  // Not white, not neon. Warm off-white like lamplight on paper.
  warm: 'rgba(255,238,210,0.6)',            // choice text — human warmth
  warmHover: 'rgba(255,244,225,0.9)',       // hover state — comes alive
  warmMuted: 'rgba(255,238,210,0.3)',       // subtle warm hint
  warmGlow: 'rgba(200,160,100,0.06)',       // background tint for milestone/surprise cards
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
