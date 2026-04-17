import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  CanvasTexture,
  Raycaster,
  Vector2,
  Vector3,
  Object3D,
  DoubleSide
} from 'three'
export function loadIconImages(projects) {
  return Promise.all(
    projects.map((_, i) => {
      return new Promise((resolve) => {
        const img = new window.Image()
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = `/img/icons/${i + 1}.png`
      })
    })
  )
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function createCardTexture(project, iconImage) {
  const { title, tags, color } = project
  const W = 768
  const H = 1024
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const { r, g, b } = hexToRgb(color)

  ctx.clearRect(0, 0, W, H)

  const margin = 16

  // Background: navy gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
  bgGrad.addColorStop(0, '#0B1220')
  bgGrad.addColorStop(1, '#162033')
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 28)
  ctx.fillStyle = bgGrad
  ctx.fill()

  // Outer glow layers (accent color)
  const glowLayers = [
    { expand: 18, line: 20, alpha: 0.04 },
    { expand: 12, line: 14, alpha: 0.07 },
    { expand: 7, line: 9, alpha: 0.10 },
    { expand: 3, line: 5, alpha: 0.15 }
  ]
  for (const { expand, line, alpha } of glowLayers) {
    roundRect(ctx, margin - expand, margin - expand, W - (margin - expand) * 2, H - (margin - expand) * 2, 32)
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
    ctx.lineWidth = line
    ctx.stroke()
  }

  // Card border: navy base + accent overlay
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 28)
  ctx.strokeStyle = '#24324A'
  ctx.lineWidth = 2.5
  ctx.stroke()

  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 28)
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Top accent line (4px, full brightness)
  const accentGrad = ctx.createLinearGradient(margin + 1, margin + 1, W - margin - 1, margin + 1)
  accentGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
  accentGrad.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, 1)`)
  accentGrad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, 1)`)
  accentGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  ctx.fillStyle = accentGrad
  ctx.fillRect(margin + 36, margin + 1, W - (margin + 36) * 2, 4)

  // Icon glow halo
  const iconCX = W / 2
  const iconCY = 158
  const iconSize = 160
  const halo = ctx.createRadialGradient(iconCX, iconCY, 0, iconCX, iconCY, 140)
  halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.30)`)
  halo.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.12)`)
  halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  ctx.fillStyle = halo
  ctx.fillRect(iconCX - 160, iconCY - 140, 320, 280)

  // Icon — PNG illustration
  if (iconImage) {
    ctx.drawImage(iconImage, iconCX - iconSize / 2, iconCY - iconSize / 2, iconSize, iconSize)
  }

  // Title (Fredoka, 700)
  ctx.font = '700 44px "Fredoka", "Nunito", sans-serif'
  ctx.fillStyle = '#F7FAFF'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const maxWidth = W - 100
  const words = title.split(' ')
  const lines = []
  let currentLine = ''
  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(test).width > maxWidth) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = test
    }
  }
  if (currentLine) lines.push(currentLine)

  const lineH = 54
  const titleBlockH = lines.length * lineH
  const titleY = 268
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, titleY + i * lineH)
  })

  // Screenshot / chart placeholder
  const ssX = margin + 24
  const ssY = titleY + titleBlockH + 28
  const ssW = W - (margin + 24) * 2
  const ssH = 300
  const ssR = 16

  roundRect(ctx, ssX, ssY, ssW, ssH, ssR)
  ctx.save()
  ctx.clip()

  const chartBg = ctx.createLinearGradient(ssX, ssY, ssX + ssW, ssY + ssH)
  chartBg.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.06)`)
  chartBg.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.18)`)
  ctx.fillStyle = chartBg
  ctx.fillRect(ssX, ssY, ssW, ssH)

  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.15)`
  ctx.lineWidth = 1
  for (let row = 1; row <= 5; row++) {
    const ly = ssY + (ssH / 6) * row
    ctx.beginPath()
    ctx.moveTo(ssX, ly)
    ctx.lineTo(ssX + ssW, ly)
    ctx.stroke()
  }

  const barWidths = [0.72, 0.48, 0.6, 0.38, 0.52]
  const barSpacing = ssH * 0.12
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  barWidths.forEach((bw, i) => {
    const by = ssY + barSpacing + i * barSpacing * 1.28
    ctx.beginPath()
    ctx.moveTo(ssX + ssW * 0.08, by)
    ctx.lineTo(ssX + ssW * 0.08 + ssW * bw, by)
    ctx.stroke()
  })

  const dotPositions = [[0.12, 0.22], [0.28, 0.18], [0.45, 0.28], [0.62, 0.15], [0.78, 0.24], [0.88, 0.19]]
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.65)`
  dotPositions.forEach(([dx, dy]) => {
    ctx.beginPath()
    ctx.arc(ssX + ssW * dx, ssY + ssH * dy + ssH * 0.5, 6, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.45)`
  ctx.lineWidth = 2
  ctx.beginPath()
  dotPositions.forEach(([dx, dy], i) => {
    const px = ssX + ssW * dx
    const py = ssY + ssH * dy + ssH * 0.5
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()

  ctx.restore()

  roundRect(ctx, ssX, ssY, ssW, ssH, ssR)
  ctx.strokeStyle = '#24324A'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Tag pills (Inter 500)
  if (tags && tags.length) {
    const tagAreaY = ssY + ssH + 36
    const tagList = tags.slice(0, 4)
    ctx.font = '500 21px "Inter", sans-serif'
    ctx.textAlign = 'center'

    const tagPad = 18
    const tagH = 38
    const tagSpacing = 10
    let totalTagW = 0
    const tagWidths = tagList.map(t => {
      const w = ctx.measureText(t).width + tagPad * 2
      totalTagW += w + tagSpacing
      return w
    })
    totalTagW -= tagSpacing

    let tagX = W / 2 - totalTagW / 2

    tagList.forEach((tag, idx) => {
      const tw = tagWidths[idx]
      roundRect(ctx, tagX, tagAreaY - tagH / 2, tw, tagH, tagH / 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.22)`
      ctx.fill()
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = '#F7FAFF'
      ctx.globalAlpha = 0.85
      ctx.fillText(tag, tagX + tw / 2, tagAreaY)
      ctx.globalAlpha = 1
      tagX += tw + tagSpacing
    })
  }

  return new CanvasTexture(canvas)
}

