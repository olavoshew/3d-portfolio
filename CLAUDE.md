# CLAUDE.md — 3D Interactive Portfolio

<!-- .claude-governance-start -->
## .claude Governance (Mandatory)

**Do NOT start coding until this boot sequence is complete.**

1. Read `c:\Code\.claude\GOVERNANCE.md` -- rules, skill resolution, boundaries
2. Read `c:\Code\.claude\skills-registry.md` -- per-project skill mappings
3. Read `c:\Code\.claude\vault\CHANGELOG.md` -- what evolved since last session

For first session on this project, also read:
4. `c:\Code\.claude\vault\04-projects\03-3d-portfolio.md` -- current phase, session log
5. Each SKILL.md listed below
6. `c:\Code\.claude\vault\03-patterns\` -- reusable patterns from earlier projects

All rules, skill resolution, evolution protocol, and session end protocol are in GOVERNANCE.md.
<!-- .claude-governance-end -->

## Skills to Read Before Starting
```
c:\Code\Skills\antigravity-awesome-skills\skills\threejs\SKILL.md
c:\Code\Skills\antigravity-awesome-skills\skills\gsap\SKILL.md
c:\Code\Skills\antigravity-awesome-skills\skills\vite\SKILL.md
```

## Phase 1 — Setup (~1hr)

**Goal:** Vite project runs locally. Three.js scene visible. Camera rig with lerp transitions working.

**Prompt:**
```
I'm building a 3D interactive portfolio site with Three.js and Vite. The portfolio itself is the demo — navigating between project cards feels spatial.

Working directory: c:\Code\Portfolio\03-3d-portfolio\

Phase 1: project setup and camera rig only.

Create:
1. `package.json` — dependencies: three, gsap, vite. Dev: vite. Scripts: dev, build, preview.
2. `vite.config.js` — minimal config, assetsInclude for GLTF files
3. `index.html` — minimal, loads src/main.js as module
4. `src/main.js` — scene init: WebGLRenderer (antialias, pixel ratio), PerspectiveCamera, scene, animation loop with requestAnimationFrame
5. `src/scene/camera.js` — exports a camera controller with: `moveToPosition(target: Vector3, duration: number)` using lerp (NOT teleport), current position stored as state. No GSAP in this file — pure Three.js lerp.
6. `src/scene/environment.js` — ambient light + directional light, optional subtle fog

Local dev: `npm run dev` must show a grey scene with no console errors.

Rules: no comments, no docstrings, no em dashes. Keep files under 150 lines.
```

## Phase 2 — Project Cards (~3hr)

**Goal:** All 10 project cards exist as 3D objects. Click one, camera moves to it.

**Prompt:**
```
Continue the 3D portfolio. Phase 1 done — scene renders, camera rig lerps.

Working directory: c:\Code\Portfolio\03-3d-portfolio\

Phase 2: project cards in 3D space, interactive.

1. Create `src/data/projects.json` — array of 10 objects: { id, title, description (2 sentences), tech (array), color (hex) }. Use the actual 10 portfolio projects: Job Intel Agent, Unity Showcase, 3D Portfolio, Video Automation, WebAR, RAG Tool, Game Jam, CLI Tool, Motion Library, AR Business Card.

2. Create `src/scene/cards.js`:
   - `createCards(projects, scene)` — creates a PlaneGeometry card mesh per project, positions them in a 3D arc or grid (not flat — use varying Z positions), applies a MeshStandardMaterial with the project color
   - `setupInteraction(cards, camera, renderer)` — raycaster on pointer click, identified clicked card, returns card id
   - Export `cards` array and `handleClick` function

3. Update `src/main.js`:
   - Load projects.json, call createCards
   - On card click: call camera.moveToPosition(card.position + offset), highlight selected card (scale up slightly)

Rules: 10 cards must be visible without overlapping. Camera transition duration: 0.8s lerp. No external state library.
```

## Phase 3 — UI + Mobile (~2hr)

**Goal:** Expanded project view, GSAP transitions, touch input, ambient audio (toggleable).

**Prompt:**
```
Continue the 3D portfolio. Phase 2 done — 10 cards in 3D space, camera moves to them.

Working directory: c:\Code\Portfolio\03-3d-portfolio\

Phase 3: HTML overlay for project detail, GSAP animations, mobile touch, optional audio.

1. `src/ui/overlay.js`:
   - HTML overlay (position: fixed) hidden by default
   - `showProject(project)` — animates in with GSAP (slide up + fade), shows title, description, tech stack, link
   - `hideOverlay()` — animates out, triggers camera return to home position
   - Close button + Esc key handler

2. `src/ui/nav.js` — top-right navigation dots (one per project), click a dot to move camera to that card

3. Touch input in `src/main.js` — touchstart/touchend handler that maps to the same raycaster click logic as pointer

4. Optional ambient audio:
   - Small unmute icon (bottom-right corner)
   - Loads an audio file lazily on first unmute click
   - `src/audio/ambient.js` — wraps Web Audio API: play, pause, setVolume

Rules: GSAP only for HTML overlay animations (not for Three.js objects). Overlay must not block Three.js canvas interaction when hidden.
```

## Phase 4 — Performance + Deploy (~2hr)

**Goal:** Lighthouse 90+. Bundle under 200kb gzipped. Live on Vercel. Replaces current portfolio URL.

**Prompt:**
```
Final phase for the 3D portfolio. Full experience works locally.

Working directory: c:\Code\Portfolio\03-3d-portfolio\

Phase 4: performance optimisation and deploy.

1. Bundle analysis: run `npm run build` and check dist size. Tell me the 3 biggest contributors and how to reduce them for a Three.js project.

2. Performance fixes to implement:
   - Lazy load GSAP (dynamic import, only load when overlay first opens)
   - Compress any textures (use WebP or use no textures — use vertex colours instead)
   - Ensure renderer.setPixelRatio is capped at 2

3. `vercel.json` — minimal config for SPA deploy (routes to index.html)

4. Update `README.md`:
   - Line 1: "**Live:** [Vercel URL]" (placeholder)
   - 3-sentence description
   - Lighthouse score placeholder: "Performance: XX | Accessibility: XX"
   - Tech stack

4. WCAG check: project description text in the HTML overlay must pass AA contrast. What colour combinations work with the dark 3D background?

After deploy, what Lighthouse CLI command gives me the performance score?

Rules: no em dashes, no AI vocabulary.
```
