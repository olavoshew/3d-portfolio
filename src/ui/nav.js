let container = null
let dots = []
let clickCallback = null

export function createNav(projects) {
  container = document.createElement('div')
  container.id = 'nav-dots'
  container.style.cssText = `
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 50;
  `

  const style = document.createElement('style')
  style.textContent = `
    #nav-dots .nav-dot {
      position: relative;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
      background: transparent;
      padding: 0;
    }
    #nav-dots .nav-dot::after {
      content: attr(data-label);
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(8, 8, 22, 0.9);
      backdrop-filter: blur(8px);
      color: rgba(255,255,255,0.85);
      font-size: 11px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      white-space: nowrap;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.08);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      letter-spacing: 0.03em;
    }
    #nav-dots .nav-dot:hover {
      transform: scale(1.5);
      border-color: rgba(255, 255, 255, 0.7);
    }
    #nav-dots .nav-dot:hover::after {
      opacity: 1;
    }
    #nav-dots .nav-dot.active {
      transform: scale(1.4);
      border-color: transparent;
    }
    @keyframes nav-pulse {
      0%, 100% { box-shadow: 0 0 0 0 var(--dot-glow); }
      50% { box-shadow: 0 0 0 4px transparent; }
    }
    #nav-dots .nav-dot.active {
      animation: nav-pulse 2s ease infinite;
    }
  `
  document.head.appendChild(style)

  projects.forEach((project, index) => {
    const dot = document.createElement('button')
    dot.className = 'nav-dot'
    dot.style.setProperty('--dot-glow', project.color + '66')
    dot.setAttribute('aria-label', `Navigate to ${project.title}`)
    dot.setAttribute('data-label', project.title)
    dot.addEventListener('click', () => {
      if (clickCallback) clickCallback(index)
    })
    container.appendChild(dot)
    dots.push(dot)
  })

  document.body.appendChild(container)
  return container
}

export function setActiveDot(index) {
  dots.forEach((dot, i) => {
    const project = dot.parentElement
    if (i === index) {
      dot.classList.add('active')
      const color = dot.style.getPropertyValue('--dot-glow').replace('66', '')
      dot.style.background = color
      dot.style.borderColor = 'transparent'
      dot.style.boxShadow = `0 0 8px ${color}99`
    } else {
      dot.classList.remove('active')
      dot.style.background = 'transparent'
      dot.style.borderColor = 'rgba(255,255,255,0.2)'
      dot.style.boxShadow = 'none'
    }
  })
}

export function clearActiveDot() {
  dots.forEach((dot) => {
    dot.classList.remove('active')
    dot.style.background = 'transparent'
    dot.style.borderColor = 'rgba(255,255,255,0.2)'
    dot.style.boxShadow = 'none'
  })
}

export function onDotClick(fn) {
  clickCallback = fn
}