export function createCards(projects, scene, iconImages) {
  const cards = []
  const count = projects.length
  const radius = 8
  const arcSpan = Math.PI * 0.9
  const startAngle = -arcSpan / 2

  for (let i = 0; i < count; i++) {
    const project = projects[i]
    const angle = startAngle + (i / (count - 1)) * arcSpan
    const x = Math.sin(angle) * radius
    const z = -Math.cos(angle) * radius + radius * 0.3
    const y = Math.sin(angle * 2) * 0.5

    const iconImage = iconImages ? iconImages[i] : null
    const texture = createCardTexture(project, iconImage)
    const geometry = new PlaneGeometry(2.5, 3.5)
    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
      transparent: true,
      opacity: 0.95
    })

    const mesh = new Mesh(geometry, material)
    mesh.position.set(x, y, z)
    mesh.lookAt(0, 0, 3)
    mesh.userData = { projectId: project.id, project, originalPosition: mesh.position.clone(), originalQuaternion: mesh.quaternion.clone() }

    scene.add(mesh)
    cards.push(mesh)
  }

  return cards
}

export function setupInteraction(cards, cameraRef, rendererRef) {
  const raycaster = new Raycaster()
  const pointer = new Vector2()
  let clickCallback = null
  let hoverCallback = null
  let currentHovered = null

  rendererRef.domElement.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, cameraRef)
    const intersects = raycaster.intersectObjects(cards)

    const hit = intersects.length > 0 ? intersects[0].object : null

    if (hit !== currentHovered) {
      if (currentHovered && hoverCallback) hoverCallback(null, currentHovered)
      currentHovered = hit
      if (currentHovered && hoverCallback) hoverCallback(currentHovered, null)
      rendererRef.domElement.style.cursor = currentHovered ? 'pointer' : 'default'
    }
  })

  rendererRef.domElement.addEventListener('pointerdown', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, cameraRef)
    const intersects = raycaster.intersectObjects(cards)

    if (intersects.length > 0 && clickCallback) {
      clickCallback(intersects[0].object)
    }
  })

  return {
    onCardClick(fn) { clickCallback = fn },
    onCardHover(fn) { hoverCallback = fn }
  }
}

