import type { Meeting } from "@/components/connection-state";
export const upcoming: Meeting[] = [
  { id: "u1", date: "Tomorrow", time: "09:30", title: "Fielded pricing review", company: "Fielded", attendees: ["Alex Chen", "Maya Patel"], note: "Review the proposed plan and prepare questions about the next quarter." },
  { id: "u2", date: "Sat 17 Oct", time: "10:30", title: "Halden QBR prep", company: "Halden", attendees: ["Sam Rivera"], note: "Align on the quarterly review agenda and account priorities." },
  { id: "u3", date: "Mon 19 Oct", time: "All day", title: "Tideline security review", company: "Tideline", attendees: ["Jo Kim"], note: "Collect the outstanding security questions before the review." },
  { id: "u4", date: "Fri 23 Oct", time: "17:30", title: "Pipeline review", company: "Pipeline", attendees: ["Maya Patel"], note: "Review open opportunities and agree on next steps." },
];
export const earlier: Meeting[] = [
  { id: "e1", date: "Yesterday", time: "16:00", title: "Holloway procurement call", company: "Holloway", attendees: ["Alex Chen", "Jo Kim", "Sam Rivera", "Maya Patel", "Robin Lee"], note: "Procurement requested an updated timeline. Follow up with the revised proposal." },
  { id: "e2", date: "Yesterday", time: "11:00", title: "Wovenpath pricing follow-up", company: "Wovenpath", attendees: ["Alex Chen", "Maya Patel"], note: "Discussed annual pricing and the scope of the initial rollout." },
  { id: "e3", date: "Mon 12 Oct", time: "23:00", title: "Holloway weekly sync", company: "Holloway", attendees: ["Alex Chen", "Jo Kim", "Sam Rivera", "Maya Patel"], note: "Weekly check-in completed. The team is on track for the next milestone." },
  { id: "e4", date: "Mon 12 Oct", time: "22:00", title: "Northlane technical deep dive", company: "Northlane", attendees: ["Sam Rivera"], note: "Walked through the integration plan and documented technical questions." },
  { id: "e5", date: "Mon 12 Oct", time: "20:30", title: "Wovenpath demo", company: "Wovenpath", attendees: ["Jo Kim", "Maya Patel"], note: "Demo completed. Share the recording with the evaluation team." },
  { id: "e6", date: "Mon 12 Oct", time: "14:00", title: "Fernwood Health intro", company: "Fernwood", attendees: ["Robin Lee"], note: "Introductions and discovery. Schedule a follow-up with the operations team." },
  { id: "e7", date: "Mon 12 Oct", time: "10:00", title: "Ashford pilot checkpoint", company: "Ashford", attendees: ["Maya Patel"], note: "The pilot is progressing. Confirm success criteria at the next checkpoint." },
];
