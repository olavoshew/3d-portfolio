import { AmbientLight, DirectionalLight, FogExp2, Color } from 'three'

export function setupEnvironment(scene) {
  scene.background = new Color(0x1a1a2e)

  const ambient = new AmbientLight(0x404040, 0.6)
  scene.add(ambient)

  const directional = new DirectionalLight(0xffffff, 0.8)
  directional.position.set(5, 10, 7)
  scene.add(directional)

  scene.fog = new FogExp2(0x1a1a2e, 0.015)
}
