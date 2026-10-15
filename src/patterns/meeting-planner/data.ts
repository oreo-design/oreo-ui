import type { MultiSelectOption } from "@/components/multi-select-menu";
import type { MeetingData, MeetingTime } from "@/components/meeting";
export const meetingCategories: MultiSelectOption[] = [
  { value: "sync", label: "Quick Sync", icon: "paper-plane" },
  { value: "huddle", label: "Team Huddle", icon: "users" },
  { value: "review", label: "Project Review", icon: "star" },
  { value: "brainstorm", label: "Brainstorming", icon: "brain" },
  { value: "focus", label: "Focus Time", icon: "lock" },
  { value: "interview", label: "Interview", icon: "list-checks" },
  { value: "external", label: "External Meeting", icon: "book-open" },
  { value: "goals", label: "Goal Alignment", icon: "gauge" },
];
export const initialMeetings: MeetingData[] = [
  {
    id: "design",
    title: "Rodry and Markos",
    start: "2026-06-26T09:00",
    duration: 60,
    attendees: [
      { id: "rodry", name: "Rodry Chen", organizer: true },
      { id: "markos", name: "Markos Lee" },
    ],
    categories: ["review", "brainstorm", "interview"],
    response: "yes",
    flexible: true,
    location: "Video meeting · Local time",
  },
  {
    id: "huddle",
    title: "Product team huddle",
    start: "2026-06-26T11:30",
    duration: 30,
    attendees: [
      { id: "rodry", name: "Rodry Chen", organizer: true },
      { id: "mia", name: "Mia Brooks" },
      { id: "leo", name: "Leo Park" },
    ],
    categories: ["huddle", "sync"],
    response: "maybe",
    flexible: true,
    location: "Video meeting · Local time",
  },
  {
    id: "focus",
    title: "A little space to think",
    start: "2026-06-26T14:00",
    duration: 90,
    attendees: [{ id: "rodry", name: "Rodry Chen", organizer: true }],
    categories: ["focus"],
    response: "yes",
    flexible: false,
    location: "Personal calendar · Local time",
  },
];
export const meetingSuggestions: MeetingTime[] = [
  { id: "one", label: "Sat, Jun 27 · 1:00 pm", start: "2026-06-27T13:00" },
  { id: "two", label: "Sat, Jun 27 · 4:00 pm", start: "2026-06-27T16:00" },
  { id: "three", label: "Sat, Jun 27 · 3:45 pm", start: "2026-06-27T15:45" },
];
