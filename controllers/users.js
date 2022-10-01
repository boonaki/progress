const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");
const Reel = require("../models/Reel");
const { ObjectId } = require("mongodb");

module.exports = {
    getUserProfile: async (req,res) => {
        try {
            const userProfile = await User.find({ userName: req.params.userName })
            const reels = await Reel.find({ creator: userProfile.id });
            console.log(userProfile, reels)
            res.render("profile.ejs", { reels: reels, requestingUser: req.user, user: userProfile[0] });
          } catch (err) {
            console.log(err);
          }
    },
    editUserProfile: async (req, res) => {
        try{
            res.render("editprofile.ejs", { user: req.user });
        }catch(err){
            console.log(err)
        }
    },
    submitProfileEdit: async (req, res) => {
        try{
            console.log(req.file)
            if(req.file !== undefined){
                const result = await cloudinary.uploader.upload(req.file.path)
                await User.findOneAndUpdate(
                    {_id: req.user.id},
                    {
                        name: req.body.name,
                        bio: req.body.bio,
                        profilePic: result.secure_url,
                        ppCloudinaryId: result.public_id,
                        link: req.body.link 
                    }
                )
            }else{
                await User.findOneAndUpdate(
                    {_id: req.user.id},
                    {
                        name: req.body.name,
                        bio: req.body.bio,
                        link: req.body.link 
                    }
                )
            }         
            res.redirect("/profile")
        }catch(err){
            console.log(err)
        }
    },
}