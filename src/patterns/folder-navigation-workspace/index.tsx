import { useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import {
  FolderNavigator,
  formatBytes,
  type NavigationFile,
} from "@/components/folder-navigation";
import { IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { ThemePortalTypography } from "@/lib/theme/ThemeScope";
import { useThemeMode } from "@/lib/theme/useThemeMode";
import { FIELDWORK } from "./data";
import "./workspace.css";
export function FolderNavigationWorkspace() {
  const [folder, setFolder] = useState("maison"),
    [query, setQuery] = useState(""),
    [preview, setPreview] = useState<NavigationFile | null>(null),
    [dark, setDark] = useThemeMode(false);
  const opener = useRef<HTMLElement | null>(null);
  return (
    <main className="fn-workspace">
      <header className="fn-site-header">
        <a href="/folder-navigator">
          Oreo UI <span>/ Folder Navigation</span>
        </a>
        <IconButton
          type="secondary"
          icon={<Icon name={dark ? "sun" : "moon"} />}
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          onClick={() => setDark(!dark)}
        />
      </header>
      <section className="fn-workbench" aria-labelledby="fn-title">
        <div className="fn-intro">
          <p>YOUR STUDIO, IN ORDER</p>
          <h1 id="fn-title">A place for every project.</h1>
          <p>Follow the work, one folder at a time.</p>
        </div>
        <label className="fn-search">
          <Icon name="search" size="sm" />
          <input
            type="search"
            aria-label="Search this folder"
            placeholder="Search this folder…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <FolderNavigator
          root={FIELDWORK}
          folderId={folder}
          query={query}
          onClearQuery={() => setQuery("")}
          onNavigate={(id) => {
            setFolder(id);
            setQuery("");
          }}
          onFileOpen={(file) => {
            opener.current = document.activeElement as HTMLElement;
            setPreview(file);
          }}
        />
        <p className="fn-fixture-note">
          Local demo · Browse folders and preview file details.
        </p>
      </section>
      <footer className="fn-site-footer">
        <a href="/folder-navigator">
          Explore the components <Icon name="arrow-up-right" size="sm" />
        </a>
        <a
          href="https://x.com/dev_ya/status/2122731623192072502"
          target="_blank"
          rel="noreferrer"
        >
          Reference by Yanis Lebzar
        </a>
      </footer>
      <Dialog.Root
        open={!!preview}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      >
        <Dialog.Portal>
          <ThemePortalTypography>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-overlay-subtle" />
            <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Dialog.Popup
                finalFocus={() => opener.current}
                className="fn-file-preview oreo-squircle"
              >
                <div className="fn-preview-heading">
                  <Icon name="file" size="lg" />
                  <Dialog.Title>{preview?.name}</Dialog.Title>
                  <Dialog.Close
                    render={
                      <IconButton
                        type="tertiary"
                        icon={<Icon name="x" />}
                        aria-label="Close file preview"
                      />
                    }
                  />
                </div>
                <Dialog.Description>{preview?.description}</Dialog.Description>
                <dl>
                  <div>
                    <dt>Size</dt>
                    <dd>{formatBytes(preview?.bytes ?? 0)}</dd>
                  </div>
                  <div>
                    <dt>Workspace</dt>
                    <dd>Fieldwork</dd>
                  </div>
                </dl>
                <p className="fn-fixture-note">
                  Example metadata. Original files are not connected.
                </p>
              </Dialog.Popup>
            </Dialog.Viewport>
          </ThemePortalTypography>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
