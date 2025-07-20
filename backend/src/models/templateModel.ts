import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  style: {
    fontFamily: String,
    background: String,
    border: String,
    color: String,
  },
  previewImage: String, // Optional: for template thumbnail
  createdAt: { type: Date, default: Date.now },
});

export const Template = mongoose.model('Template', templateSchema); 