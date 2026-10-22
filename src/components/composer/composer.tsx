import * as React from "react";
import {
  PromptBox,
  PromptBoxModelSelect,
  type PromptBoxProps,
} from "@/components/prompt-box";
import { IconButton } from "@/components/button";
import { KeywordTag } from "@/components/keyword-tag";
import { Attachment, AttachmentBar } from "@/components/attachment";
import { ContextBar, ContextBarLabel } from "@/components/context-bar";
import { cn } from "@/lib/cn";
import { ComposerAsset } from "./assets";
import {
  ComposerMenu,
  ComposerMenuSurface,
  ComposerAddMenu,
  ComposerModelSettings,
  ComposerCommandList,
  ComposerApprovalMenu,
  mentionCommands,
  slashCommands,
  type ComposerCommand,
  type ApprovalMode,
} from "./composer-menu";

export type ComposerProps = Omit<
  PromptBoxProps,
  | "onSubmit"
  | "onAttach"
  | "onMention"
  | "modelSelect"
  | "tags"
  | "attachments"
  | "value"
  | "onValueChange"
> & {
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (
    value: string,
    context: {
      files: File[];
      commands: ComposerCommand[];
      model: string;
      approval: ApprovalMode;
    },
  ) => void;
  onCommand?: (command: ComposerCommand) => void;
};
/** Complete local composer. Hosts provide upload/model execution; file selection stays local. */
export function Composer({
  value,
  onValueChange,
  onSubmit,
  onCommand,
  className,
  ...props
}: ComposerProps) {
  const [local, setLocal] = React.useState(props.defaultValue ?? "");
  const text = value ?? local;
  const [files, setFiles] = React.useState<File[]>([]);
  const [commands, setCommands] = React.useState<ComposerCommand[]>([]);
  const [model, setModel] = React.useState("5.6 Terra");
  const [approval, setApproval] = React.useState<ApprovalMode>("manual");
  const [notice, setNotice] = React.useState("");
  const [commandIndex, setCommandIndex] = React.useState(0);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [dismissed, setDismissed] = React.useState<string | null>(null);
  const kind = text.startsWith("@")
    ? "mention"
    : text.startsWith("/")
      ? "slash"
      : null;
  const query = kind ? text.slice(1) : "";
  const visible = kind && dismissed !== text;
  const matches = (kind === "mention" ? mentionCommands : slashCommands).filter(
    (c) =>
      `${c.label} ${c.description ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const update = (v: string) => {
    setLocal(v);
    onValueChange?.(v);
    setDismissed(null);
    setCommandIndex(0);
  };
  const choose = (c: ComposerCommand) => {
    if (c.id === "files") fileInput.current?.click();
    else setCommands((v) => (v.some((x) => x.id === c.id) ? v : [...v, c]));
    onCommand?.(c);
    update("");
  };
  const picker = React.useRef<HTMLDivElement>(null);
  const root = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    picker.current
      ?.querySelectorAll("button")
      [commandIndex]?.scrollIntoView({ block: "nearest" });
  }, [commandIndex]);
  const handleKey: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    props.onPromptKeyDown?.(e);
    if (e.defaultPrevented || !visible) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setDismissed(text);
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setCommandIndex((i) =>
        Math.max(
          0,
          Math.min(
            Math.max(0, matches.length - 1),
            i + (e.key === "ArrowDown" ? 1 : -1),
          ),
        ),
      );
    }
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (matches[commandIndex]) choose(matches[commandIndex]);
    }
  };
  const action = (id: string) => {
    if (id === "files") fileInput.current?.click();
    else setNotice(`${id.replaceAll("-", " ")} selected`);
  };
  return (
    <div
      ref={root}
      className={cn(
        "composer-template relative w-full max-w-[800px]",
        className,
      )}
    >
      <input
        ref={fileInput}
        type="file"
        multiple
        hidden
        aria-label="Attach files"
        onChange={(e) => {
          setFiles((v) => [...v, ...Array.from(e.target.files ?? [])]);
          e.target.value = "";
        }}
      />
      {visible && (
        <div
          ref={picker}
          className="absolute bottom-full left-0 z-10 mb-2 w-full"
          data-command-index={commandIndex}
        >
          <ComposerMenuSurface className="w-full">
            <ComposerCommandList
              kind={kind}
              query={query}
              onSelect={choose}
              activeIndex={commandIndex}
            />
          </ComposerMenuSurface>
        </div>
      )}
      <PromptBox
        {...props}
        value={text}
        onValueChange={update}
        onPromptKeyDown={handleKey}
        voice={props.voice ?? "wave"}
        header={
          props.header ??
          (notice ? (
            <ContextBar>
              <ContextBarLabel icon={null} onRemove={() => setNotice("")}>
                {notice}
              </ContextBarLabel>
            </ContextBar>
          ) : undefined)
        }
        attachments={
          files.length ? (
            <AttachmentBar>
              {files.map((f, i) => (
                <Attachment
                  key={`${f.name}-${i}`}
                  type="doc"
                  label={f.name}
                  onRemove={() => setFiles((v) => v.filter((_, n) => i !== n))}
                />
              ))}
            </AttachmentBar>
          ) : undefined
        }
        tags={
          commands.length
            ? commands.map((c) => (
                <KeywordTag
                  key={c.id}
                  icon={<ComposerAsset name={c.icon} />}
                  onRemove={() =>
                    setCommands((v) => v.filter((x) => x.id !== c.id))
                  }
                >
                  {c.label}
                </KeywordTag>
              ))
            : undefined
        }
        attachControl={
          <ComposerMenu
            trigger={
              <IconButton
                aria-label="Add attachment"
                type="secondary"
                className="ring-[0.5px] ring-border-subtle"
                icon={<ComposerAsset name="attach" />}
              />
            }
          >
            <ComposerAddMenu onAction={action} />
          </ComposerMenu>
        }
        mentionControl={
          <IconButton
            aria-label="Mention"
            type="secondary"
            className="ring-[0.5px] ring-border-subtle"
            icon={<ComposerAsset name="mention" />}
            onClick={() => {
              update("@");
              root.current?.querySelector("textarea")?.focus();
            }}
          />
        }
        modelSelect={
          <ComposerMenu
            width={237}
            trigger={
              <PromptBoxModelSelect
                icon={<ComposerAsset name="claude" />}
                label={model}
              />
            }
          >
            <ComposerModelSettings
              value={model}
              onValueChange={setModel}
              searchable
            />
          </ComposerMenu>
        }
        onSubmit={(v) => onSubmit?.(v, { files, commands, model, approval })}
      />
      <div className="mt-2 flex justify-end">
        <ComposerMenu
          width={438}
          trigger={
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
            >
              <ComposerAsset name="shield" />{" "}
              {approval === "manual"
                ? "Ask for approval"
                : approval === "automatic"
                  ? "Ask for me"
                  : "Full access"}
            </button>
          }
        >
          <ComposerApprovalMenu
            detailed
            value={approval}
            onValueChange={setApproval}
            onLearnMore={() =>
              setNotice(
                "Approval settings apply to this local composer example.",
              )
            }
          />
        </ComposerMenu>
      </div>
    </div>
  );
}
