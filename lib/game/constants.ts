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
  // Design principle: energy is the dimension you TRADE against other things.
  // Some choices save energy. Some destroy it. No dimension should drain on both sides of every tension.
  { left: "TRUST HIM", right: "TRUST YOURSELF", context: "Marcus says the competitor's product is better than yours. He wants to rebuild.", leftEffect: { company: -12, relationships: 8, energy: 3, integrity: 5 }, rightEffect: { company: 5, relationships: -15, energy: -8, integrity: -3 }, category: "product" },
  { left: "SHIP IT", right: "FIX IT", context: "The product has a bug you found an hour ago. The launch is in 30 minutes.", leftEffect: { company: 10, relationships: -8, energy: 3, integrity: -15 }, rightEffect: { company: -12, relationships: 3, energy: -8, integrity: 8 }, category: "product", leftForeshadow: "The bug is live now. Maybe nobody will notice." },
  { left: "PIVOT", right: "DOUBLE DOWN", context: "Your market is shrinking. But your existing customers love you. A new market is wide open.", leftEffect: { company: 5, relationships: -12, energy: -10, integrity: -5 }, rightEffect: { company: -8, relationships: 3, energy: 3, integrity: 5 }, category: "product" },
  { left: "COPY THEM", right: "IGNORE THEM", context: "Your competitor just launched the feature your users have been begging for. You could build it in two weeks.", leftEffect: { company: 8, relationships: -5, energy: -10, integrity: -12 }, rightEffect: { company: -10, relationships: 3, energy: 5, integrity: 8 }, category: "product" },

  // --- PEOPLE ---
  { left: "KEEP THEM", right: "LET THEM GO", context: "Your first engineer isn't keeping up. They were here before anyone else.", leftEffect: { company: -15, relationships: 5, energy: 3, integrity: 3 }, rightEffect: { company: 8, relationships: -18, energy: -5, integrity: -5 }, category: "people", rightForeshadow: "The team watched Marcus leave. They'll remember." },
  { left: "FORGIVE", right: "CONFRONT", context: "Your co-founder went behind your back and talked to the board. She says she was trying to help.", leftEffect: { company: -5, relationships: 5, energy: 5, integrity: -10 }, rightEffect: { company: -3, relationships: -15, energy: -8, integrity: 10 }, category: "people" },
  { left: "HIRE FAST", right: "HIRE RIGHT", context: "You need a head of sales yesterday. One candidate is available now. Another is perfect but available in 6 weeks.", leftEffect: { company: 8, relationships: -8, energy: 3, integrity: -8 }, rightEffect: { company: -10, relationships: 3, energy: -8, integrity: 5 }, category: "people" },
  { left: "FRIEND FIRST", right: "CEO FIRST", context: "Your best friend at the company isn't performing. Everyone knows it.", leftEffect: { company: -15, relationships: 8, energy: 3, integrity: -8 }, rightEffect: { company: 8, relationships: -18, energy: -5, integrity: 3 }, category: "people", rightForeshadow: "Your phone buzzed. You didn't look." },

  // --- VALUES ---
  { left: "PRINCIPLES", right: "PROFITS", context: "A massive client wants a feature that contradicts your product vision. The contract is $800K.", leftEffect: { company: -15, relationships: -5, energy: 3, integrity: 10 }, rightEffect: { company: 12, relationships: -3, energy: -5, integrity: -15 }, category: "values" },
  { left: "TRANSPARENT", right: "PROTECT THEM", context: "Runway is 4 months. The team doesn't know. Morale is high.", leftEffect: { company: -8, relationships: 3, energy: -5, integrity: 10 }, rightEffect: { company: 3, relationships: -10, energy: 5, integrity: -15 }, category: "values", rightForeshadow: "Secrets have weight. You can feel it in the room." },
  { left: "APOLOGIZE", right: "STAND FIRM", context: "You made a call that backfired. The team is angry. But you still believe it was right.", leftEffect: { company: -8, relationships: 8, energy: 3, integrity: -8 }, rightEffect: { company: 3, relationships: -15, energy: -8, integrity: 8 }, category: "values" },
  { left: "SHARE CREDIT", right: "TAKE CREDIT", context: "The feature that saved the quarter was your idea. But your engineer built it. The board wants to know who's responsible.", leftEffect: { company: -8, relationships: 10, energy: 3, integrity: 8 }, rightEffect: { company: 8, relationships: -15, energy: 3, integrity: -12 }, category: "values" },
  { left: "BE HONEST", right: "BUY TIME", context: "Your investor asks if you'll hit Q3 targets. You won't. But Q4 looks strong.", leftEffect: { company: -12, relationships: 5, energy: 3, integrity: 12 }, rightEffect: { company: 5, relationships: -8, energy: -5, integrity: -18 }, category: "values", rightForeshadow: "David nodded. But he wrote something down." },
  { left: "REPORT IT", right: "BURY IT", context: "You found a data breach. No users noticed. Disclosing it tanks your Series B.", leftEffect: { company: -18, relationships: 3, energy: 3, integrity: 12 }, rightEffect: { company: 5, relationships: -5, energy: -8, integrity: -20 }, category: "values", rightForeshadow: "The log file is still there. Somewhere." },

  // --- STRATEGY ---
  { left: "TAKE THE MEETING", right: "SKIP IT", context: "An acquirer wants to talk. Your team just hit their best quarter. Taking the meeting might distract everyone.", leftEffect: { company: 5, relationships: -12, energy: -8, integrity: -5 }, rightEffect: { company: -5, relationships: 3, energy: 5, integrity: 5 }, category: "strategy", leftForeshadow: "You blocked your calendar. Priya asked why." },
  { left: "SPEND IT", right: "SAVE IT", context: "You have $1.2M left. A marketing agency guarantees 10x pipeline. Your engineer needs a hire to stop burning out.", leftEffect: { company: 8, relationships: -8, energy: -5, integrity: -5 }, rightEffect: { company: -8, relationships: 3, energy: 5, integrity: 3 }, category: "strategy" },
  { left: "RAISE MONEY", right: "STAY LEAN", context: "An investor offers $5M at a valuation you don't love. You have 8 months of runway.", leftEffect: { company: 10, relationships: -10, energy: -5, integrity: -8 }, rightEffect: { company: -5, relationships: 3, energy: 3, integrity: 8 }, category: "strategy", rightForeshadow: "The bank balance doesn't lie. The clock is louder now." },
  { left: "ACCEPT", right: "NEGOTIATE", context: "An acquisition offer: $45M. You think it could be $80M in a year. Your team is tired.", leftEffect: { company: -3, relationships: 5, energy: 8, integrity: -5 }, rightEffect: { company: 5, relationships: -12, energy: -12, integrity: -3 }, category: "strategy" },

  // --- LIFE ---
  { left: "GO HOME", right: "STAY LATE", context: "The demo is broken. Your biggest client needs it tomorrow morning. Your partner made dinner.", leftEffect: { company: -15, relationships: 10, energy: 8, integrity: 3 }, rightEffect: { company: 10, relationships: -15, energy: -15, integrity: -3 }, category: "life" },
  { left: "SLOW DOWN", right: "PUSH HARDER", context: "Three people pulled all-nighters this week. You're about to close the biggest deal of the year.", leftEffect: { company: -12, relationships: 5, energy: 10, integrity: 3 }, rightEffect: { company: 10, relationships: -12, energy: -18, integrity: -5 }, category: "life", rightForeshadow: "Elena's light was still on when you left. It's been on every night this week." },
  { left: "REST", right: "ONE MORE WEEK", context: "You haven't slept more than 5 hours in two weeks. The product launch is in 7 days.", leftEffect: { company: -12, relationships: 3, energy: 15, integrity: 3 }, rightEffect: { company: 8, relationships: -8, energy: -18, integrity: -3 }, category: "life" },
  { left: "ATTEND", right: "CANCEL", context: "Your friend's wedding is this Saturday. Your Series B term sheet expires Monday.", leftEffect: { company: -15, relationships: 12, energy: 5, integrity: 5 }, rightEffect: { company: 10, relationships: -18, energy: -8, integrity: -8 }, category: "life" },

  // --- CONSEQUENCE TENSIONS ---
  // These only appear if you made a specific choice earlier. The game remembers.

  // You let your first engineer go → now face the fallout
  { left: "PROMOTE HER", right: "HIRE OUTSIDE", context: "Marcus is gone. The team is shaken. Someone needs to step up — but your best candidate has only been here three months.", leftEffect: { company: -5, relationships: 8, energy: 3, integrity: 5 }, rightEffect: { company: 5, relationships: -12, energy: -5, integrity: -3 }, category: "people", requires: { choice: "LET THEM GO" } },

  // You fired your friend → the aftermath
  { left: "REACH OUT", right: "MOVE ON", context: "Your friend hasn't responded to your texts in three weeks. Mutual friends are asking what happened.", leftEffect: { company: -3, relationships: 8, energy: -5, integrity: 5 }, rightEffect: { company: 3, relationships: -5, energy: 3, integrity: -8 }, category: "people", requires: { choice: "CEO FIRST" } },

  // You lied to your investor → it's catching up
  { left: "COME CLEAN", right: "DOUBLE DOWN", context: "David's analyst pulled the real numbers. He hasn't called yet. But he will.", leftEffect: { company: -15, relationships: 5, energy: -5, integrity: 12 }, rightEffect: { company: 5, relationships: -15, energy: -10, integrity: -18 }, category: "values", requires: { choice: "BUY TIME" } },

  // You shipped with the bug → it blew up
  { left: "RECALL IT", right: "PATCH QUIETLY", context: "The bug you shipped caused a data loss for 200 users. Tech blogs are asking questions.", leftEffect: { company: -18, relationships: 3, energy: -5, integrity: 10 }, rightEffect: { company: -5, relationships: -8, energy: -3, integrity: -15 }, category: "product", requires: { choice: "SHIP IT" } },

  // You stayed lean → the constraint is real now
  { left: "BOOTSTRAP IT", right: "CAVE IN", context: "You turned down the money. Now payroll is in 6 weeks and your pipeline is dry.", leftEffect: { company: -8, relationships: 5, energy: -10, integrity: 8 }, rightEffect: { company: 10, relationships: -8, energy: -5, integrity: -10 }, category: "strategy", requires: { choice: "STAY LEAN" } },

  // You pushed harder → someone broke
  { left: "COVER FOR THEM", right: "REPLACE THEM", context: "Elena stopped showing up. Three days now. Her team says she was crying in the parking lot.", leftEffect: { company: -10, relationships: 8, energy: -5, integrity: 5 }, rightEffect: { company: 5, relationships: -15, energy: -3, integrity: -8 }, category: "life", requires: { choice: "PUSH HARDER" } },

  // You took the acquisition meeting → the team found out
  { left: "DENY IT", right: "OWN IT", context: "Someone leaked that you took the meeting. Priya is at your door. 'Were you going to tell us?'", leftEffect: { company: 3, relationships: -12, energy: -3, integrity: -15 }, rightEffect: { company: -5, relationships: 5, energy: -5, integrity: 8 }, category: "values", requires: { choice: "TAKE THE MEETING" } },

  // You buried the data breach → someone found it
  { left: "RESIGN", right: "FIGHT IT", context: "A security researcher found the breach you buried. They're giving you 48 hours before they go public.", leftEffect: { company: -20, relationships: 5, energy: 5, integrity: 15 }, rightEffect: { company: -5, relationships: -10, energy: -15, integrity: -10 }, category: "values", requires: { choice: "BURY IT" } },
];

export const FONTS = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};
