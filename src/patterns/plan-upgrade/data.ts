import type { SavedMethod } from "@/components/checkout";
export const SAMPLE_METHODS: SavedMethod[] = [
  {
    id: "visa",
    brand: "Visa",
    name: "Alex Morgan",
    last4: "8156",
    expiry: "06/2028",
    detail: "Company card",
  },
  {
    id: "mastercard",
    brand: "Mastercard",
    name: "Alex Morgan",
    last4: "0916",
    expiry: "06/2028",
    detail: "Backup card",
  },
  {
    id: "wallet",
    brand: "Wallet",
    name: "Alex Morgan",
    detail: "alex@example.com",
  },
];
