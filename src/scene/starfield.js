import {
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  Color
} from 'three'

const STAR_COUNT = 2000
const FIELD_RADIUS = 80

function createNebulaTexture(colorA, colorB) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, colorA)
  gradient.addColorStop(0.4, colorB)
  gradient.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  return new CanvasTexture(canvas)
}

function createStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.6)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 32, 32)

  return new CanvasTexture(canvas)
}

function randomInSphere(radius) {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = Math.cbrt(Math.random()) * radius

  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  ]
}

export function createStarfield(scene) {
  const positions = new Float32Array(STAR_COUNT * 3)
  const sizes = new Float32Array(STAR_COUNT)
  const twinkleOffsets = new Float32Array(STAR_COUNT)

  for (let i = 0; i < STAR_COUNT; i++) {
    const [x, y, z] = randomInSphere(FIELD_RADIUS)
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    sizes[i] = 0.5 + Math.random() * 1.5
    twinkleOffsets[i] = Math.random() * Math.PI * 2
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('size', new BufferAttribute(sizes, 1))

  const starTexture = createStarTexture()

  const material = new PointsMaterial({
    size: 0.3,
    map: starTexture,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
    color: 0xffffff,
    opacity: 0.9
  })

  const stars = new Points(geometry, material)
  stars.userData.twinkleOffsets = twinkleOffsets
  scene.add(stars)

  const nebulae = []
  const nebulaConfigs = [
    { color: 'rgba(80,0,120,0.15)', colorB: 'rgba(40,0,80,0.05)', pos: [-30, 10, -60], scale: 40 },
    { color: 'rgba(0,40,120,0.12)', colorB: 'rgba(0,20,80,0.04)', pos: [35, -5, -55], scale: 35 },
    { color: 'rgba(120,20,60,0.10)', colorB: 'rgba(80,10,40,0.03)', pos: [10, -20, -65], scale: 50 },
    { color: 'rgba(20,80,120,0.10)', colorB: 'rgba(10,40,80,0.03)', pos: [-40, 15, -50], scale: 30 }
  ]

  for (const cfg of nebulaConfigs) {
    const tex = createNebulaTexture(cfg.color, cfg.colorB)
    const mat = new SpriteMaterial({ map: tex, blending: AdditiveBlending, transparent: true, depthWrite: false, opacity: 1 })
    const sprite = new Sprite(mat)
    sprite.position.set(...cfg.pos)
    sprite.scale.set(cfg.scale, cfg.scale, 1)
    scene.add(sprite)
    nebulae.push(sprite)
  }

  return { stars, nebulae }
}

export function updateStarfield(starfield, elapsed) {
  if (!starfield) return
  const { stars } = starfield
  const offsets = stars.userData.twinkleOffsets

  let opacity = 0.75 + 0.15 * Math.sin(elapsed * 0.5)
  stars.material.opacity = opacity

  stars.rotation.y = elapsed * 0.008
}
