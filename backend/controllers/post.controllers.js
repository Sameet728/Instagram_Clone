import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req,res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "image required" });

    //image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    //buffer to datauri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user =await User.findById(authorId);
    user.posts.push(post._id);
    await user.save();
    await post.populate({ path: 'author', select: '-password' });

    return res.status(201).json({
      message: "New Post Created",
      post,
      success: true,
    })

  } catch (error) {
    console.log(error);
  }
}
export const getAllPost = async (req,res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username profilePicture',
        }

      });
    return res.status(200).json({
      posts,
      success: true
    })
  } catch (error) {
    console.log(error);

  }
}
export const getUserPost = async (req,res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username profilePicture',
        }

      });
    return res.status(200).json({
      posts,
      success: true
    })
  } catch (error) {
    console.log(error);

  }
}
export const likePost = async (req,res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "post not found", suceess: false });

    //like logic
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    //socket io implemnent after frontend


    return res.status(200).json({ message: "post liked", success: true });
  } catch (error) {
    console.log(error);

  }
}
export const dislikePost = async (req,res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "post not found", success: false });

    //like logic
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();

    //socket io implemnent after frontend


    return res.status(200).json({ message: "post disliked", success: true });
  } catch (error) {
    console.log(error);

  }
}
export const addComment = async (req,res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;
    const { commentText } = req.body;
    const post = await Post.findById(postId);
    if (!commentText) return res.status(400).json({ message: "comment is required", success: false });

    const comment = await Comment.create({
      text: commentText,
      author: commentKrneWalaUserKiId,
      post: postId
    })
    await comment.populate({
      path: 'author',
      select: "username profilePicture"
    });
    post.comments.push(comment._id);
    await post.save();
    return res.status(201).json({ message: "Comment added", comment, success: true });
  } catch (error) {
    console.log(error);

  }
}
export const getCommentsOfPost = async (req,res) => {
  try {
    const postId = req.params.id;
    const comments = await Post.findById(postId).populate({ path: 'author', select: 'username profilePicture' });
    if (!comments) return res.status(400).json({ message: "No Comments Found", success: false });
    return res.status(200).json({ comments, success: true });
  } catch (error) {
    console.log(error);

  }
}
export const deletePost = async (req,res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "post not found", success: false });

    //check is logged in user owner of post or not 
    if (post.author.toString() !== authorId) return res.status(403).json({ message: 'you are not owner of post you cannot delete post', success: false });

    //delte post logic
    await Post.findByIdAndDelete(postId);

    // remove post id from user's post 
    let user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    //delete associated comments
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ message: "post deleted", success: true });
  } catch (error) {
    console.log(error);

  }
}
export const bookmarkPost = async (req,res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "post not found", success: false });
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      //already bookmarked so removed bookmarked
      await user.updateOne({ $pull: { bookmarks: post._id } });
      user.save();
      return res.status(200).json({ message: "bookmark removed ", success: true });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      user.save();
      return res.status(200).json({ message: "bookmark added ", success: true });
    }

  } catch (error) {
    console.log(error);

  }
}