import type {
  DocumentAction,
  DocumentPhoto,
} from "@/components/document-activity";
export type WorkspaceEvent = {
  id: string;
  actor: string;
  action: DocumentAction;
  verb: string;
  target: string;
  location: string;
  time: string;
  dateTime: string;
  daysAgo: number;
  folder: string;
  detail: "photos" | "edit" | "share" | "access" | "comment" | "upload";
};
export const events: WorkspaceEvent[] = [
  {
    id: "photos",
    actor: "Omar Haddad",
    action: "Uploads",
    verb: "uploaded 5 photos to",
    target: "Tower B snag reports",
    location: "Al Nakheel Residences",
    time: "10:42",
    dateTime: "2026-10-15T10:42:00",
    daysAgo: 0,
    folder: "Maintenance",
    detail: "photos",
  },
  {
    id: "edit",
    actor: "Lina Saeed",
    action: "Edits",
    verb: "edited",
    target: "lease-template-2027.pdf",
    location: "All properties",
    time: "09:58",
    dateTime: "2026-10-15T09:58:00",
    daysAgo: 0,
    folder: "Leases",
    detail: "edit",
  },
  {
    id: "share",
    actor: "Noura Al-Harbi",
    action: "Shares",
    verb: "shared",
    target: "Tower A handover",
    location: "Al Nakheel Residences",
    time: "09:12",
    dateTime: "2026-10-15T09:12:00",
    daysAgo: 0,
    folder: "Maintenance",
    detail: "share",
  },
  {
    id: "access",
    actor: "Khalid Mansour",
    action: "Access",
    verb: "requested access to",
    target: "Leases",
    location: "Finance team",
    time: "08:30",
    dateTime: "2026-10-15T08:30:00",
    daysAgo: 0,
    folder: "Leases",
    detail: "access",
  },
  {
    id: "comment",
    actor: "Lina Saeed",
    action: "Comments",
    verb: "commented on",
    target: "Building insurance.pdf",
    location: "Riyadh Gardens",
    time: "Yesterday, 16:20",
    dateTime: "2026-10-14T16:20:00",
    daysAgo: 1,
    folder: "Insurance",
    detail: "comment",
  },
  {
    id: "older",
    actor: "Omar Haddad",
    action: "Uploads",
    verb: "uploaded",
    target: "September statement.pdf",
    location: "Jeddah Waterfront",
    time: "Oct 3, 14:15",
    dateTime: "2026-10-03T14:15:00",
    daysAgo: 12,
    folder: "Finance",
    detail: "upload",
  },
];
export const photos: DocumentPhoto[] = [
  { src: "/examples/document-workspace/home.jpg", alt: "White house exterior" },
  { src: "/examples/document-workspace/garden.jpg", alt: "Garden residence" },
  {
    src: "/examples/document-workspace/interior.jpg",
    alt: "Living room inspection",
  },
  {
    src: "/examples/document-workspace/villa.jpg",
    alt: "Modern villa exterior",
  },
  {
    src: "/examples/document-workspace/home.jpg?detail",
    alt: "Front entrance detail",
  },
];
export const storage = [
  { label: "Photos", value: 7.2, tone: "photos" as const },
  { label: "Documents", value: 3.8, tone: "documents" as const },
  { label: "Video", value: 1.8, tone: "video" as const },
];
