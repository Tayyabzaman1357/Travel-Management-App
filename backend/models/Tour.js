import mongoose from 'mongoose'

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['adventure', 'family', 'luxury', 'beach', 'mountain', 'historical'],
      index: true,
    },
    destination: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    rating: { type: Number, min: 0, max: 5, default: 4.8 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 0, index: true },
    oldPrice: { type: Number, min: 0 },
    duration: { type: String, default: '5 Days' },
    groupSize: { type: Number, default: 12 },
    included: [{ type: String }],
    description: { type: String, default: '' },
  },
  { timestamps: true }
)

tourSchema.index({ name: 'text', destination: 'text' })

const Tour = mongoose.model('Tour', tourSchema)
export default Tour
