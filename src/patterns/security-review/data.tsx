import { Icon } from "@/components/icon";
import type { TreeStepNode } from "@/components/tree-stepper";
export const REVIEW_TREE: readonly TreeStepNode[] = [
  {
    id: "endpoint",
    label: "Endpoint Security",
    icon: <Icon name="columns" />,
    badge: { label: "Review", color: "blue" },
    children: [
      {
        id: "inventory",
        label: "Inventory",
        count: 248,
        children: [
          { id: "devices", label: "Managed devices" },
          { id: "ownership", label: "Device ownership" },
        ],
      },
      {
        id: "threats",
        label: "Threat Detection",
        count: 12,
        children: [
          { id: "overview", label: "Overview" },
          { id: "suspicious", label: "Suspicious activity" },
          { id: "malware", label: "Malware events" },
          { id: "network", label: "Network anomalies" },
        ],
      },
      {
        id: "vulnerabilities",
        label: "Vulnerabilities",
        count: 37,
        badge: { label: "High", color: "orange" },
        children: [
          { id: "cves", label: "Critical CVEs" },
          { id: "patches", label: "Missing patches" },
          { id: "services", label: "Exposed services" },
        ],
      },
      {
        id: "policies",
        label: "Policies",
        count: 8,
        children: [
          { id: "encryption", label: "Disk encryption" },
          { id: "firewall", label: "Firewall rules" },
          { id: "screen-lock", label: "Screen lock" },
        ],
      },
    ],
  },
  {
    id: "identity",
    label: "Identity & Access",
    icon: <Icon name="lock" />,
    children: [
      {
        id: "accounts",
        label: "Account hygiene",
        children: [
          { id: "mfa", label: "Multi-factor coverage" },
          { id: "dormant", label: "Dormant accounts" },
        ],
      },
    ],
  },
  {
    id: "application",
    label: "Application Security",
    icon: <Icon name="inline-code" />,
    children: [
      {
        id: "dependencies",
        label: "Dependencies",
        children: [
          { id: "packages", label: "Package updates" },
          { id: "secrets", label: "Secret scanning" },
        ],
      },
    ],
  },
  {
    id: "data",
    label: "Data Protection",
    icon: <Icon name="folder" />,
    children: [
      {
        id: "recovery",
        label: "Recovery readiness",
        children: [
          { id: "backups", label: "Backup coverage" },
          { id: "restore", label: "Restore drill" },
        ],
      },
    ],
  },
];
export type CheckEvidence = {
  description: string;
  rows: readonly [string, string][];
  guidance: string;
};
export const CHECK_EVIDENCE: Record<string, CheckEvidence> = {
  devices: {
    description: "Confirm that the device inventory reflects this workspace.",
    rows: [
      ["Managed devices", "248"],
      ["Recently seen", "246 in the last 24 hours"],
      ["Unseen devices", "2 awaiting owner confirmation"],
    ],
    guidance: "Record whether the unseen devices need a follow-up.",
  },
  ownership: {
    description: "Check that every endpoint has an accountable owner.",
    rows: [
      ["Assigned devices", "244 of 248"],
      ["Unassigned", "4 shared lab machines"],
      ["Owner", "IT Operations"],
    ],
    guidance: "Shared devices may use a team owner; note any gaps.",
  },
  overview: {
    description: "Review the scope of the current detection queue.",
    rows: [
      ["Detections", "12 in this sample"],
      ["Window", "Last 7 days"],
      ["Triage owner", "Security Operations"],
    ],
    guidance: "Confirm the detection window and owner before continuing.",
  },
  suspicious: {
    description:
      "Review the activity that stands out from normal workspace behavior.",
    rows: [
      ["Events to review", "3"],
      ["Most recent event", "New sign-in location"],
      ["Affected endpoint", "DESIGN-MBP-014"],
      ["Assigned owner", "Morgan Lee"],
    ],
    guidance:
      "Compare the sample activity with the owner’s expected behavior. Add a follow-up if the context is missing.",
  },
  malware: {
    description: "Check the sample malware detection and containment record.",
    rows: [
      ["Events", "2"],
      ["Contained", "2"],
      ["Pending owner review", "0"],
    ],
    guidance:
      "Confirm containment evidence and document anything that still needs review.",
  },
  network: {
    description: "Review unusual outbound connections in the sample queue.",
    rows: [
      ["Connections flagged", "4"],
      ["Known test traffic", "3"],
      ["Unclassified", "1"],
    ],
    guidance: "The unclassified connection may need an owner to explain it.",
  },
  cves: {
    description:
      "Identify which critical findings need an assigned remediation owner.",
    rows: [
      ["Critical findings", "3"],
      ["Assigned owners", "2"],
      ["Oldest finding", "8 days"],
    ],
    guidance: "Capture the owner and next action for any unresolved finding.",
  },
  patches: {
    description:
      "Review missing patches against the workspace’s update window.",
    rows: [
      ["Pending patches", "14"],
      ["Outside update window", "2"],
      ["Next window", "Friday, 20:00"],
    ],
    guidance: "Record exceptions that cannot wait for the next update window.",
  },
  services: {
    description:
      "Review services exposed beyond their intended network boundary.",
    rows: [
      ["Services reviewed", "20"],
      ["Unexpected exposure", "1"],
      ["Owner", "Platform team"],
    ],
    guidance:
      "Flag the service if its exposure does not have an owner-approved reason.",
  },
  encryption: {
    description: "Confirm that sample endpoints report disk encryption.",
    rows: [
      ["Encrypted", "246 of 248"],
      ["Awaiting enrollment", "2"],
      ["Policy", "Workspace baseline"],
    ],
    guidance: "Add a follow-up for endpoints that remain outside the baseline.",
  },
  firewall: {
    description: "Check for unreviewed changes to endpoint firewall rules.",
    rows: [
      ["Policy coverage", "248 endpoints"],
      ["Exceptions", "3 approved"],
      ["Unreviewed changes", "0"],
    ],
    guidance: "Review the exception list before marking this check complete.",
  },
  "screen-lock": {
    description: "Review the workspace’s screen-lock coverage.",
    rows: [
      ["Policy", "Lock after 5 minutes"],
      ["Compliant sample", "248 of 248"],
      ["Exemptions", "0"],
    ],
    guidance: "Confirm the policy matches the intended workspace baseline.",
  },
  mfa: {
    description: "Review multi-factor enrollment for active accounts.",
    rows: [
      ["Active accounts", "82"],
      ["Enrolled", "80"],
      ["Pending enrollment", "2"],
    ],
    guidance: "Record an enrollment owner for accounts without coverage.",
  },
  dormant: {
    description: "Review accounts that have not been used recently.",
    rows: [
      ["Inactive over 90 days", "5"],
      ["Approved service accounts", "3"],
      ["Awaiting review", "2"],
    ],
    guidance:
      "Distinguish approved service accounts from accounts that need removal.",
  },
  packages: {
    description: "Review application dependency updates in the sample report.",
    rows: [
      ["Applications", "6"],
      ["Updates available", "9"],
      ["Assigned owner", "Application team"],
    ],
    guidance: "Record any updates that require prioritization.",
  },
  secrets: {
    description: "Review the sample secret-scanning queue.",
    rows: [
      ["Repositories", "18"],
      ["Open alerts", "0"],
      ["Last sample scan", "Today, 09:00"],
    ],
    guidance: "Confirm the scan scope covers the intended repositories.",
  },
  backups: {
    description: "Review coverage of scheduled backup jobs.",
    rows: [
      ["Scheduled jobs", "12"],
      ["Successful", "11"],
      ["Needs investigation", "1"],
    ],
    guidance: "Record an owner and recovery action for any failed job.",
  },
  restore: {
    description: "Review evidence from the most recent recovery exercise.",
    rows: [
      ["Last drill", "7 days ago"],
      ["Result", "Restored successfully"],
      ["Recovery time", "42 minutes"],
    ],
    guidance:
      "Confirm that the sample recovery result meets the workspace’s requirements.",
  },
};
