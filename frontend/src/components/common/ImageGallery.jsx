import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExpand, FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6'
import Img from './Img'
import { cx } from '@/utils/helpers'

export default function ImageGallery({ images = [], seed = 'gallery', className = '' }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const next = (step) => setActive((i) => (i + step + images.length) % images.length)

  return (
    <>
      <div className={cx('group relative overflow-hidden rounded-3xl', className)}>
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative h-72 w-full sm:h-96 lg:h-[480px]"
        >
          <Img src={images[active]} seed={`${seed}-${active}`} alt="" className="h-full w-full object-cover" eager />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
          <button
            onClick={() => setLightbox(true)}
            className="badge-float bottom-4 right-4 top-auto cursor-pointer hover:scale-105 transition-transform"
            aria-label="Open fullscreen"
          >
            <FaExpand /> View fullscreen
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={() => next(-1)}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-800 backdrop-blur transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => next(1)}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-800 backdrop-blur transition-all hover:scale-110"
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
              <span className="badge-float left-4 top-4">{active + 1} / {images.length}</span>
            </>
          )}
        </motion.div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cx(
                  'relative h-16 w-24 shrink-0 overflow-hidden rounded-xl transition-all duration-300',
                  i === active ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-950' : 'opacity-60 hover:opacity-100'
                )}
              >
                <Img src={img} seed={`${seed}-th-${i}`} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/95 p-4"
            onClick={() => setLightbox(false)}
          >
            <button className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:rotate-90 hover:bg-accent-500" aria-label="Close">
              <FaXmark />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + images.length) % images.length) }} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-brand-500" aria-label="Previous">
              <FaChevronLeft />
            </button>
            <motion.img
              key={active}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[active]}
              alt=""
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % images.length) }} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-brand-500" aria-label="Next">
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
