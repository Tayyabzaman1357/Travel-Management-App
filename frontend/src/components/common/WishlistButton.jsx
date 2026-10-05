import { motion } from 'framer-motion'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { useWishlist } from '@/context/WishlistContext'
import { cx } from '@/utils/helpers'

export default function WishlistButton({ item, type, className = '', size = 'md' }) {
  const { isSaved, toggleWishlist } = useWishlist()
  const saved = isSaved(type, item.id)
  const dim = size === 'lg' ? 'h-12 w-12 text-xl' : 'h-10 w-10 text-base'

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(item, type)
      }}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={cx(
        'flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300',
        saved
          ? 'bg-accent-500/90 text-white shadow-glow-accent'
          : 'bg-white/80 dark:bg-slate-900/70 text-slate-500 dark:text-slate-300 hover:text-accent-500 hover:scale-110',
        dim,
        className
      )}
    >
      {saved ? <FaHeart /> : <FaRegHeart />}
    </motion.button>
  )
}
