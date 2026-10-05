import { useState } from 'react'
import { fallbackImg } from '@/data/images'

export default function Img({ src, alt = '', seed = 'travel', className = '', eager = false, ...rest }) {
  const [error, setError] = useState(false)
  return (
    <img
      src={error || !src ? fallbackImg(seed) : src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setError(true)}
      className={className}
      {...rest}
    />
  )
}
