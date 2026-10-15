import "./email-signature.css";
export type SignatureData = {
  name: string;
  role: string;
  email: string;
  phone?: string;
  website?: string;
  company: string;
};
export const SAMPLE_SIGNATURE: SignatureData = {
  name: "Alex Morgan",
  role: "Brand designer",
  email: "alex@example.com",
  phone: "",
  website: "example.com",
  company: "Oreo Studio",
};
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function signatureText(data: SignatureData) {
  return [
    "Best,",
    "",
    data.name,
    data.role,
    data.email,
    data.phone,
    data.website,
    "",
    data.company,
  ]
    .filter((v) => v !== undefined)
    .join("\n");
}
/** Plain text content is escaped, never used as URLs or injected markup. Inline styles work without app CSS. */
export function signatureHTML(data: SignatureData) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#202020;background:#ffffff"><tr><td style="padding:24px"><div style="color:#646464;margin-bottom:16px">Best,</div><strong>${escape(data.name)}</strong><div>${escape(data.role)}</div><div>${escape(data.email)}</div>${data.phone ? `<div>${escape(data.phone)}</div>` : ""}${data.website ? `<div>${escape(data.website)}</div>` : ""}<div style="font-size:20px;font-weight:bold;margin-top:20px">${escape(data.company)}</div></td></tr></table>`;
}
export function EmailSignature({
  data = SAMPLE_SIGNATURE,
}: {
  data?: SignatureData;
}) {
  return (
    <article
      className="oreo-email-signature"
      aria-label="Email signature preview"
    >
      <p>Best,</p>
      <strong>{data.name}</strong>
      <span>{data.role}</span>
      <span>{data.email}</span>
      {data.phone && <span>{data.phone}</span>}
      {data.website && <span>{data.website}</span>}
      <b>{data.company}</b>
    </article>
  );
}
