import userModel from "../models/userModel.js";

export const getUserData = async(req,res) => {
  try {
    const {userId} = req.body;

    const user = await userModel.findById(userId);

    if(!user){
      return res.json({success:false, message: "User not found"})
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
    })

  } catch (error) {
    res.json({success:false, message: error.message})
  }
}

//list of users
export const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, '_id name email');
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

//follow | unfollow user
export const followUnfollowUser = async (req, res) => {
  try {
    const { followUserId }=req.params;
    const { userId } = req.body;

    if (!userId || !followUserId) {
      return res.status(400).json({ success: false, message: "Missing userId or followUserId" });
    }

    const user = await userModel.findById(userId);
    const followUser = await userModel.findById(followUserId);

    if(!user || !followUser){
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if(userId===followUserId) {
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }

    user.following=user.following || [];
    followUser.followers = followUser.followers || [];

    if (user.following.map(id => id.toString()).includes(followUserId)) {
      user.following = user.following.filter(id => id.toString() !== followUserId);
      followUser.followers = followUser.followers.filter(id => id.toString() !== userId);
      var actionMessage = "Unfollowed successfully";
    } else {
      user.following.push(followUserId);
      followUser.followers.push(userId);
      var actionMessage = "Followed successfully";
    }

    await user.save();
    await followUser.save();

    res.json({ success: true, message: actionMessage });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userfollowersAndFollowing = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).populate('following', '_id name').populate('followers', '_id name');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      following: user.following,
      followers: user.followers
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
