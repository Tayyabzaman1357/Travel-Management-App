import mongoose from 'mongoose'

const flightSchema = new mongoose.Schema(
  {
    airline: { type: String, required: true, trim: true, uppercase: true },
    flightNo: { type: String, required: true, trim: true, index: true },
    from: { type: String, required: true, trim: true },
    fromCode: { type: String, required: true, trim: true, uppercase: true },
    to: { type: String, required: true, trim: true },
    toCode: { type: String, required: true, trim: true, uppercase: true },
    departTime: { type: String, default: '00:00' },
    arriveTime: { type: String, default: '00:00' },
    duration: { type: Number, default: 0, min: 0 }, // minutes
    stops: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0, index: true },
    class: { type: String, default: 'Economy', enum: ['Economy', 'Premium', 'Business', 'First'] },
    seatsLeft: { type: Number, default: 10, min: 0 },
    date: { type: String, default: '' },
    baggage: { type: String, default: '23kg' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
)

flightSchema.index({ from: 'text', to: 'text', flightNo: 'text' })

const Flight = mongoose.model('Flight', flightSchema)
export default Flight
