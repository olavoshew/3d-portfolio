import { AmbientLight, DirectionalLight, FogExp2, Color } from 'three'

export function setupEnvironment(scene) {
  scene.background = new Color(0x000000)

  const ambient = new AmbientLight(0x222244, 0.4)
  scene.add(ambient)

  const directional = new DirectionalLight(0xffffff, 0.6)
  directional.position.set(5, 10, 7)
  scene.add(directional)

  const fill = new DirectionalLight(0x4466aa, 0.3)
  fill.position.set(-5, -2, -5)
  scene.add(fill)

  scene.fog = new FogExp2(0x000000, 0.005)
}
