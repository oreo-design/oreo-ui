import type { ClientProfile } from "@/components/client";
import type { Invoice } from "@/components/invoice";
export const CLIENT_DATE = "2026-01-16";
export const CLIENT: ClientProfile = {
  name: "Acme Corporation",
  industry: "Technology",
  specialty: "Software development",
  taxId: "12-3456789",
  teamSize: 12,
  active: true,
  location: "San Francisco, CA 94105",
  website: "www.acmecorp.example",
  email: "john@acmecorp.example",
  phone: "+1 (555) 123-4567",
  owner: "John Smith",
};
export const CLIENT_INVOICES: Invoice[] = [
  {
    id: "INV-2026-001",
    client: "Robert Johnson",
    description: "Platform development",
    dueDate: "2026-01-20",
    amountCents: 2850000,
    status: "paid",
    avatar: "nova",
  },
  {
    id: "INV-2026-002",
    client: "Emily Davis",
    description: "Design system · milestone 2",
    dueDate: "2026-01-30",
    amountCents: 4500000,
    status: "pending",
    avatar: "silk",
  },
  {
    id: "INV-2025-156",
    client: "Sarah Williams",
    description: "Product discovery",
    dueDate: "2026-01-05",
    amountCents: 3275000,
    status: "pending",
    avatar: "nova",
  },
  {
    id: "INV-2025-155",
    client: "Robert Johnson",
    description: "Platform architecture",
    dueDate: "2025-12-20",
    amountCents: 5120000,
    status: "paid",
    avatar: "nova",
  },
  {
    id: "INV-2025-154",
    client: "Emily Davis",
    description: "Brand foundations",
    dueDate: "2025-12-15",
    amountCents: 3890000,
    status: "pending",
    avatar: "silk",
  },
  {
    id: "DRAFT-2026-003",
    client: "Sarah Williams",
    description: "Mobile experience",
    dueDate: "2026-02-15",
    amountCents: 2400000,
    status: "draft",
    avatar: "nova",
  },
];
export const PROJECTS = [
  {
    name: "Platform development",
    description: "A single home for the next generation of Acme products.",
    status: "Active",
    progress: 68,
    owner: "Robert Johnson",
  },
  {
    name: "Design system",
    description: "Shared foundations, components and documentation.",
    status: "Active",
    progress: 42,
    owner: "Emily Davis",
  },
  {
    name: "Mobile experience",
    description: "The core customer journey, made for smaller screens.",
    status: "Active",
    progress: 12,
    owner: "Sarah Williams",
  },
  {
    name: "Product discovery",
    description: "Research, interviews and a prioritized opportunity map.",
    status: "Completed",
    progress: 100,
    owner: "Sarah Williams",
  },
  {
    name: "Platform architecture",
    description: "Infrastructure decisions and a delivery roadmap.",
    status: "Completed",
    progress: 100,
    owner: "Robert Johnson",
  },
  {
    name: "Brand foundations",
    description: "Positioning, visual identity and launch materials.",
    status: "Paused",
    progress: 85,
    owner: "Emily Davis",
  },
];
export const CONTACTS = [
  {
    name: "Robert Johnson",
    role: "Engineering lead",
    email: "robert@acmecorp.example",
  },
  {
    name: "Emily Davis",
    role: "Design director",
    email: "emily@acmecorp.example",
  },
  {
    name: "Sarah Williams",
    role: "Product manager",
    email: "sarah@acmecorp.example",
  },
];
