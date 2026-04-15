let gsapModule = null
let overlay = null
let isVisible = false
let closeRequestedCallback = null

function createOverlayDOM() {
  overlay = document.createElement('div')
  overlay.id = 'project-overlay'
  overlay.innerHTML = `
    <div class="overlay-content">
      <button class="overlay-close" aria-label="Close project detail">&times;</button>
      <h2 class="overlay-title"></h2>
      <div class="overlay-media"></div>
      <p class="overlay-description"></p>
      <div class="overlay-tech"></div>
      <div class="overlay-links"></div>
    </div>
  `
  overlay.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    pointer-events: none;
    opacity: 0;
    transform: translateY(60px);
  `

  const style = document.createElement('style')
  style.textContent = `
    #project-overlay .overlay-content {
      background: rgba(13, 13, 26, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 32px 40px;
      max-width: 600px;
      margin: 0 auto 24px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      position: relative;
    }
    #project-overlay .overlay-close {
      position: absolute;
      top: 12px;
      right: 16px;
      background: none;
      border: none;
      color: #b0b0b0;
      font-size: 28px;
      cursor: pointer;
      padding: 4px 8px;
      line-height: 1;
    }
    #project-overlay .overlay-close:hover {
      color: #ffffff;
    }
    #project-overlay .overlay-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 12px;
    }
    #project-overlay .overlay-media {
      aspect-ratio: 16 / 9;
      border-radius: 8px;
      overflow: hidden;
      margin: 0 0 16px;
      display: none;
    }
    #project-overlay .overlay-media video,
    #project-overlay .overlay-media iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    #project-overlay .overlay-description {
      font-size: 15px;
      line-height: 1.5;
      color: #d0d0d0;
      margin: 0 0 16px;
    }
    #project-overlay .overlay-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 0 0 16px;
    }
    #project-overlay .tech-tag {
      background: rgba(255, 255, 255, 0.1);
      color: #b0b0b0;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
    }
    #project-overlay .overlay-links {
      display: flex;
      gap: 12px;
    }
    #project-overlay .overlay-link {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      text-decoration: none;
      font-size: 14px;
      transition: background 0.2s;
    }
    #project-overlay .overlay-link:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(overlay)

  overlay.querySelector('.overlay-close').addEventListener('click', () => {
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

export async function showProject(project) {
  if (!overlay) createOverlayDOM()

  overlay.querySelector('.overlay-title').textContent = project.title
  overlay.querySelector('.overlay-description').textContent = project.description

  const techContainer = overlay.querySelector('.overlay-tech')
  techContainer.innerHTML = project.tech
    .map((t) => `<span class="tech-tag">${t}</span>`)
    .join('')

  const mediaContainer = overlay.querySelector('.overlay-media')
  mediaContainer.innerHTML = ''
  mediaContainer.style.display = 'none'
  if (project.media && project.media.src) {
    if (project.media.type === 'video') {
      mediaContainer.innerHTML = `<video src="${project.media.src}" controls playsinline></video>`
      mediaContainer.style.display = 'block'
    } else if (project.media.type === 'iframe') {
      mediaContainer.innerHTML = `<iframe src="${project.media.src}" loading="lazy" sandbox="allow-scripts allow-same-origin"></iframe>`
      mediaContainer.style.display = 'block'
    }
  }

  const linksContainer = overlay.querySelector('.overlay-links')
  linksContainer.innerHTML = ''
  if (project.url) {
    linksContainer.innerHTML = `<a class="overlay-link" href="${project.url}" target="_blank" rel="noopener noreferrer">View Project</a>`
  }

  overlay.style.pointerEvents = 'auto'
  isVisible = true

  const gsap = await loadGSAP()
  gsap.to(overlay, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: 'power2.out'
  })
}

export async function hideOverlay() {
  if (!isVisible || !overlay) return
  isVisible = false

  const gsap = await loadGSAP()
  gsap.to(overlay, {
    opacity: 0,
    y: 60,
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
  overlay.style.transform = 'translateY(60px)'
  overlay.style.pointerEvents = 'none'
}

export function onCloseRequested(fn) {
  closeRequestedCallback = fn
}

export function isOverlayVisible() {
  return isVisible
}
