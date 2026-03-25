type MusicState = {
  enabled: boolean
  muted: boolean
  volume: number
}

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let lead: OscillatorNode | null = null
let bass: OscillatorNode | null = null
let chord: OscillatorNode | null = null
let chordGain: GainNode | null = null
let timer: number | null = null
let step = 0

const tempoMs = 420

const scale = [0, 2, 3, 5, 7, 10]
const chordDegrees = [0, 3, 5, 4]

function ensureContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  if (!masterGain) {
    masterGain = ctx.createGain()
    masterGain.gain.value = 0
    masterGain.connect(ctx.destination)
  }
  return ctx
}

function midiToHz(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

function setVolumes(state: MusicState) {
  if (!masterGain) return
  const target = state.enabled && !state.muted ? Math.max(0, Math.min(1, state.volume)) : 0
  masterGain.gain.setTargetAtTime(target * 0.08, ensureContext().currentTime, 0.05)
}

export async function resumeAudio() {
  const c = ensureContext()
  if (c.state === 'suspended') {
    await c.resume()
  }
}

function startNodes() {
  const c = ensureContext()
  if (lead || bass || chord) return

  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1200
  filter.Q.value = 0.7
  filter.connect(masterGain!)

  lead = c.createOscillator()
  lead.type = 'triangle'
  lead.frequency.value = midiToHz(72)
  lead.connect(filter)

  bass = c.createOscillator()
  bass.type = 'sine'
  bass.frequency.value = midiToHz(48)
  bass.connect(filter)

  chord = c.createOscillator()
  chord.type = 'sawtooth'
  chord.frequency.value = midiToHz(60)
  chordGain = c.createGain()
  chordGain.gain.value = 0.12
  chord.connect(chordGain)
  chordGain.connect(filter)

  lead.start()
  bass.start()
  chord.start()

  step = 0
  timer = window.setInterval(() => {
    const t = c.currentTime
    const rootMidi = 60 + chordDegrees[Math.floor(step / 4) % chordDegrees.length]
    const degree = scale[step % scale.length]
    const leadMidi = rootMidi + 12 + degree
    const bassMidi = rootMidi - 12
    const chordMidi = rootMidi + 0

    lead!.frequency.setTargetAtTime(midiToHz(leadMidi), t, 0.02)
    bass!.frequency.setTargetAtTime(midiToHz(bassMidi), t, 0.03)
    chord!.frequency.setTargetAtTime(midiToHz(chordMidi), t, 0.05)

    step += 1
  }, tempoMs)
}

function stopNodes() {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }

  const t = ctx?.currentTime ?? 0

  if (masterGain) {
    masterGain.gain.setTargetAtTime(0, t, 0.03)
  }

  const nodes: Array<OscillatorNode | null> = [lead, bass, chord]
  nodes.forEach((n) => {
    try {
      n?.stop()
    } catch (e) {
      void e
    }
  })

  lead = null
  bass = null
  chord = null
  chordGain = null
}

export function syncBackgroundMusic(state: MusicState) {
  if (!state.enabled) {
    stopNodes()
    return
  }

  startNodes()
  setVolumes(state)
}
