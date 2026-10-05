import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaClock, FaArrowRight } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import { formatDate } from '@/utils/format'

export default function BlogCard({ post, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06 }}
      className="group"
    >
      <Link to={`/blog/${post.id}`} className="glass flex h-full flex-col overflow-hidden rounded-3xl card-hover">
        <div className="relative h-48 overflow-hidden">
          <Img src={post.image} seed={`blog-${post.id}`} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <span className="badge-float left-3 top-3 bg-gradient-to-r from-brand-600 to-ocean-500 text-white">{post.category}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center gap-3 text-[11px] font-medium text-slate-400">
            <span>{formatDate(post.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><FaClock /> {post.readTime} min read</span>
          </div>
          <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-slate-900 dark:text-white transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
            {post.title}
          </h3>
          <p className="line-clamp-2 mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{post.excerpt}</p>
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center gap-2">
              <Img src={post.avatar} seed={`avatar-${post.id}`} alt={post.author} className="h-8 w-8 rounded-full object-cover" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{post.author}</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-300">
              Read <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
