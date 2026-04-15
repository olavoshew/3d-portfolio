let audioCtx = null
let gainNode = null
let oscillator = null
let isPlaying = false
let button = null

function createAudioUI() {
  button = document.createElement('button')
  button.id = 'audio-toggle'
  button.innerHTML = '&#128263;'
  button.setAttribute('aria-label', 'Toggle ambient audio')
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 50;
    background: rgba(13, 13, 26, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #b0b0b0;
    font-size: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    padding: 0;
  `

  button.addEventListener('click', toggle)
  document.body.appendChild(button)
}

function createAmbientTone() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  gainNode = audioCtx.createGain()
  gainNode.gain.value = 0.03
  gainNode.connect(audioCtx.destination)

  oscillator = audioCtx.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.value = 80

  const lfo = audioCtx.createOscillator()
  lfo.frequency.value = 0.15
  const lfoGain = audioCtx.createGain()
  lfoGain.gain.value = 15
  lfo.connect(lfoGain)
  lfoGain.connect(oscillator.frequency)
  lfo.start()

  oscillator.connect(gainNode)
  oscillator.start()
}

function toggle() {
  if (!isPlaying) {
    play()
  } else {
    pause()
  }
}

function play() {
  if (!audioCtx) createAmbientTone()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  isPlaying = true
  if (button) {
    button.innerHTML = '&#128266;'
    button.style.color = '#ffffff'
  }
}

function pause() {
  if (audioCtx) audioCtx.suspend()
  isPlaying = false
  if (button) {
    button.innerHTML = '&#128263;'
    button.style.color = '#b0b0b0'
  }
}

export function createAudioController() {
  createAudioUI()
  return { play, pause, toggle }
}
