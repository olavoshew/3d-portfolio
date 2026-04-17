import { WebGLRenderer, PerspectiveCamera, Scene, Clock, Vector3 } from 'three'
import { setupEnvironment } from './scene/environment.js'
import { createCameraController } from './scene/camera.js'
import { createCards, setupInteraction, createCardAnimator } from './scene/cards.js'
import { createStarfield, updateStarfield } from './scene/starfield.js'
import { showProject, hideOverlay, hideOverlayFast, onCloseRequested, isOverlayVisible } from './ui/overlay.js'
import { createNav, setActiveDot, clearActiveDot, onDotClick } from './ui/nav.js'
import { createAudioController } from './audio/ambient.js'
import projects from './data/projects.json'

const HOME_POSITION = new Vector3(0, 2, 10)
const PRESENT_POSITION = new Vector3(0, 0.5, 6)
const VIEW_POSITION = new Vector3(0, 1.2, 9.5)
const CARD_LEFT_POSITION = new Vector3(-0.3, 0.5, 6)
const IS_MOBILE = window.innerWidth <= 768

const renderer = new WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.copy(HOME_POSITION)
camera.lookAt(0, 0, 0)

const scene = new Scene()
setupEnvironment(scene)

const starfield = createStarfield(scene)
const cameraController = createCameraController(camera)
const cardAnimator = createCardAnimator()
const clock = new Clock()

const cards = createCards(projects, scene)
const interaction = setupInteraction(cards, camera, renderer)

let selectedCard = null
let spotlightTimeout = null

function resetCard(mesh) {
  cardAnimator.flipToOriginal(mesh, 0.4)
  cardAnimator.moveToOriginal(mesh, 0.4)
  mesh.scale.set(1, 1, 1)
}

function presentCard(mesh) {
  mesh.scale.set(1.1, 1.1, 1.1)
  cardAnimator.moveTo(mesh, PRESENT_POSITION, 0.8)
  cardAnimator.flipToFace(mesh, VIEW_POSITION, 0.6, PRESENT_POSITION)
}

function spotlightCard(mesh) {
  if (spotlightTimeout) clearTimeout(spotlightTimeout)

  spotlightTimeout = setTimeout(() => {
    spotlightTimeout = null
    if (selectedCard !== mesh) return

    if (IS_MOBILE) {
      showProject(mesh.userData.project)
      return
    }

    cardAnimator.moveTo(mesh, CARD_LEFT_POSITION, 0.6)
    showProject(mesh.userData.project)
  }, 250)
}

function zoomToCard(mesh) {
  selectedCard = mesh
  setActiveDot(cards.indexOf(mesh))
  cardAnimator.clearHovered()

  presentCard(mesh)

  cameraController.moveToPosition(VIEW_POSITION, 0.8, {
    easing: 'easeOutExpo',
    onComplete() {
      spotlightCard(mesh)
    }
  })
}

function selectCard(mesh) {
  if (cameraController.isMoving()) return

  if (!selectedCard) {
    zoomToCard(mesh)
    return
  }

  if (selectedCard === mesh) {
    deselectAndGoHome()
    return
  }

  const oldCard = selectedCard
  if (spotlightTimeout) { clearTimeout(spotlightTimeout); spotlightTimeout = null }
  hideOverlayFast()
  resetCard(oldCard)
  selectedCard = null

  cameraController.moveToPosition(HOME_POSITION, 0.35, {
    easing: 'easeInQuart',
    onComplete() {
      zoomToCard(mesh)
    }
  })
}

function deselectAndGoHome() {
  if (spotlightTimeout) { clearTimeout(spotlightTimeout); spotlightTimeout = null }
  if (selectedCard) {
    hideOverlay()
    resetCard(selectedCard)
    selectedCard = null
  }
  clearActiveDot()
  cameraController.moveToPosition(HOME_POSITION, 0.5, { easing: 'easeInQuart' })
}

interaction.onCardClick(selectCard)
interaction.onCardHover((entered, exited) => {
  if (exited) cardAnimator.clearHovered()
  if (entered && entered !== selectedCard) cardAnimator.setHovered(entered)
})

onDotClick((index) => {
  selectCard(cards[index])
})

onCloseRequested(deselectAndGoHome)

createNav(projects)
createAudioController()

function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  const elapsed = clock.elapsedTime
  cameraController.update(delta)
  cardAnimator.update(delta)
  updateStarfield(starfield, elapsed)
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

export { scene, camera, renderer, cameraController, cards, projects, selectedCard, deselectAndGoHome as goHome, HOME_POSITION }
