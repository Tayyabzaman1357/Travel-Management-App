import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaMagnifyingGlass, FaArrowRight } from 'react-icons/fa6'
import BlogCard from '@/components/cards/BlogCard'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import Img from '@/components/common/Img'
import { blogPosts, blogCategories } from '@/data/blogPosts'
import { useSEO } from '@/utils/seo'
import { formatDate } from '@/utils/format'
import { cx } from '@/utils/helpers'

const PAGE_SIZE = 6

export default function Blog() {
  useSEO('Blog & Travel Guides — Wanderlust', 'Travel tips, destination guides, food culture and money-saving hacks.')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [query, category])

  const [featured, ...rest] = blogPosts

  const results = useMemo(() => {
    let list = rest.filter((b) => {
      if (category !== 'All' && b.category !== category) return false
      if (query && !(b.title.toLowerCase().includes(query.toLowerCase()) || b.excerpt.toLowerCase().includes(query.toLowerCase()) || b.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))) return false
      return true
    })
    return list
  }, [query, category, rest])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-14">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Blog' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">Travel Stories & Insider Tips</h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">Guides, hacks and inspiration from travelers who've been there.</p>
          <div className="glass-strong mt-8 flex max-w-md items-center gap-3 rounded-full p-2 pl-5">
            <FaMagnifyingGlass className="text-brand-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles…" className="w-full bg-transparent text-sm outline-none" />
          </div>
        </div>
      </div>

      <div className="container-x py-12">
        {/* Featured */}
        <Link to={`/blog/${featured.id}`} className="group glass relative mb-10 block overflow-hidden rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 overflow-hidden lg:h-auto">
              <Img src={featured.image} seed="blog-featured" alt={featured.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="badge-float left-4 top-4 bg-accent-500 text-white">★ Featured</span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">{featured.category}</span>
                <span>{formatDate(featured.date)}</span>
                <span>{featured.readTime} min read</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-extrabold leading-snug text-slate-900 dark:text-white transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300 sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{featured.excerpt}</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Img src={featured.avatar} seed="featured-avatar" alt={featured.author} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{featured.author}</p>
                    <p className="text-[11px] text-slate-400">Writer</p>
                  </div>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-transform group-hover:scale-105">
                  Read article <FaArrowRight />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['All', ...blogCategories].map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={cx('chip transition-all', category === c ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700')}>
              {c}
            </button>
          ))}
        </div>

        {results.length === 0 ? (
          <EmptyState title="No articles found" text="Try a different keyword or category." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((b, i) => <BlogCard key={b.id} post={b} index={i} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
