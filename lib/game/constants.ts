import { Tension } from './types';

export const UNSPLASH_SCENES: Record<string, string> = {
  office_morning: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
  office_night: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
  coffee_shop: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
  boardroom: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=1200&q=80",
  apartment_night: "https://images.unsplash.com/photo-1536437075651-01d675529a6b?w=1200&q=80",
  rooftop: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
  airport: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&q=80",
  bar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80",
  coworking: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=1200&q=80",
  park_bench: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200&q=80",
  hospital: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
  elevator: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=1200&q=80",
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
  { left: "TRUST HIM", right: "TRUST YOURSELF", context: "Marcus says the competitor's product is better than yours. He wants to rebuild.", leftEffect: { company: -5, relationships: 10, energy: 0, integrity: 5 }, rightEffect: { company: 5, relationships: -8, energy: -5, integrity: 0 }, category: "product" },
  { left: "GO HOME", right: "STAY LATE", context: "The demo is broken. Your biggest client needs it tomorrow morning. Your partner made dinner.", leftEffect: { company: -10, relationships: 12, energy: 8, integrity: 3 }, rightEffect: { company: 10, relationships: -10, energy: -10, integrity: 0 }, category: "life" },
  { left: "SHIP IT", right: "FIX IT", context: "The product has a bug you found an hour ago. The launch is in 30 minutes.", leftEffect: { company: 8, relationships: -3, energy: 0, integrity: -10 }, rightEffect: { company: -5, relationships: 5, energy: -5, integrity: 10 }, category: "product" },
  { left: "KEEP THEM", right: "LET THEM GO", context: "Your first engineer isn't keeping up. They were here before anyone else.", leftEffect: { company: -8, relationships: 5, energy: -3, integrity: 5 }, rightEffect: { company: 8, relationships: -12, energy: -5, integrity: -3 }, category: "people" },
  { left: "PRINCIPLES", right: "PROFITS", context: "A massive client wants a feature that contradicts your product vision. The contract is $800K.", leftEffect: { company: -8, relationships: -3, energy: 0, integrity: 12 }, rightEffect: { company: 12, relationships: 3, energy: -3, integrity: -10 }, category: "values" },
  { left: "TRANSPARENT", right: "PROTECT THEM", context: "Runway is 4 months. The team doesn't know. Morale is high.", leftEffect: { company: -3, relationships: 5, energy: -5, integrity: 10 }, rightEffect: { company: 3, relationships: -5, energy: -3, integrity: -8 }, category: "values" },
  { left: "TAKE THE MEETING", right: "SKIP IT", context: "An acquirer wants to talk. Your team just hit their best quarter. Taking the meeting might distract everyone.", leftEffect: { company: 5, relationships: -8, energy: -5, integrity: -3 }, rightEffect: { company: -3, relationships: 5, energy: 3, integrity: 5 }, category: "strategy" },
  { left: "SLOW DOWN", right: "PUSH HARDER", context: "Three people pulled all-nighters this week. You're about to close the biggest deal of the year.", leftEffect: { company: -8, relationships: 8, energy: 10, integrity: 5 }, rightEffect: { company: 10, relationships: -10, energy: -12, integrity: -3 }, category: "life" },
  { left: "FORGIVE", right: "CONFRONT", context: "Your co-founder went behind your back and talked to the board. She says she was trying to help.", leftEffect: { company: 0, relationships: 8, energy: 3, integrity: -3 }, rightEffect: { company: 0, relationships: -8, energy: -5, integrity: 8 }, category: "people" },
  { left: "SPEND IT", right: "SAVE IT", context: "You have $1.2M left. A marketing agency guarantees 10x pipeline. Your engineer needs a hire to stop burning out.", leftEffect: { company: 8, relationships: -3, energy: -3, integrity: 0 }, rightEffect: { company: -3, relationships: 5, energy: 5, integrity: 3 }, category: "strategy" },
  { left: "APOLOGIZE", right: "STAND FIRM", context: "You made a call that backfired. The team is angry. But you still believe it was right.", leftEffect: { company: -3, relationships: 8, energy: 3, integrity: -5 }, rightEffect: { company: 3, relationships: -10, energy: -5, integrity: 8 }, category: "values" },
  { left: "HIRE FAST", right: "HIRE RIGHT", context: "You need a head of sales yesterday. One candidate is available now. Another is perfect but available in 6 weeks.", leftEffect: { company: 8, relationships: -3, energy: 3, integrity: -3 }, rightEffect: { company: -5, relationships: 5, energy: -5, integrity: 5 }, category: "people" },
  { left: "REST", right: "ONE MORE WEEK", context: "You haven't slept more than 5 hours in two weeks. The product launch is in 7 days.", leftEffect: { company: -8, relationships: 5, energy: 12, integrity: 3 }, rightEffect: { company: 8, relationships: -5, energy: -12, integrity: 0 }, category: "life" },
  { left: "SHARE CREDIT", right: "TAKE CREDIT", context: "The feature that saved the quarter was your idea. But your engineer built it. The board wants to know who's responsible.", leftEffect: { company: -3, relationships: 10, energy: 0, integrity: 8 }, rightEffect: { company: 5, relationships: -10, energy: 0, integrity: -8 }, category: "values" },
  { left: "RAISE MONEY", right: "STAY LEAN", context: "An investor offers $5M at a valuation you don't love. You have 8 months of runway.", leftEffect: { company: 10, relationships: -5, energy: -3, integrity: -3 }, rightEffect: { company: -3, relationships: 3, energy: -5, integrity: 8 }, category: "strategy" },
  { left: "PIVOT", right: "DOUBLE DOWN", context: "Your market is shrinking. But your existing customers love you. A new market is wide open.", leftEffect: { company: 5, relationships: -8, energy: -8, integrity: -3 }, rightEffect: { company: -3, relationships: 5, energy: -3, integrity: 5 }, category: "product" },
  { left: "FRIEND FIRST", right: "CEO FIRST", context: "Your best friend at the company isn't performing. Everyone knows it.", leftEffect: { company: -8, relationships: 8, energy: -3, integrity: -5 }, rightEffect: { company: 8, relationships: -12, energy: -5, integrity: 5 }, category: "people" },
  { left: "ACCEPT", right: "NEGOTIATE", context: "An acquisition offer: $45M. You think it could be $80M in a year. Your team is tired.", leftEffect: { company: 0, relationships: 8, energy: 8, integrity: 3 }, rightEffect: { company: 5, relationships: -8, energy: -8, integrity: 0 }, category: "strategy" },
  { left: "BE HONEST", right: "BUY TIME", context: "Your investor asks if you'll hit Q3 targets. You won't. But Q4 looks strong.", leftEffect: { company: -5, relationships: 5, energy: 0, integrity: 12 }, rightEffect: { company: 5, relationships: -3, energy: -3, integrity: -12 }, category: "values" },
  { left: "ATTEND", right: "CANCEL", context: "Your friend's wedding is this Saturday. Your Series B term sheet expires Monday.", leftEffect: { company: -8, relationships: 12, energy: 5, integrity: 5 }, rightEffect: { company: 8, relationships: -12, energy: -5, integrity: -5 }, category: "life" },
];

export const FONTS = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};
