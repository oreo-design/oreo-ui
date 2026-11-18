# Folder Navigation

Three reusable roles: FolderNavigator composition, FolderNavigationRow action and FolderPathTrail breadcrumb. Reuses Icon, Menu, StatusView and the existing Motion dependency/easeOut. The workspace uses Button/IconButton and Base UI Dialog with theme portal typography.

- Properties: controlled acyclic tree with globally unique IDs, folderId, onNavigate; optional onFileOpen, query, onClearQuery and motionEnabled. Byte totals derive from finite nonnegative file values. No data mutation or request is performed.
- Interaction/states: pointer/Enter/Space opens; ArrowLeft returns; current crumb receives entry focus and the previous folder row receives return focus. Shared Menu owns ancestor keyboard navigation and Escape. Empty, filtered-empty and unavailable have distinct recovery. Missing onFileOpen disables file actions. Host-owned async loading/error belongs outside this local tree contract.
- Copy: names wrap, counts distinguish files/folders, decimal byte units; no synthetic save/download claims. Template metadata is explicitly a local fixture.
- Layout: bounded scrolling rows under an in-flow opaque breadcrumb, shared neutral colors and token-based spacing/radii/type. Name transfer is 240ms easeOut; incoming rows resolve opacity/2px blur in 180ms. Keyboard and reduced motion skip interpolation; changes never queue behind animation.

Routes: /folder-navigator, /folder-navigation-row, /folder-path-trail and /folder-navigation-workspace. Prefer existing KnowledgeFileTable/FolderTree for dense metadata or persistent hierarchical navigation. All foundations use existing tokens; 1px borders and 2px motion blur are rendering effects.
