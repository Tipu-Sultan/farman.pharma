// models/Resource.js
import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Book', 'Video', 'Paper'],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: false, // Only for books
  },
  duration: {
    type: String,
    required: false, // Only for videos
  },
  journal: {
    type: String,
    required: false, // Only for papers
  },
  category: {
    type: String,
    enum: ['books', 'videos', 'papers'],
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
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

resourceSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);

export default Resource;