const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");
const Reel = require("../models/Reel");
const { ObjectId } = require("mongodb");

module.exports = {
    getUserProfile: async (req,res) => {
        try {
            const userProfile = await User.find({ userName: req.params.userName })
            const reels = await Reel.find({ creator: userProfile[0].id });
            const requser = await User.find({ _id : req.user._id})
            res.render("profile.ejs", { reels: reels, requestingUser: req.user, user: userProfile[0], requser: requser[0] });
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
    userSearch: async (req,res) => {
        try{
            if(req.query.query !== ""){
                let result = await User.aggregate([
                    {
                        "$search": {
                            "autocomplete": {
                                "query": `${req.query.query}`,
                                "path": "userName",
                                "fuzzy": {
                                    "maxEdits": 2,
                                    "prefixLength": 3
                                }
                            }
                        }
                    }
                ])
                console.log(result)
                res.send(result)
            }
        }catch(err){
            console.log(err)
        }
    },
    getUserSearch: async (req, res) => {
        try{
            let result = await User.findOne({ "_id": ObjectID(req.params.id) });
            res.send(result);
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
            res.redirect("/u/"+req.user.userName)
        }catch(err){
            console.log(err)
        }
    },
    followUser: async (req,res) => {
        try{
            let user = await User.find({_id: req.params.userId})
            console.log(user[0])
            if(!user[0].followers.includes(req.params.reqUserId)){
                await User.findOneAndUpdate(
                    {_id: req.params.userId},
                    {$push: {followers: req.params.reqUserId}}
                )
                await User.findOneAndUpdate(
                    {_id: req.params.reqUserId},
                    {$push: {following: req.params.userId}}
                )
                console.log('followed')
            }
            res.redirect('/u/'+req.params.userName)
        }catch(err){
            console.log(err)
        }
    },
    getFollowersPage: async (req,res) => {
        try{
            const user = await User.find({userName: req.params.userName})
            let followers = []
            let following = []
            for(let i = 0; i < user[0].followers.length; i++){
                let u = await User.findById(user[0].followers[i])
                followers.push(u)
            }
            for(let i = 0; i < user[0].followers.length; i++){
                let u = await User.findById(user[0].following[i])
                following.push(u)
            }
            res.render('followers.ejs', {user: user[0], requser: req.user, following: following, followers: followers})
        }catch(err){
            console.log(err)
        }
    }
}