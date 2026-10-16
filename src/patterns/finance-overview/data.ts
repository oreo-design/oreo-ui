import type { BankAccount, FinanceNotice } from "@/components/finance-overview";
export const SAMPLE_ACCOUNTS: BankAccount[] = [
  {
    id: "operating",
    name: "Operating",
    bank: "First Harbor Bank",
    last4: "4021",
    currency: "USD",
    balance: 247621000,
    history: [
      250400000, 252000000, 254000000, 251000000, 249000000, 247000000,
      248000000, 247621000,
    ],
    tone: "blue",
  },
  {
    id: "payroll",
    name: "Payroll",
    bank: "First Harbor Bank",
    last4: "8810",
    currency: "USD",
    balance: 60840000,
    history: [
      60120000, 59800000, 61000000, 60500000, 60800000, 61200000, 61000000,
      60840000,
    ],
    tone: "purple",
  },
  {
    id: "reserve",
    name: "Reserve",
    bank: "Treasury fund",
    last4: "1290",
    currency: "USD",
    balance: 160000000,
    history: [
      160000000, 160000000, 160000000, 160000000, 160000000, 160000000,
      160000000, 160000000,
    ],
    tone: "mint",
  },
  {
    id: "collections",
    name: "Collections",
    bank: "Lakeside Bank",
    last4: "5528",
    currency: "USD",
    balance: 31922000,
    history: [
      68200000, 64000000, 59000000, 62000000, 75000000, 73000000, 80000000,
      31922000,
    ],
    tone: "mint",
  },
  {
    id: "eur",
    name: "EUR account",
    bank: "Meridian Bank",
    last4: "7312",
    currency: "EUR",
    balance: 15230000,
    history: [
      14800000, 14850000, 15000000, 15100000, 15000000, 15150000, 15200000,
      15230000,
    ],
    tone: "orange",
  },
];
export const SAMPLE_NOTICES: FinanceNotice[] = [
  {
    id: "forecast",
    title: "Conservative case crosses the waterline",
    description: "Week of Dec 14, $281K under if customers pay a month late.",
    action: "Open forecast",
    kind: "forecast",
    resolved: false,
    detail:
      "This sample forecast assumes customer receipts arrive 30 days later. The projected shortfall is $281,000 in the week of December 14. Review the assumptions with your team before making a cash decision.",
  },
  {
    id: "bills",
    title: "3 bills need your approval",
    description: "$136,330 · Nimbus Cloud is 22% above usual.",
    action: "Review",
    kind: "bill",
    resolved: false,
    detail:
      "Three sample bills: Nimbus Cloud $76,330; Workspace rent $40,000; Services $20,000. Total $136,330. Marking reviewed only clears this local reminder; it does not approve or pay bills.",
  },
  {
    id: "collections",
    title: "Acme Logistics promised $86,400 by Oct 9",
    description: "47 days late on two invoices.",
    action: "View",
    kind: "collection",
    resolved: false,
    detail:
      "Sample invoices INV-1082 and INV-1089 total $86,400. A payment promise is recorded for October 9. Review the collection note; no reminder or message will be sent from this demo.",
  },
  {
    id: "reconcile",
    title: "18 transactions to review",
    description: "10 have a match above 95%.",
    action: "Reconcile",
    kind: "reconcile",
    resolved: false,
    detail:
      "Of 18 sample transactions, 10 have suggested matches above 95% confidence and 8 need manual review. Marking reviewed clears this reminder without changing any accounting ledger.",
  },
];
