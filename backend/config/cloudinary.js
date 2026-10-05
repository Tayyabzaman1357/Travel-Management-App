import { v2 as cloudinary } from 'cloudinary'

const configured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
)

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

/**
 * Upload a buffer (from multer memory storage) to Cloudinary.
 * Returns { url, public_id }. Falls back to a local /uploads file when
 * Cloudinary is not configured OR the upload fails, so uploads always work.
 */
export async function uploadImageBuffer(buffer, { folder = 'travel-booking' } = {}) {
  if (configured) {
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'auto' },
          (err, res) => (err ? reject(err) : resolve(res))
        )
        stream.end(buffer)
      })
      return { url: result.secure_url, public_id: result.public_id }
    } catch (err) {
      console.warn('⚠️  Cloudinary upload failed, saving locally instead:', err.message)
    }
  }
  // Local fallback — write to backend/uploads
  const { writeFile } = await import('node:fs/promises')
  const path = await import('node:path')
  const { fileURLToPath } = await import('node:url')
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const fs = await import('node:fs')
  const uploadsDir = path.join(__dirname, '..', 'uploads')
  fs.mkdirSync(uploadsDir, { recursive: true })
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`
  await writeFile(path.join(uploadsDir, name), buffer)
  return { url: `/uploads/${name}`, public_id: `local-${name}` }
}

export const cloudinaryConfigured = configured
