import {
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  CanvasTexture,
  Raycaster,
  Vector2,
  Vector3,
  Quaternion,
  Object3D,
  Color,
  DoubleSide
} from 'three'

function createCardTexture(title, color) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 712
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = color
  ctx.fillRect(0, 0, 512, 712)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
  ctx.fillRect(0, 0, 512, 712)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const words = title.split(' ')
  let lines = []
  let currentLine = ''
  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(test).width > 420) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = test
    }
  }
  if (currentLine) lines.push(currentLine)

  const lineHeight = 44
  const startY = 356 - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((line, i) => {
    ctx.fillText(line, 256, startY + i * lineHeight)
  })

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 4
  ctx.strokeRect(20, 20, 472, 672)

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

    const texture = createCardTexture(project.title, project.color)
    const geometry = new PlaneGeometry(2.5, 3.5)
    const material = new MeshStandardMaterial({
      map: texture,
      side: DoubleSide,
      roughness: 0.6,
      metalness: 0.1,
      emissive: new Color(project.color),
      emissiveIntensity: 0.05
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
  let callback = null

  rendererRef.domElement.addEventListener('pointerdown', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, cameraRef)
    const intersects = raycaster.intersectObjects(cards)

    if (intersects.length > 0 && callback) {
      callback(intersects[0].object)
    }
  })

  return {
    onCardClick(fn) {
      callback = fn
    }
  }
}

export function createCardAnimator() {
  const animations = []
  let posAnimations = []
  const _helper = new Object3D()
  const _q = new Quaternion()

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

  function flipToFace(mesh, cameraTarget, duration = 0.6) {
    animations.forEach((a, i) => { if (a.mesh === mesh) animations.splice(i, 1) })

    _helper.position.copy(mesh.position)
    _helper.lookAt(cameraTarget)
    const targetQ = _helper.quaternion.clone()

    animations.push({
      mesh,
      startQ: mesh.quaternion.clone(),
      targetQ,
      elapsed: 0,
      duration
    })
  }

  function flipToOriginal(mesh, duration = 0.4) {
    animations.forEach((a, i) => { if (a.mesh === mesh) animations.splice(i, 1) })

    const targetQ = mesh.userData.originalQuaternion

    animations.push({
      mesh,
      startQ: mesh.quaternion.clone(),
      targetQ,
      elapsed: 0,
      duration
    })
  }

  function update(deltaTime) {
    for (let i = animations.length - 1; i >= 0; i--) {
      const anim = animations[i]
      anim.elapsed += deltaTime
      let t = Math.min(anim.elapsed / anim.duration, 1)
      t = easeOutCubic(t)

      _q.copy(anim.startQ)
      _q.slerp(anim.targetQ, t)
      anim.mesh.quaternion.copy(_q)

      if (anim.elapsed >= anim.duration) {
        anim.mesh.quaternion.copy(anim.targetQ)
        animations.splice(i, 1)
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
  }

  return { flipToFace, flipToOriginal, moveTo, moveToOriginal, update }
}
