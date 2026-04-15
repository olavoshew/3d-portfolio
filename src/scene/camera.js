import { Vector3 } from 'three'

const easings = {
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInQuart: (t) => t * t * t * t,
  easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeOutBack: (t) => {
    const c3 = 2.70158
    return 1 + c3 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2)
  }
}

export function createCameraController(camera) {
  const state = {
    startPosition: new Vector3(),
    targetPosition: new Vector3(),
    isMoving: false,
    elapsed: 0,
    duration: 1,
    easingFn: easings.easeOutCubic,
    onComplete: null
  }

  function moveToPosition(target, duration = 1, options = {}) {
    state.startPosition.copy(camera.position)
    state.targetPosition.copy(target)
    state.elapsed = 0
    state.duration = duration
    state.isMoving = true
    state.easingFn = easings[options.easing] || easings.easeOutCubic
    state.onComplete = options.onComplete || null
  }

  function update(deltaTime) {
    if (!state.isMoving) return

    state.elapsed += deltaTime
    let t = Math.min(state.elapsed / state.duration, 1)
    let alpha = state.easingFn(t)

    camera.position.lerpVectors(state.startPosition, state.targetPosition, alpha)

    if (state.elapsed >= state.duration) {
      state.isMoving = false
      camera.position.copy(state.targetPosition)
      if (state.onComplete) state.onComplete()
    }
  }

  function isMoving() {
    return state.isMoving
  }

  return { moveToPosition, update, isMoving, state }
}
