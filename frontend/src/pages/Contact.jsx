import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaLocationDot, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa6'
import Breadcrumb from '@/components/common/Breadcrumb'
import MapView from '@/components/common/MapView'
import { useSEO } from '@/utils/seo'

export default function Contact() {
  useSEO('Contact Us — Wanderlust', 'Get in touch with the Wanderlust team — we reply within 24 hours.')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 900))
    toast.success(`Thanks ${data.name.split(' ')[0]}! Your message has been sent — we'll reply within 24 hours.`)
    reset()
  }

  const info = [
    { icon: <FaLocationDot />, title: 'Head Office', lines: ['88 Harbor Avenue, New York, NY 10001', 'United States'] },
    { icon: <FaPhone />, title: 'Phone', lines: ['+1 (800) 123-4567', 'Mon–Sun, 24/7'] },
    { icon: <FaEnvelope />, title: 'Email', lines: ['support@wanderlust.com', 'partners@wanderlust.com'] },
    { icon: <FaClock />, title: 'Support Hours', lines: ['24/7 live chat support', 'Avg. reply time: 15 min'] },
  ]

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-16">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Contact' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">We'd love to hear from you</h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">Questions about a booking, a partnership or a press inquiry — our team is here 24/7.</p>
        </div>
      </div>

      <div className="container-x grid grid-cols-1 gap-8 py-12 lg:grid-cols-5">
        {/* Contact info */}
        <div className="space-y-4 lg:col-span-2">
          {info.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass flex items-start gap-4 rounded-3xl p-5 card-hover">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-500 text-lg text-white shadow-glow">{item.icon}</span>
              <div>
                <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">{item.title}</p>
                {item.lines.map((l) => <p key={l} className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{l}</p>)}
              </div>
            </motion.div>
          ))}
          <MapView className="h-72" center={[40.7128, -74.006]} zoom={11} markers={[{ position: [40.7128, -74.006], title: 'Wanderlust HQ', subtitle: '88 Harbor Avenue, New York' }]} />
        </div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-8 lg:col-span-3">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Send us a message</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Fill in the form and we'll get back to you within one business day.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">Full name</label>
              <input {...register('name', { required: 'Name is required' })} placeholder="Jane Doe" className="input-base" />
              {errors.name && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">Email</label>
              <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} placeholder="jane@example.com" className="input-base" />
              {errors.email && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">Subject</label>
              <select {...register('subject', { required: 'Choose a subject' })} className="input-base">
                <option value="">Select subject…</option>
                <option>Booking question</option>
                <option>Refund / cancellation</option>
                <option>Partnership</option>
                <option>Press inquiry</option>
                <option>Other</option>
              </select>
              {errors.subject && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.subject.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">Booking reference (optional)</label>
              <input {...register('reference')} placeholder="WL-8841-K" className="input-base" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-slate-500">Message</label>
              <textarea {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message must be at least 10 characters' } })} rows={5} placeholder="How can we help?" className="input-base resize-none" />
              {errors.message && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.message.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full !py-4">
                <FaPaperPlane className={isSubmitting ? 'animate-pulse' : ''} />
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
