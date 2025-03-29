// models/Resource.js
import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['image','blog', 'video', 'book', 'paper'], required: true },
    link: { type: String,default:'' },
    description: {
      type: String,
      required: function () { return ['image','blog', 'video', 'book', 'paper'].includes(this.type) }
    },
    fileSize: {
      type: Number,
      required: function () { return ['image','blog', 'video', 'book', 'paper'].includes(this.type) }
    },
    metadata: { type: Map, of: String, default: {} },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema)

export default Resource