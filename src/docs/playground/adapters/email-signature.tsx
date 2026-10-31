/** Family-owned preview adapters and local export bindings. */
import { EmailSignature, SAMPLE_SIGNATURE } from "@/components/email-signature";
import { definePlayground as define, text } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"email-signature": define("Email Signature", { name:text(SAMPLE_SIGNATURE.name), role:text(SAMPLE_SIGNATURE.role), email:text(SAMPLE_SIGNATURE.email), phone:text(""), website:text("example.com"), company:text("Oreo Studio") }, v=><div className="w-full max-w-md rounded-card-medium border border-border-subtle bg-bg-elevated p-6"><EmailSignature data={v}/></div>)
};
const exports = {
"email-signature": { EmailSignature }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "email-signature"; spec.exports = exports; }
export default playgrounds;
