import { useLayoutEffect, useRef } from "react";

// innerText adds extra newlines around empty editable blocks. Serialize the
// actual line nodes instead, so native typing/paste cannot multiply blank lines.
function readMessage(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (node instanceof HTMLBRElement) return "\n";
  const children = Array.from(node.childNodes);
  if (children.length === 1 && children[0] instanceof HTMLBRElement) return "";
  let text = "";
  children.forEach((child, index) => {
    if (index && child instanceof HTMLElement && /^(DIV|P)$/.test(child.tagName)) text += "\n";
    text += readMessage(child);
  });
  return text;
}

/** Plain-text value with paragraph spacing and presentational @mentions.
 * The DOM is only rebuilt for external changes or after editing, preserving
 * the browser's caret, composition and undo history while the user types. */
export function DraftMessage({ id, value, onChange, disabled, errorId }: {
  id: string; value: string; onChange: (value: string) => void;
  disabled?: boolean; errorId?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const renderedValue = useRef<string | undefined>(undefined);
  const render = (text: string) => {
    const editor = root.current;
    if (!editor) return;
    const fragment = document.createDocumentFragment();
    for (const line of text.split("\n")) {
      const block = document.createElement("div");
      for (const part of line.split(/(@[\p{L}\p{N}_-]+)/u)) {
        if (part.startsWith("@")) {
          const mention = document.createElement("span");
          mention.className = "review-mention";
          mention.textContent = part;
          block.append(mention);
        } else block.append(document.createTextNode(part));
      }
      if (!line) block.append(document.createElement("br"));
      fragment.append(block);
    }
    editor.replaceChildren(fragment);
    renderedValue.current = text;
  };
  useLayoutEffect(() => {
    if (renderedValue.current !== value) render(value);
  }, [value]);
  return <div ref={root} id={id} className="review-message" role="textbox"
    aria-label="Email message" aria-multiline="true" aria-disabled={disabled || undefined}
    aria-invalid={Boolean(errorId)} aria-describedby={errorId}
    contentEditable={disabled ? false : "plaintext-only"} suppressContentEditableWarning
    onInput={event => {
      const text = readMessage(event.currentTarget).replace(/\r\n?/g, "\n");
      renderedValue.current = text;
      onChange(text);
    }}
    onBlur={() => render(value)} />;
}
