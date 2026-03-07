import { motion } from 'framer-motion'
import { useAudioStore } from '../store/audioStore'

interface AudioToggleProps {
  /** Posición del componente: 'top-right', 'top-left', 'bottom-right', 'bottom-left' | 'static' */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'static'
  /** Mostrar solo el botón sin el slider de volumen */
  compact?: boolean
}

export function AudioToggle({ position = 'top-right', compact = false }: AudioToggleProps) {
  const { enabled, volume, muted, toggle, setVolume, toggleMute } = useAudioStore()

  // Determinar la posición CSS basada en la prop
  const positionClasses = {
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'static': 'relative',
  }

  // Icono basado en el estado del audio
  const getAudioIcon = () => {
    if (!enabled || muted || volume === 0) {
      return '🔇'
    }
    if (volume < 0.3) {
      return '🔈'
    }
    if (volume < 0.7) {
      return '🔉'
    }
    return '🔊'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${positionClasses[position]} z-50 flex flex-col gap-2`}
    >
      {/* Botón de toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        className={`
          w-12 h-12 rounded-full 
          flex items-center justify-center
          text-2xl
          transition-all duration-200
          ${enabled && !muted && volume > 0
            ? 'bg-violet-600/30 hover:bg-violet-600/50 text-violet-400 border-2 border-violet-500/50'
            : 'bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-400 border-2 border-zinc-600/50'
          }
        `}
        title={enabled ? 'Desactivar sonido' : 'Activar sonido'}
      >
        {getAudioIcon()}
      </motion.button>

      {/* Slider de volumen (solo si no es compact y está enabled) */}
      {(!compact && enabled) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-col items-center gap-1 bg-zinc-800/80 backdrop-blur-sm p-2 rounded-lg border border-zinc-700/50"
        >
          {/* Botón de mute rápido */}
          <button
            onClick={toggleMute}
            className="text-xs text-zinc-400 hover:text-violet-400 transition-colors"
            title={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>

          {/* Slider vertical */}
          <div className="relative h-24 w-8 flex items-center justify-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="
                absolute h-24 w-4
                appearance-none
                bg-zinc-700
                rounded-full
                cursor-pointer
                writing-mode-vertical
                rotate-180
                [&.rotate-180]:rotate-180
              "
              style={{
                writingMode: 'vertical-lr',
                WebkitAppearance: 'slider-vertical',
              }}
              title="Volumen"
            />
            {/* Indicador visual de volumen */}
            <div className="absolute right-10 flex flex-col items-center gap-1 h-full justify-between py-1">
              <span className={`text-xs ${volume > 0.7 ? 'text-violet-400' : 'text-zinc-500'}`}>🔊</span>
              <span className={`text-xs ${volume > 0.3 && volume <= 0.7 ? 'text-violet-400' : 'text-zinc-500'}`}>🔉</span>
              <span className={`text-xs ${volume <= 0.3 ? 'text-violet-400' : 'text-zinc-500'}`}>🔈</span>
            </div>
          </div>

          {/* Valor numérico */}
          <span className="text-xs text-zinc-400 font-mono">
            {Math.round((muted ? 0 : volume) * 100)}%
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
