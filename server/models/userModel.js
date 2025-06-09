import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  verifyOtp: {
    type: String,
    default: ''
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0
  },
  isAccountVerified: {
    type: Boolean, 
    default: false
  },
  resetOtp: {
    type: String, 
    default: ''
  },
  resetOtpExpireAt: {
    type: Number,
    default: 0
  },

  following: { 
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    default: [] 
  },
  followers: { 
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    default: [] 
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel;