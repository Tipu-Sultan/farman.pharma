// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  image: {
    type: String, // URL to Google profile picture
  },
  isAdmin: {
    type: Boolean,
    default: false, // Indicates if the user has admin privileges
  },
  adminRole: {
    type: String,
    enum: ['superadmin', 'moderator', 'content-manager', null], // Specific admin roles, nullable
    default: null,
  },
  permissions: {
    type: [String], // Array of specific permissions (e.g., 'create', 'edit', 'delete')
    default: [],
  },
  lastLogin: {
    type: Date, // Track last login time for admin activity
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update updatedAt before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.User || mongoose.model('User', userSchema)