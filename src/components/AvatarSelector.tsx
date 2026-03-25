import { motion } from 'framer-motion'

interface AvatarSelectorProps {
    selectedAvatar: string | null
    onSelect: (avatarUrl: string) => void
}

const AVATARS = [
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Lucky',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Buddy',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Abby',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Leo',
]

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-[var(--foreground)]">
                Elige tu avatar Pixel Art
            </label>
            <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((avatarUrl, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(avatarUrl)}
                        className={`
              relative p-1 rounded-xl transition-all duration-200 aspect-square
              ${selectedAvatar === avatarUrl
                                ? 'ring-2 ring-indigo-500 bg-indigo-500/20'
                                : 'bg-[var(--card-bg)] border border-[var(--card-border)] hover:opacity-90'
                            }
            `}
                    >
                        <img
                            src={avatarUrl}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full rounded-lg"
                        />
                        {selectedAvatar === avatarUrl && (
                            <motion.div
                                layoutId="avatar-selected"
                                className="absolute inset-0 border-2 border-indigo-500 rounded-xl"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
