import type { Prospect, ProspectActivity, ProspectMetricProps } from "@/components/prospecting";
export const prospects: Prospect[] = [
  { id: "sarah", name: "Sarah Chen", role: "VP Sales", company: "Ledgerly", color: "pink", signal: "Raised $40M Series B", signalType: "funding", score: 92 },
  { id: "daniel", name: "Daniel Brooks", role: "Chief Revenue Officer", company: "Verdant", color: "mint", signal: "New in role · 34 days", signalType: "role", score: 90 },
  { id: "aisha", name: "Aisha Bello", role: "VP Sales", company: "Tidewater Analytics", color: "orange", signal: "Launched AI product", signalType: "launch", score: 83 },
  { id: "oliver", name: "Oliver Grant", role: "Head of Revenue", company: "Parcelio", color: "purple", signal: "Expanding to EU", signalType: "expansion", score: 79 },
  { id: "samuel", name: "Samuel Ortiz", role: "VP Sales", company: "Plinth", signal: "Visited pricing page", signalType: "intent", score: 76 },
  { id: "ryan", name: "Ryan Walsh", role: "Director of Sales", company: "Kinto", color: "blue", signal: "Headcount +18%", signalType: "growth", score: 71 },
  { id: "elena", name: "Elena Vasquez", role: "VP Revenue", company: "Forma", color: "brown", signal: "Opened London office", signalType: "expansion", score: 69 },
  { id: "marco", name: "Marco Silva", role: "Sales Director", company: "Fathom", color: "mint", signal: "Hiring 12 sales roles", signalType: "growth", score: 66 },
];
export const activities: ProspectActivity[] = [
  { id: "reply", title: "Priya Raman replied to “Quick question about Fathom’s SDR ramp”", detail: "12 min ago · Series B — VP Sales", icon: "corner-down-right", tone: "mint" },
  { id: "meeting", title: "Meeting booked with Elena Vasquez for Thu, Oct 15", detail: "1h ago · Marco Silva", icon: "calendar", tone: "purple" },
  { id: "enriched", title: "24 prospects enriched · 22 verified emails", detail: "2h ago · Enrichment", icon: "plug" },
  { id: "campaign", title: "“UK Revenue Leaders” started for 12 prospects", detail: "3h ago · Leah Moss", icon: "plane" },
  { id: "matches", title: "AI found 38 new matches for “Series B — VP Sales”", detail: "7:00 AM · Saved search", icon: "sparkle", tone: "purple" },
];
export const metrics: Record<"7" | "30", ProspectMetricProps[]> = {
  "7": [
    { label: "Prospects discovered", value: "1,284", change: "+18%", description: "vs. 1,088 prior 7 days" },
    { label: "Qualified (score ≥ 80)", value: "342", change: "+12%", description: "27% of discovered", bars: [9, 68, 81, 92, 96, 87] },
    { label: "Replies", value: "54", change: "+9%", description: "8.6% reply rate", bars: [8, 73, 92, 82, 95, 78] },
    { label: "Meetings booked", value: "20", change: "+5", description: "vs. 15 prior 7 days", bars: [9, 51, 78, 67, 94, 54] },
  ],
  "30": [
    { label: "Prospects discovered", value: "4,806", change: "+24%", description: "vs. 3,876 prior 30 days" },
    { label: "Qualified (score ≥ 80)", value: "1,312", change: "+16%", description: "27% of discovered" },
    { label: "Replies", value: "218", change: "+14%", description: "9.1% reply rate" },
    { label: "Meetings booked", value: "76", change: "+18", description: "vs. 58 prior 30 days" },
  ],
};
