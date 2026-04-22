let gsapModule = null
let overlay = null
let isVisible = false
let closeRequestedCallback = null

const IS_MOBILE = () => window.innerWidth <= 768

function injectStyles() {
  if (document.getElementById('overlay-styles')) return
  const style = document.createElement('style')
  style.id = 'overlay-styles'
  style.textContent = `
    #project-overlay {
      position: fixed;
      z-index: 100;
      pointer-events: none;
      opacity: 0;
    }

    #project-overlay.desktop {
      top: 50%;
      right: 32px;
      transform: translateY(-50%) translateX(40px);
      width: 360px;
    }

    #project-overlay.mobile {
      bottom: 0;
      left: 0;
      right: 0;
      transform: translateY(60px);
    }

    .op-card {
      background: rgba(8, 8, 22, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #ffffff;
      max-height: 90vh;
      overflow-y: auto;
      scrollbar-width: none;
    }

    .op-card::-webkit-scrollbar { display: none; }

    .mobile .op-card {
      border-radius: 20px 20px 0 0;
      max-height: 80vh;
      margin: 0;
    }

    .op-video-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: #0a0a1a;
    }

    .op-video-wrap video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .op-video-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .op-video-placeholder svg {
      width: 44px;
      height: 44px;
      opacity: 0.5;
    }

    .op-video-placeholder span {
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.4;
      color: #fff;
    }

    .op-accent-bar {
      height: 3px;
      width: 100%;
    }

    .op-body {
      padding: 20px 24px 24px;
    }

    .op-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .op-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.35);
      font-size: 22px;
      cursor: pointer;
      padding: 0 0 0 12px;
      line-height: 1;
      flex-shrink: 0;
      margin-top: 2px;
      transition: color 0.2s;
    }

    .op-close:hover { color: rgba(255,255,255,0.8); }

    .op-title {
      font-size: 22px;
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
      letter-spacing: -0.01em;
    }

    .op-description {
      font-size: 13px;
      line-height: 1.6;
      color: rgba(255,255,255,0.6);
      margin: 0 0 18px;
    }

    .op-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border-top: 1px solid rgba(255,255,255,0.07);
      border-bottom: 1px solid rgba(255,255,255,0.07);
      margin-bottom: 18px;
      padding: 12px 0;
      gap: 4px;
    }

    .op-stat {
      text-align: center;
    }

    .op-stat-label {
      display: block;
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
      margin-bottom: 4px;
    }

    .op-stat-value {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
    }

    .op-repo {
      margin-bottom: 16px;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.05);
    }

    .op-repo.hidden {
      display: none;
    }

    .op-repo-label {
      display: block;
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.45);
      margin-bottom: 4px;
    }

    .op-repo-value {
      display: block;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 2px;
      color: #fff;
    }

    .op-repo-reason {
      margin: 0;
      font-size: 12px;
      line-height: 1.45;
      color: rgba(255,255,255,0.72);
    }

    .op-repo.public {
      border-color: rgba(126, 247, 212, 0.45);
      background: rgba(126, 247, 212, 0.12);
    }

    .op-repo.private {
      border-color: rgba(255, 160, 95, 0.5);
      background: rgba(255, 160, 95, 0.14);
    }

    .op-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 18px;
    }

    .op-tag {
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      letter-spacing: 0.03em;
    }

    .op-tag.platform {
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.7);
      border: 1px solid rgba(255,255,255,0.12);
    }

    .op-tag.tech {
      background: var(--accent-subtle);
      color: var(--accent-color);
      border: 1px solid var(--accent-border);
    }

    .op-links {
      display: flex;
      gap: 10px;
    }

    .op-link {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
    }

    .op-link.primary {
      background: var(--accent-color);
      color: #000;
    }

    .op-link.primary:hover {
      filter: brightness(1.15);
    }

    .op-link.ghost {
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.75);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .op-link.ghost:hover {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }
  `
  document.head.appendChild(style)
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function createOverlayDOM() {
  injectStyles()
  overlay = document.createElement('div')
  overlay.id = 'project-overlay'
  overlay.className = IS_MOBILE() ? 'mobile' : 'desktop'

  overlay.innerHTML = `
    <div class="op-card">
      <div class="op-video-wrap">
        <div class="op-video-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
          </svg>
          <span>Video coming soon</span>
        </div>
      </div>
      <div class="op-accent-bar"></div>
      <div class="op-body">
        <div class="op-header">
          <h2 class="op-title"></h2>
          <button class="op-close" aria-label="Close">&times;</button>
        </div>
        <p class="op-description"></p>
        <div class="op-stats">
          <div class="op-stat">
            <span class="op-stat-label">Last Updated</span>
            <span class="op-stat-value op-stat-updated">...</span>
          </div>
          <div class="op-stat">
            <span class="op-stat-label">Prompt to Deploy</span>
            <span class="op-stat-value op-stat-build">...</span>
          </div>
          <div class="op-stat">
            <span class="op-stat-label">Prompts Used</span>
            <span class="op-stat-value op-stat-commits">...</span>
          </div>
        </div>
        <div class="op-repo hidden"></div>
        <div class="op-tags"></div>
        <div class="op-links"></div>
      </div>
    </div>
  `

  document.body.appendChild(overlay)

  overlay.querySelector('.op-close').addEventListener('click', () => {
    if (closeRequestedCallback) closeRequestedCallback()
  })

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isVisible && closeRequestedCallback) closeRequestedCallback()
  })
}

