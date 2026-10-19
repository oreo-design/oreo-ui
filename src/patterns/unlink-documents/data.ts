import type { LinkedDocument } from "@/components/linked-documents";
export const SAMPLE_DOCUMENTS: LinkedDocument[] = [
  ["statement", "Bank-Statement_1026.pdf", "Bank statement", "248 KB"],
  [
    "contract",
    "Purchase-Contract_1810-Shoreham.pdf",
    "Purchase contract",
    "1.2 MB",
  ],
  ["receipt", "EMD-Receipt_021225.pdf", "Deposit receipt", "124 KB"],
  ["paystub", "Paystub_Acme_030125.pdf", "Payslip", "196 KB"],
  ["tax", "Tax-Bill_SF_2025.pdf", "Tax statement", "312 KB"],
  ["bonus", "Bonus-Paystub_Q1-2025.pdf", "Bonus statement", "184 KB"],
  ["prior", "Prior-Paystub_021525.pdf", "Prior payslip", "208 KB"],
  ["gift", "Gift-Letter_Chen.pdf", "Gift letter", "96 KB"],
].map(([id, name, kind, size]) => ({
  id,
  name,
  kind,
  size,
  owner: "Jamie Morgan",
  added: "Oct 18, 2026",
}));
