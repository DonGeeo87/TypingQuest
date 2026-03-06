import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AudioState {
  /** Indica si el sonido está habilitado */
  enabled: boolean
  /** Volumen del sonido (0 a 1) */
  volume: number
  /** Indica si el sonido está muteado */
  muted: boolean
}

interface AudioActions {
  /** Alternar entre habilitado/deshabilitado */
  toggle: () => void
  /** Establecer volumen específico */
  setVolume: (volume: number) => void
  /** Silenciar el sonido */
  mute: () => void
  /** Activar el sonido (unmute) */
  unmute: () => void
  /** Alternar mute/unmute */
  toggleMute: () => void
}

type AudioStore = AudioState & AudioActions

const initialState: AudioState = {
  enabled: true,
  volume: 0.5,
  muted: false,
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      toggle: () => {
        const state = get()
        set({ enabled: !state.enabled })
      },

      setVolume: (volume) => {
        // Clamp entre 0 y 1
        const clampedVolume = Math.max(0, Math.min(1, volume))
        set({ volume: clampedVolume })
        
        // Si el volumen es mayor a 0 y estaba muteado, desmutear
        if (clampedVolume > 0 && get().muted) {
          set({ muted: false })
        }
        
        // Si el volumen es 0, muteamos automáticamente
        if (clampedVolume === 0) {
          set({ muted: true })
        }
      },

      mute: () => {
        set({ muted: true })
      },

      unmute: () => {
        const state = get()
        // Solo desmutear si el volumen es mayor a 0
        if (state.volume > 0) {
          set({ muted: false })
        }
      },

      toggleMute: () => {
        const state = get()
        set({ muted: !state.muted })
      },
    }),
    {
      name: 'typingquest-audio', // Nombre de la clave en localStorage
      partialize: (state) => ({
        enabled: state.enabled,
        volume: state.volume,
        muted: state.muted,
      }),
    }
  )
)
