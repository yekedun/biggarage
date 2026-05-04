# AGENTS.md

## Must-follow constraints

- **Cache busting is manual.** After every change to `style.css` or `script.js`, increment the `?v=` query string in `index.html` (format: `YYYYMMDD-N`). Both references must be updated together.
- **Deploy branch is `main`.** Always push to `main`. `master` exists but is not the deploy target.
- **Images must be AVIF.** Do not add JPG/PNG/WebP assets. Existing images: `galeri1-5.avif`, `hakkimizda.avif`, `logo.png` (logo is PNG by exception).

## Repo-specific conventions

- No build system, no package manager. All changes are direct edits to `index.html`, `style.css`, `script.js`.
- Mobile slider snap is handled entirely in JS (`snapToNearest()` in `script.js`, fires 80 ms after `touchend`). CSS `scroll-snap-type` is intentionally absent from `.mobile-slider-track` and `.gallery-grid` — do not add it back.
- `touch-action: pan-x` on slider tracks is intentional. Do not change to `pan-y` or `auto`.

## Known gotchas

- `calculateScrollAmount()` is called via double `requestAnimationFrame` — this is required to read stable element dimensions after layout. Do not collapse to a single rAF or a direct call.
- `.mobile-slider` uses `margin-inline: -18px` to break out of the container. Slider button positions and track padding (48px each side) are sized to match — changing one requires adjusting the others.
- `scroll-snap-type: x mandatory` was removed because it conflicts with touch momentum on iOS Safari and causes jerky scrolling. Do not re-introduce CSS snap on horizontal sliders.
