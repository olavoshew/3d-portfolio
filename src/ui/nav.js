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
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: transform 0.2s, border-color 0.2s;
      background: transparent;
      padding: 0;
    }
    #nav-dots .nav-dot:hover {
      transform: scale(1.4);
      border-color: rgba(255, 255, 255, 0.8);
    }
    #nav-dots .nav-dot.active {
      transform: scale(1.3);
      border-color: #ffffff;
    }
  `
  document.head.appendChild(style)

  projects.forEach((project, index) => {
    const dot = document.createElement('button')
    dot.className = 'nav-dot'
    dot.style.backgroundColor = project.color
    dot.setAttribute('aria-label', `Navigate to ${project.title}`)
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
    dot.classList.toggle('active', i === index)
  })
}

export function clearActiveDot() {
  dots.forEach((dot) => dot.classList.remove('active'))
}

export function onDotClick(fn) {
  clickCallback = fn
}
