# Edge Observatory

Source: [Augustas infrastructure dashboard](https://x.com/augustasdesign/status/2110393766754341153). The reference contains three static slices of one dark dashboard. Its KPI strip, dot map with regional detail, latency chart, regional health list and deployment feed inform this independent implementation. No motion was inferred from the screenshots.

- `/edge-monitor`: reusable component documentation and playground.
- `/edge-observatory`: responsive template, dark by default with a light theme.
- Components: EdgeMetric, MonitorPanel, RegionTrafficMap, RegionHealthList, LatencyChart and DeploymentFeed.
- Reuse: ActivityBars, Avatar, Button, Icon, AgentWorkspaceState, Base UI Tabs and Dialog.
- Selection: map/list/select share the region filter; logs follow it. Period controls request volume and chart samples. The all-region map initially spotlights the Singapore incident; selecting a marker scopes the dashboard.
- Data: local fixed fixture. Simulate deploy adds a local history item and detail dialog; no repository or infrastructure changes. Refresh restores defaults. Static snapshots do not claim live telemetry.
- Empty and invalid chart data have shared centered recovery content. The map's original continent silhouettes are schematic, not GIS data. x/y coordinates use percentages. Responsive markers retain accessible city/code/latency names, with full names in the list.
- No new animation or dependency. Chart changes and keyboard navigation are immediate. Colors, radii, type and spacing map to Oreo tokens/scale; SVG coordinates and graph geometry are data-specific.
