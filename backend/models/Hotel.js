import mongoose from 'mongoose'

const roomTypeSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    size: String,
    beds: String,
  },
  { _id: false }
)

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    country: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    gallery: [{ type: String }],
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 0, index: true },
    oldPrice: { type: Number, min: 0 },
    description: { type: String, default: '' },
    amenities: [{ type: String }],
    coords: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    roomTypes: [roomTypeSchema],
    featured: { type: Boolean, default: false },
    destinationId: { type: String, default: '' },
  },
  { timestamps: true }
)

// Text index for search
hotelSchema.index({ name: 'text', city: 'text', country: 'text' })

const Hotel = mongoose.model('Hotel', hotelSchema)
export default Hotel