async function loadGSAP() {
  if (!gsapModule) {
    gsapModule = await import('gsap')
  }
  return gsapModule.gsap || gsapModule.default
}

function applyAccentColor(project) {
  const { r, g, b } = hexToRgb(project.color)
  overlay.style.setProperty('--accent-color', project.color)
  overlay.style.setProperty('--accent-subtle', `rgba(${r},${g},${b},0.12)`)
  overlay.style.setProperty('--accent-border', `rgba(${r},${g},${b},0.35)`)

  const bar = overlay.querySelector('.op-accent-bar')
  bar.style.background = `linear-gradient(90deg, transparent, ${project.color}, transparent)`

  const videoWrap = overlay.querySelector('.op-video-wrap')
  videoWrap.style.background = `radial-gradient(ellipse at center, rgba(${r},${g},${b},0.2) 0%, #050510 70%)`
}

function populateVideo(project) {
  const wrap = overlay.querySelector('.op-video-wrap')
  const existing = wrap.querySelector('video')
  if (existing) existing.remove()

  if (project.media && project.media.src && project.media.type === 'video') {
    const video = document.createElement('video')
    video.src = project.media.src
    video.autoplay = true
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;'
    wrap.appendChild(video)
  }
}

function populateRepoStatus(project) {
  const container = overlay.querySelector('.op-repo')
  const visibility = project.repoVisibility || null
  const isPublicSafe = typeof project.repoPublicSafe === 'boolean'
    ? project.repoPublicSafe
    : null
  const privateReason = project.repoPrivateReason || ''

  if (!visibility && isPublicSafe === null && !privateReason) {
    container.className = 'op-repo hidden'
    container.innerHTML = ''
    return
  }

  const isPublic = visibility === 'public' && isPublicSafe !== false
  const status = isPublic ? 'Public Repo Safe' : 'Private Repo'
  const reason = isPublic
    ? 'Safe to share publicly (no personal info flagged).'
    : (privateReason || 'Not available for public sharing.')

  container.className = `op-repo ${isPublic ? 'public' : 'private'}`
  container.innerHTML = `
    <span class="op-repo-label">Repository</span>
    <span class="op-repo-value">${status}</span>
    <p class="op-repo-reason">${reason}</p>
  `
}

function populateTags(project) {
  const container = overlay.querySelector('.op-tags')
  const tags = []

  if (project.platform) {
    tags.push(`<span class="op-tag platform">${project.platform}</span>`)
  }

  const techTags = (project.tech || []).map(t => `<span class="op-tag tech">${t}</span>`)
  const skillTags = (project.skills || []).map(s => `<span class="op-tag tech">${s}</span>`)

  container.innerHTML = [...tags, ...techTags, ...skillTags].join('')
}

function populateLinks(project) {
  const container = overlay.querySelector('.op-links')
  const links = []
  const canShowGithub = project.repoVisibility !== 'private'

  if (project.url) {
    links.push(`<a class="op-link primary" href="${project.url}" target="_blank" rel="noopener noreferrer">View Project</a>`)
  }
  if (project.github && canShowGithub) {
    links.push(`<a class="op-link ghost" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`)
  }

  container.innerHTML = links.join('')
}

function relativeTime(dateStr) {
  if (!dateStr) return 'N/A'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

async function fetchStats(project) {
  if (!project.github_repo) return

  try {
    const { getProjectMeta } = await import('../data/github.js')
    const meta = await getProjectMeta(project.github_repo)

    if (meta.lastUpdated) {
      overlay.querySelector('.op-stat-updated').textContent = relativeTime(meta.lastUpdated)
    }
  } catch {
    // silently fall back to hardcoded values
  }
}

export async function showProject(project) {
  if (!overlay) createOverlayDOM()

  overlay.className = IS_MOBILE() ? 'mobile' : 'desktop'

  applyAccentColor(project)
  populateVideo(project)

  overlay.querySelector('.op-title').textContent = project.title
  overlay.querySelector('.op-description').textContent = project.description
  overlay.querySelector('.op-stat-updated').textContent = '...'
  overlay.querySelector('.op-stat-build').textContent = project.buildTime || '...'
  overlay.querySelector('.op-stat-commits').textContent = project.prompts || '1'

  populateRepoStatus(project)
  populateTags(project)
  populateLinks(project)

  overlay.style.pointerEvents = 'auto'
  isVisible = true

  const gsap = await loadGSAP()
  const mobile = IS_MOBILE()

  if (mobile) {
    gsap.fromTo(overlay,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    )
  } else {
    gsap.fromTo(overlay,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
    )
  }

  fetchStats(project)
}

export async function hideOverlay() {
  if (!isVisible || !overlay) return
  isVisible = false

  const gsap = await loadGSAP()
  const mobile = IS_MOBILE()

  gsap.to(overlay, {
    opacity: 0,
    ...(mobile ? { y: 60 } : { x: 40 }),
    duration: 0.3,
    ease: 'power2.in',
    onComplete() {
      overlay.style.pointerEvents = 'none'
    }
  })
}

export function hideOverlayFast() {
  if (!overlay) return
  isVisible = false
  overlay.style.opacity = '0'
  overlay.style.pointerEvents = 'none'
}

export function onCloseRequested(fn) {
  closeRequestedCallback = fn
}

export function isOverlayVisible() {
  return isVisible
}
