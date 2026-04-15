# Decisions

## Canvas textures instead of image assets
Cards use dynamically generated CanvasTexture with the project title and color. This eliminates external asset loading entirely, keeping the bundle lean and the initial load fast. Trade-off: cards are text-only, not as visually rich as screenshots. Worth it for the zero-dependency load time.

## Custom lerp camera controller (no GSAP for 3D)
Camera transitions use a hand-rolled lerp system with custom easing functions (easeOutCubic, easeInQuart, easeOutExpo, easeOutBack). GSAP is only used for HTML overlay animations and is lazy-loaded on first use. This keeps the Three.js render loop predictable and avoids mixing two animation systems on the same objects.

## Arc layout for card positioning
Cards are arranged in a semicircular arc with varying Y offsets, not a flat grid. This makes the spatial arrangement feel intentional and gives depth to the scene. The arc radius and span are tuned so all 10 cards are visible from the home camera position without overlapping.

## Raycaster interaction over DOM events
Click detection uses Three.js Raycaster on pointer events. This keeps the interaction model inside the 3D scene rather than overlaying transparent DOM hit targets. Supports both mouse and touch input through the same code path.

## Vanilla JS, no framework
The entire UI (overlay, nav dots, audio toggle) is built with plain DOM manipulation. The project is small enough that a framework would add weight without reducing complexity. Total dependency count: Three.js, GSAP, Vite.

## GSAP lazy-loaded via dynamic import
GSAP is only imported when the overlay first opens. Users who just browse cards without clicking never download it. Measured impact: ~40kb saved on initial load for non-interactive visitors.

## Vercel deployment with SPA routing
vercel.json rewrites all paths to index.html. The site is a single-page app with no server-side logic. Vercel's CDN handles caching and edge delivery.
