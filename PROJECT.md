# PROJECT.md — 3D Interactive Portfolio

## Concept
Replace olavoshew.github.io with a Three.js portfolio where navigating between sections feels spatial. The portfolio itself is the strongest demo — it proves the skill without a project list.

## Target User / Problem
Hiring managers who click a portfolio link and see something that makes them stop. The current static site is clean but forgettable. This one should be impossible to close quickly.

## Key Features
- 3D environment (room, void, or abstract space) built with Three.js
- Project cards float in 3D space — click to expand, camera moves to them
- Smooth camera transitions (lerp, not teleport)
- Touch + pointer input — works on mobile
- Sub-3 second load time (GLTF compression, lazy loading, minimal textures)
- Optional: ambient audio layer tied to camera movement (subtle, toggleable)

## Tech Stack
- Three.js (r160+)
- Vite (dev server + bundler)
- GSAP (animation timeline for UI transitions)
- Vanilla JS (no React — keep bundle small)
- Deployed: Vercel or GitHub Pages

## File Structure
```
src/
  main.js            Entry — scene setup, loop
  scene/
    environment.js   Lighting, background, fog
    camera.js        Camera rig + transition controller
    cards.js         Project card meshes + interaction
  ui/
    overlay.js       HTML overlay for expanded project view
    nav.js           Section navigation logic
  assets/
    fonts/
    textures/
  utils/
    loader.js        GLTF + texture loading with progress
    math.js          Vector helpers
tests/
  interaction.test.js
docs/
  DECISIONS.md
index.html
vite.config.js
package.json
```

## Performance Rules
- Max initial bundle: 200kb gzipped
- No blocking assets on first paint
- Lighthouse performance score target: 90+
- WCAG AA for text content (project descriptions must be screen-readable)

## Definition of Done
- [ ] Live on Vercel/GitHub Pages — URL replaces olavoshew.github.io link in CV
- [ ] All 10 portfolio projects shown as navigable cards
- [ ] Works on iPhone Safari + Chrome mobile without jank
- [ ] Load time under 3s on fast 3G (Lighthouse)
- [ ] Source on GitHub

## Why This Impresses Recruiters
The portfolio is the demo. Shows Three.js, spatial thinking (from Unity background), performance awareness, and creative direction simultaneously. Screams "creative technologist" without needing a label.

## Stand Out Further
Add a subtle audio ambient layer (leverages music background). Make it opt-in — a small unmute icon. Most devs won't think of this.
