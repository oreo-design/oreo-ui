# Playground device assets

Used only by the documentation playground; not part of the copyable components.

- `iphone-18-pro-black.png`: iPhone 18 Pro Black portrait, downloaded 2026-11-06 from [AppleFramer](https://github.com/TimBroddin/appleframer.com/blob/main/public/frames/iPhone/18/Pro/Black/iPhone%2018%20Pro%20-%20Black%20-%20Portrait.png). Repository license in `APPLEFRAMER-LICENSE`. Device artwork and iPhone trademarks belong to Apple; do not present these as Oreo artwork or imply endorsement.
- `touch-cursor.png`: unmodified Chromium DevTools `front_end/Images/touchCursor.png`, downloaded 2026-11-06. [Source](https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/Images/touchCursor.png), license in `CHROMIUM-LICENSE`. Native 23 × 23 cursor, center hotspot (11,11).

The bezel is 1350 × 2760. Its transparent screen opening is 1206 × 2622 at (72,69), with rounded corners and the camera cutout already in the artwork. The stage uses a 450 × 920 CSS-pixel device and a 402 × 874 screen at (24,23), scaled together to fit its host. These physical asset coordinates deliberately do not follow UI theme density tokens. Live DOM stays behind the image; the image never receives pointer events. Screen content/portals scroll using the existing owner. The home indicator follows the active theme.

The mobile cursor rule intentionally overrides all nested interactive cursors including annotation and in-screen portals. It changes appearance only; mouse events are not converted into touch events. Desktop preview and surrounding tools retain their normal cursor semantics. No cursor is added for touch-only hardware.