export function createCardAnimator() {
  const rotAnimations = []
  let posAnimations = []
  const _helper = new Object3D()

  const wiggle = {
    mesh: null,
    active: false,
    amplitude: 0,
    elapsed: 0
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  function moveTo(mesh, targetPos, duration = 0.6) {
    posAnimations = posAnimations.filter(a => a.mesh !== mesh)
    posAnimations.push({
      mesh,
      startPos: mesh.position.clone(),
      targetPos: targetPos.clone(),
      elapsed: 0,
      duration
    })
  }

  function moveToOriginal(mesh, duration = 0.4) {
    moveTo(mesh, mesh.userData.originalPosition, duration)
  }

  function flipToFace(mesh, cameraTarget, duration = 0.6, fromPosition = null) {
    rotAnimations.forEach((a, i) => { if (a.mesh === mesh) rotAnimations.splice(i, 1) })

    _helper.position.copy(fromPosition || mesh.position)
    _helper.lookAt(cameraTarget)
    const targetQ = _helper.quaternion.clone()

    rotAnimations.push({
      mesh,
      startQ: mesh.quaternion.clone(),
      targetQ,
      elapsed: 0,
      duration
    })
  }

  function flipToOriginal(mesh, duration = 0.4) {
    rotAnimations.forEach((a, i) => { if (a.mesh === mesh) rotAnimations.splice(i, 1) })

    rotAnimations.push({
      mesh,
      startQ: mesh.quaternion.clone(),
      targetQ: mesh.userData.originalQuaternion.clone(),
      elapsed: 0,
      duration
    })
  }

  function setHovered(mesh) {
    if (wiggle.mesh === mesh && wiggle.active) return
    wiggle.mesh = mesh
    wiggle.active = true
    wiggle.elapsed = 0
  }

  function clearHovered() {
    wiggle.active = false
  }

  function update(deltaTime) {
    for (let i = rotAnimations.length - 1; i >= 0; i--) {
      const anim = rotAnimations[i]
      anim.elapsed += deltaTime
      let t = Math.min(anim.elapsed / anim.duration, 1)
      t = easeOutCubic(t)

      anim.mesh.quaternion.slerpQuaternions(anim.startQ, anim.targetQ, t)

      if (anim.elapsed >= anim.duration) {
        anim.mesh.quaternion.copy(anim.targetQ)
        rotAnimations.splice(i, 1)
      }
    }

    for (let i = posAnimations.length - 1; i >= 0; i--) {
      const anim = posAnimations[i]
      anim.elapsed += deltaTime
      let t = Math.min(anim.elapsed / anim.duration, 1)
      t = easeOutCubic(t)
      anim.mesh.position.lerpVectors(anim.startPos, anim.targetPos, t)
      if (anim.elapsed >= anim.duration) {
        anim.mesh.position.copy(anim.targetPos)
        posAnimations.splice(i, 1)
      }
    }

    if (wiggle.mesh) {
      wiggle.elapsed += deltaTime
      const targetAmp = wiggle.active ? 0.028 : 0
      wiggle.amplitude += (targetAmp - wiggle.amplitude) * Math.min(deltaTime * 10, 1)

      const isBeingAnimated = rotAnimations.some(a => a.mesh === wiggle.mesh)

      if (!isBeingAnimated && wiggle.amplitude > 0.0005) {
        const osc = Math.sin(wiggle.elapsed * 8) * wiggle.amplitude
        wiggle.mesh.rotation.setFromQuaternion(wiggle.mesh.userData.originalQuaternion)
        wiggle.mesh.rotateZ(osc)
      }

      if (!wiggle.active && wiggle.amplitude < 0.0005) {
        const isRotating = rotAnimations.some(a => a.mesh === wiggle.mesh)
        if (!isRotating) {
          wiggle.mesh.quaternion.copy(wiggle.mesh.userData.originalQuaternion)
        }
        wiggle.mesh = null
        wiggle.amplitude = 0
      }
    }
  }

  return { flipToFace, flipToOriginal, moveTo, moveToOriginal, setHovered, clearHovered, update }
}
