import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req,res) => {
  const {name, email, password} = req.body;

  if(!name || !email || !password){
    return res.json({success:false, message:'Missing Details'});
  }

  try {
    const existingUser = await userModel.findOne({email});

    if(existingUser){
      return res.json({success:false, message: 'User already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new userModel({name, email, password: hashedPassword})

    await user.save();

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7d in ms

    })

    //email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to EchoSphere",
      text: `Welcome to EchoSphere website. Your account has been created with email id: ${email}`
    }

    console.log(process.env.SENDER_EMAIL);
    console.log(email);

    await transporter.sendMail(mailOptions);

    return res.json({success:true})

  } catch (error) {
    res.json({success:false, message: error.message});
  }
}

export const login = async (req,res) => {
  const {email, password} = req.body;

  if(!email || !password){
    return res.json({success:false, message: 'Email and Password are required'});
  }

  try {
    const user = await userModel.findOne({email});

    if(!user){
      return res.json({success:false, message: 'Invalid email'});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) return res.json({success:false, message: 'Incorrect Password'});

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7d in ms

    })
    
    console.log(req.body);
    return res.json({success:true})

  } catch (error) {
    return res.json({success:false, message: error.message});
  }
}

export const logout = async (req,res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })

    return res.json({success:true, message: 'Logged Out'})
    
  } catch (error) {
    return res.json({success:false, message: error.message});
  }
}

export const sendVerifyOtp = async (req,res)=> {
  console.log('req body : ', req.body)
  // console.log('dsfs');
  
  try {
    
    const {userId} = req.body;
    
    const user = await userModel.findById(userId);
    console.log(user)

    if(user.isAccountVerified){
      return res.json({success:false, message: "Account already verified"})
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)) // 6digit otp

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60*60*1000

    await user.save()

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`
    }

    await transporter.sendMail(mailOption);

    res.json({success:true, message: "Verification OTP sent on Email."})


  } catch (error) {
    res.json({success:false, message: error.message});
  }
}

export const verifyEmail = async(req,res) => {
  const {userId, otp} = req.body;

  if(!userId || !otp) return res.json({success:false, message: "Missig Details"})
  
  try {  
    const user = await userModel.findById(userId);

    if(!user) return res.json({success:false, message: "User not found"})

    if(user.verifyOtp === '' || user.verifyOtp !== otp){
      return res.json({success:false, message: "Invalid OTP"})
    }

    if(user.verifyOtpExpireAt < Date.now()){ // if expired
      return res.json({success:false, message: "OTP Expired"})
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({success:true, message: "Email Verified Successfully"})

  } catch (error) {
    res.json({success:false, message: error.message})
  }
}

export const isAuthenticated = async(req,res) => {
  try {
    return res.json({success:true})
  } catch (error) {
    res.json({success:false, message: error.message})
  }
}

// pass reset
export const sendResetOtp = async(req,res) => {
  const {email} = req.body;

  if(!email) return res.json({success:false, message: "Email is required"})

  try {

    const user = await userModel.findOne({email});

    if(!user) return res.json({success:false, message: "User not found"})

    const resetOtp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = resetOtp;
    user.resetOtpExpiresAt = Date.now() + 15*60*1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `OTP to reset Password is ${resetOtp}`
    }

    transporter.sendMail(mailOption);

    res.json({success:true, message: "Password Reset OTP sent to email successfully"})

  } catch (error) {
    res.json({success:false, message: error.message})
  }
}

export const resetPassword = async(req,res) => {
  const {email, otp, newPassword} = req.body;

  if(!email || !otp || !newPassword){
    return res.json({success:false, messsage: "All fields are required"})
  }

  try {

    const user = await userModel.findOne({email});

    if(!user){
      return res.json({success:false, message: "User not found"})
    }

    if(user.resetOtp === '' || user.resetOtp !== otp){
      return res.json({success:false, message: "Invalid OTP"})
    }

    if(user.resetOtpExpiresAt < Date.now()){
      return res.json({success: false, message: "OTP Expired"})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpiresAt = 0;
    
    await user.save();

    res.json({success:true, message: "Password updated successfully"})

  } catch (error) {
    res.json({success:false, message: error.message})
  }
}