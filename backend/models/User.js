import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    password: { type: String, required: true, select: false, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    provider: { type: String, enum: ['password', 'google'], default: 'password' },
    photoURL: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password)
}

// Never leak the password hash in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.resetPasswordToken
  delete obj.resetPasswordExpire
  return obj
}

const User = mongoose.model('User', userSchema)
export default User
