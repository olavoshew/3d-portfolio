import {
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  CanvasTexture,
  Raycaster,
  Vector2,
  Vector3,
  Object3D,
  Color,
  DoubleSide
} from 'three'
import { drawIcon } from './icons.js'

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

function createCardTexture(project) {
  const { title, tags, color, id } = project
  const W = 768
  const H = 1024
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const { r, g, b } = hexToRgb(color)

  ctx.clearRect(0, 0, W, H)

  const margin = 16
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 28)
  ctx.fillStyle = 'rgba(8, 8, 20, 0.88)'
  ctx.fill()

  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 28)
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`
  ctx.lineWidth = 2
  ctx.stroke()

  for (let i = 3; i >= 1; i--) {
    roundRect(ctx, margin - i * 3, margin - i * 3, W - (margin - i * 3) * 2, H - (margin - i * 3) * 2, 32)
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.04 * (4 - i)})`
    ctx.lineWidth = i * 4
    ctx.stroke()
  }

  const accentGrad = ctx.createLinearGradient(margin + 1, margin + 1, W - margin - 1, margin + 1)
  accentGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
  accentGrad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.9)`)
  accentGrad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.9)`)
  accentGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  ctx.fillStyle = accentGrad
  ctx.fillRect(margin + 28, margin + 1, W - (margin + 28) * 2, 3)

  // Icon
  ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.9)`
  ctx.shadowBlur = 18
  drawIcon(ctx, id, W / 2, 140, 120, color)
  ctx.shadowBlur = 0

  // Title
  ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`
  ctx.shadowBlur = 12
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillStyle = '#ffffff'
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
  const titleY = 260
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, titleY + i * lineH)
  })
  ctx.shadowBlur = 0

  // Screenshot placeholder
  const ssX = margin + 24
  const ssY = titleY + titleBlockH + 28
  const ssW = W - (margin + 24) * 2
  const ssH = 300
  const ssR = 14

  roundRect(ctx, ssX, ssY, ssW, ssH, ssR)
  ctx.save()
  ctx.clip()

  const bgGrad = ctx.createLinearGradient(ssX, ssY, ssX + ssW, ssY + ssH)
  bgGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.04)`)
  bgGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.14)`)
  ctx.fillStyle = bgGrad
  ctx.fillRect(ssX, ssY, ssW, ssH)

  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.12)`
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
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.28)`
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  barWidths.forEach((bw, i) => {
    const by = ssY + barSpacing + i * barSpacing * 1.28
    ctx.beginPath()
    ctx.moveTo(ssX + ssW * 0.08, by)
    ctx.lineTo(ssX + ssW * 0.08 + ssW * bw, by)
    ctx.stroke()
  })

  const dotPositions = [[0.12, 0.22], [0.28, 0.18], [0.45, 0.28], [0.62, 0.15], [0.78, 0.24], [0.88, 0.19]]
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`
  dotPositions.forEach(([dx, dy]) => {
    ctx.beginPath()
    ctx.arc(ssX + ssW * dx, ssY + ssH * dy + ssH * 0.5, 5, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.35)`
  ctx.lineWidth = 1.5
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
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.3)`
  ctx.lineWidth = 1
  ctx.stroke()

  // Intent tags
  if (tags && tags.length) {
    const tagAreaY = ssY + ssH + 32
    const tagList = tags.slice(0, 4)
    ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.textAlign = 'center'

    const tagPad = 16
    const tagH = 36
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
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.18)`
      ctx.fill()
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.45)`
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fillText(tag, tagX + tw / 2, tagAreaY)
      tagX += tw + tagSpacing
    })
  }

  const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.75)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(0,0,0,0.3)')
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 28)
  ctx.fillStyle = vignette
  ctx.fill()

  return new CanvasTexture(canvas)
}

export function createCards(projects, scene) {
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

    const texture = createCardTexture(project)
    const geometry = new PlaneGeometry(2.5, 3.5)
    const material = new MeshStandardMaterial({
      map: texture,
      side: DoubleSide,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.95,
      emissive: new Color(project.color),
      emissiveIntensity: 0.15
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
