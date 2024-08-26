import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import nodemailer from 'nodemailer';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "try diffrent email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPassword,
      email
    });
    return res.status(201).json({
      message: "Account Created Sucessfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const login =async(req,res)=>{
  try {
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(401).json({
        message: "Something is missing",
        success: false,
      });
    };
    let userr=await User.findOne({email});
    if(!userr){
      return res.status(401).json({
        message: "user does not exist",
        success: false,
      });
    };
    const isPasswordMatch=await bcrypt.compare(password,userr.password);
    if(!isPasswordMatch){
      return res.status(401).json({
        message: "Wrong password",
        success: false,
      });
    };
    const token= await jwt.sign({userid:userr._id},process.env.SECRET_KEY,{expiresIn:'1d'});
    const populatedPosts=await Promise.all(
      userr.posts.map(async(postId)=>{
        const post=await Post.findById(postId);
        if(post.author.equals(userr._id)){
          return post;
        }
return null;
      })
    )
    const user ={
      _id:userr._id,
      username:userr.username,
      email:userr.email,
      profilePicture:userr.profilePicture,
      bio:userr.bio,
      following:userr.following,
      followers:userr.followers,
      posts:populatedPosts,
      bookmarks:userr.bookmarks,
    }
   
    return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
      message:`Welcome back ${user.username}`,
      success:true,
      user,
    })
  } catch (error) {
    console.log(error);
  }
};
export const logout=async(req,res)=>{
  try {
    return res.cookie("token","",{maxAge:0}).json({
      message:"Logout sucessfully",
      success:true,
    });
  } catch (error) {
    console.log(error);
  }
} ;
export const getProfile=async(req,res)=>{
  try {
    const userId=req.params.id;
   
    if(!userId){
      return res.status(401).json({
        message:"no user found",
        success:false,
      });
    }
    let user = await User.findById(userId).select('-password').populate({path:'posts', createdAt:-1}).populate('bookmarks');
    return res.status(200).json({
      user,
      success:true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const editProfile=async(req,res)=>{
  try {
    const userId=req.id;
    const {bio,gender}=req.body;
    const profilePicture=req.file;
    let cloudResponse;
    if(profilePicture){
      const fileUri=getDataUri(profilePicture);
     cloudResponse= await cloudinary.uploader.upload(fileUri);
    }
    const user=await User.findById(userId);
    if(!user){
      return res.status(401).json({
        message:"user not found",
        success:false,
      });
    }
    if(bio)user.bio=bio;
    if(gender)user.gender=gender;
    if(profilePicture)user.profilePicture=cloudResponse.secure_url;
    await user.save();
    return res.status(200).json({
      message:"Profile Updated",
      success:true,
      user,
    })
  } catch (error) {
    console.log(error);
  }
};
export const getSuggestedUsers = async (req, res) => {
  try {
      const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
      if (!suggestedUsers) {
          return res.status(400).json({
              message: 'Currently do not have any users',
          })
      };
      return res.status(200).json({
          success: true,
          users: suggestedUsers
      })
  } catch (error) {
      console.log(error);
  }
};
export const followOrUnfollow = async (req, res) => {
  try {
      const followKrneWala = req.id; // patel || account ownerr || logged acoount
      const jiskoFollowKrunga = req.params.id; // shivani || other useer accouht
      if (followKrneWala === jiskoFollowKrunga) {
          return res.status(400).json({
              message: 'You cannot follow/unfollow yourself',
              success: false
          });
      }

      const user = await User.findById(followKrneWala);
      const targetUser = await User.findById(jiskoFollowKrunga);

      if (!user || !targetUser) {
          return res.status(400).json({
              message: 'User not found',
              success: false
          });
      }
      // mai check krunga ki follow krna hai ya unfollow
      const isFollowing = user.following.includes(jiskoFollowKrunga);
      if (isFollowing) {
          // unfollow logic ayega
          await Promise.all([
              User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
              User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
          ])
          return res.status(200).json({ message: 'Unfollowed successfully', success: true });
      } else {
          // follow logic ayega
          await Promise.all([
              User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
              User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
          ])
          return res.status(200).json({ message: 'followed successfully', success: true });
      }
  } catch (error) {
      console.log(error);
  }
}; 
export const sendotp=async(req,res)=>{
  const { email } = req.body;

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Configure the nodemailer transporter with Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure : true,
    port : 465,
    auth: {
      user: 'instagramclone87@gmail.com', // Replace with your Gmail address
      pass:process.env.GOOGLEMAILPASS, // Replace with your app-specific password
    },
  });

  // Email options
  const mailOptions = {
    from: 'instagramclone87@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully', otp ,success:true});
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error,success:false });
  }
};

