import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  caption: { type: String, default: '' },
  image: { type: String, required: true },
  likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt:{
    type:Number,
    default: () => Date.now(),
  },
});
export const Post = mongoose.model('Post', postSchema);