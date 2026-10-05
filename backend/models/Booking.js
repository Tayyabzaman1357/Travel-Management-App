import mongoose from 'mongoose'

const travelerSchema = new mongoose.Schema(
  {
    name: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dob: String,
  },
  { _id: false }
)

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ['flight', 'hotel', 'tour', 'car', 'cruise', 'insurance'],
      index: true,
    },
    itemId: { type: String, default: '' },
    itemName: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    reference: { type: String, required: true, unique: true, index: true },
    date: { type: String, default: '' },
    endDate: { type: String, default: '' },
    guests: { type: Number, default: 1 },
    rooms: { type: Number, default: 1 },
    total: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      default: 'confirmed',
      enum: ['confirmed', 'pending', 'cancelled', 'completed'],
      index: true,
    },
    paymentMethod: { type: String, default: 'Card' },
    travelers: [travelerSchema],
    seats: [{ type: String }],
    contact: {
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
)

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking
