import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  build: {
    target: 'esnext'
  }
})
