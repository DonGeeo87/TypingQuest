type MusicState = {
  enabled: boolean
  muted: boolean
  volume: number
}

const tracks = [
  '/audio/Neon_Overdrive.mp3',
  '/audio/Pixelated_Dawn.mp3',
  '/audio/Pixelated_Reverie.mp3',
] as const

let audioEl: HTMLAudioElement | null = null
let lastState: MusicState = { enabled: true, muted: false, volume: 0.5 }
const currentTrack = Math.floor(Math.random() * tracks.length)

function ensureAudio() {
  if (!audioEl) {
    audioEl = new Audio(tracks[currentTrack])
    audioEl.preload = 'none'
    audioEl.loop = true
    audioEl.volume = 0
  }
  return audioEl
}

function setVolumes(state: MusicState) {
  const a = audioEl
  if (!a) return
  const target = state.enabled && !state.muted ? Math.max(0, Math.min(1, state.volume)) : 0
  a.volume = target * 0.35
}

export async function resumeAudio() {
  const a = ensureAudio()
  setVolumes(lastState)
  try {
    if (lastState.enabled && !lastState.muted && a.paused) {
      await a.play()
    }
  } catch {
    void 0
  }
}

function stopAudio() {
  if (!audioEl) return
  audioEl.pause()
  audioEl.currentTime = 0
}

export function syncBackgroundMusic(state: MusicState) {
  lastState = state
  if (!state.enabled) {
    stopAudio()
    return
  }

  setVolumes(state)
  if (audioEl && !state.muted && state.volume > 0) {
    void resumeAudio()
  }
}
