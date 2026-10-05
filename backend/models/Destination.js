import mongoose from 'mongoose'

const attractionSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    desc: String,
  },
  { _id: false }
)

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    country: { type: String, required: true, trim: true },
    region: { type: String, default: '' },
    image: { type: String, default: '' },
    gallery: [{ type: String }],
    rating: { type: Number, min: 0, max: 5, default: 4.7 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, default: 0, min: 0 },
    oldPrice: { type: Number, min: 0 },
    description: { type: String, default: '' },
    highlights: [{ type: String }],
    attractions: [attractionSchema],
    food: [{ type: String }],
    coords: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    weather: {
      temp: { type: Number, default: 20 },
      condition: { type: String, default: 'Sunny' },
      icon: { type: String, default: 'sunny' },
    },
    bestTime: { type: String, default: '' },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

destinationSchema.index({ name: 'text', country: 'text', region: 'text' })

const Destination = mongoose.model('Destination', destinationSchema)
export default Destination
