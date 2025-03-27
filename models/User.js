// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  image: { type: String },
  isAdmin: { type: Boolean, default: false },
  adminRole: {
    type: String,
    enum: ['superadmin', 'moderator', 'content-manager', null],
    default: null,
  },
  permissions: { type: [String], default: [] },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const User =  mongoose.models.User || mongoose.model('User', userSchema)
export default User;