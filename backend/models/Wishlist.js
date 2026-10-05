import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, enum: ['hotel', 'flight', 'tour', 'destination', 'car', 'cruise'], index: true },
    itemId: { type: String, required: true },
    // Snapshot of the saved item so the wishlist renders even if the catalog changes
    item: { type: mongoose.Schema.Types.Mixed, default: {} },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// One wishlist entry per (user, type, item)
wishlistSchema.index({ user: 1, type: 1, itemId: 1 }, { unique: true })

const Wishlist = mongoose.model('Wishlist', wishlistSchema)
export default Wishlist
