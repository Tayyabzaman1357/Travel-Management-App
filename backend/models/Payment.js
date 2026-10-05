import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', index: true },
    reference: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    method: { type: String, default: 'card', enum: ['card', 'paypal', 'jazzcash', 'easypaisa'] },
    status: { type: String, default: 'paid', enum: ['pending', 'paid', 'failed', 'refunded'], index: true },
    cardLast4: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const Payment = mongoose.model('Payment', paymentSchema)
export default Payment
