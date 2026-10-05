import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaClock, FaShareNodes, FaBookmark, FaHeart, FaPaperPlane } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import Breadcrumb from '@/components/common/Breadcrumb'
import EmptyState from '@/components/common/EmptyState'
import BlogCard from '@/components/cards/BlogCard'
import { getBlogPost, blogPosts } from '@/data/blogPosts'
import { formatDate } from '@/utils/format'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

const seedComments = [
  { id: 1, name: 'Tom Wilson', avatar: 'https://i.pravatar.cc/150?img=12', text: 'This was so helpful! Bookmarked for my next trip.', date: '2 days ago', likes: 8 },
  { id: 2, name: 'Nadia H.', avatar: 'https://i.pravatar.cc/150?img=47', text: 'Great read — the practical tips are gold. Thanks for sharing!', date: '5 days ago', likes: 4 },
]

export default function BlogDetail() {
  const { id } = useParams()
  const post = getBlogPost(id)
  useSEO(post ? `${post.title} — Wanderlust Blog` : 'Article — Wanderlust', post?.excerpt)

  const [comments, setComments] = useState(seedComments)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)

  if (!post) {
    return (
      <div className="container-x pt-40">
        <EmptyState title="Article not found" text="This article may have been removed." action={<Link to="/blog" className="btn-primary">Back to blog</Link>} />
      </div>
    )
  }

  const related = blogPosts.filter((b) => b.id !== post.id && (b.category === post.category || b.tags.some((t) => post.tags.includes(t)))).slice(0, 3)
  const fallbackRelated = blogPosts.filter((b) => b.id !== post.id).slice(0, 3)

  const addComment = (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) {
      toast.error('Please enter your name and comment')
      return
    }
    setComments((prev) => [...prev, { id: Date.now(), name, avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`, text, date: 'Just now', likes: 0 }])
    setName('')
    setText('')
    toast.success('Comment posted!')
  }

  return (
    <div className="pt-28">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-16">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <Breadcrumb items={[{ label: 'Blog', to: '/blog' }, { label: post.category }]} />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="chip bg-white/15 text-white backdrop-blur-md">{post.category}</span>
            {post.tags.map((t) => <span key={t} className="chip bg-brand-500/30 text-white backdrop-blur-md">#{t}</span>)}
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">{post.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/90">
            <div className="flex items-center gap-2.5">
              <Img src={post.avatar} seed="author" alt={post.author} className="h-11 w-11 rounded-full object-cover ring-2 ring-white/40" />
              <div>
                <p className="font-bold">{post.author}</p>
                <p className="text-xs text-white/70">{formatDate(post.date)}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-white/70"><FaClock /> {post.readTime} min read</span>
          </div>
        </div>
      </div>

      <div className="container-x grid grid-cols-1 gap-10 py-12 lg:grid-cols-3">
        {/* Article */}
        <article className="lg:col-span-2">
          <Img src={post.image} seed={`article-${post.id}`} alt={post.title} className="h-72 w-full rounded-3xl object-cover shadow-soft sm:h-96" eager />
          <div className="mt-8 space-y-6">
            {post.content.map((block, i) => {
              if (block.type === 'h2') return <h2 key={i} className="pt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">{block.text}</h2>
              if (block.type === 'quote') return (
                <blockquote key={i} className="relative rounded-3xl border-l-4 border-brand-500 bg-brand-500/5 p-6 font-display text-lg font-bold italic text-brand-700 dark:text-brand-200">
                  “{block.text}”
                </blockquote>
              )
              return <p key={i} className="leading-relaxed text-slate-600 dark:text-slate-300">{block.text}</p>
            })}
          </div>

          {/* Share bar */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/70 dark:bg-slate-900/60 p-4">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Did you find this helpful?</p>
            <div className="flex items-center gap-2">
              <button onClick={() => { setLiked(!liked); toast.success(liked ? 'Removed like' : 'Thanks for the love! ❤️') }} className={cx('flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all', liked ? 'bg-accent-500 text-white shadow-glow-accent' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300')}>
                <FaHeart /> {liked ? 'Liked' : 'Like'}
              </button>
              <button onClick={() => { setSaved(!saved); toast.success(saved ? 'Removed from saved' : 'Article saved for later!') }} className={cx('flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all', saved ? 'bg-brand-600 text-white shadow-glow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300')}>
                <FaBookmark /> {saved ? 'Saved' : 'Save'}
              </button>
              <button onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') } catch { toast.success('Share this article with friends!') } }} className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-brand-500 hover:text-white">
                <FaShareNodes /> Share
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-10">
            <h3 className="mb-5 font-display text-xl font-extrabold text-slate-900 dark:text-white">Comments ({comments.length})</h3>
            <form onSubmit={addComment} className="glass rounded-3xl p-5">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input-base mb-3" />
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your thoughts…" rows={3} className="input-base resize-none" />
              <button type="submit" className="btn-primary mt-3 text-xs"><FaPaperPlane /> Post comment</button>
            </form>
            <div className="mt-6 space-y-4">
              {comments.map((c) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Img src={c.avatar} seed={`c-${c.id}`} alt={c.name} className="h-9 w-9 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</p>
                      <p className="text-[11px] text-slate-400">{c.date}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">♥ {c.likes}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="glass rounded-3xl p-6 text-center">
            <Img src={post.avatar} seed="author-big" alt={post.author} className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-brand-500/20" />
            <p className="mt-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">{post.author}</p>
            <p className="mt-1 text-xs text-slate-500">Travel writer & photographer</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Exploring the world one story at a time — 120+ destinations and counting.</p>
            <button onClick={() => toast.success(`Following ${post.author}!`)} className="btn-outline mt-4 w-full text-xs">Follow author</button>
          </div>
          <div className="glass rounded-3xl p-6">
            <p className="mb-4 font-display text-sm font-extrabold text-slate-900 dark:text-white">Popular tags</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => <Link key={t} to={`/blog?q=${t}`} className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300 hover:bg-brand-500/20">#{t}</Link>)}
              {['Travel Tips', 'Budget', 'Food'].map((t) => <span key={t} className="chip bg-slate-100 dark:bg-slate-800 text-slate-500">#{t}</span>)}
            </div>
          </div>
        </aside>
      </div>

      {/* Related */}
      <section className="container-x pb-16">
        <h2 className="mb-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">You might also like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(related.length ? related : fallbackRelated).map((b, i) => <BlogCard key={b.id} post={b} index={i} />)}
        </div>
      </section>
    </div>
  )
}
