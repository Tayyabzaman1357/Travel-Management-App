import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, default: '' },
    itemType: { type: String, default: 'hotel', index: true },
    itemId: { type: String, default: '' },
    itemName: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '', trim: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
)

const Review = mongoose.model('Review', reviewSchema)
export default Review
