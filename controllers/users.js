const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");
const Reel = require("../models/Reel");
const { ObjectId } = require("mongodb");

module.exports = {
    getUserProfile: async (req,res) => {
        try {
            const userProfile = await User.find({ userName: req.params.userName })
            const reels = await Reel.find({ creator: userProfile[0].id });
            const requser = await User.find({ _id : ObjectId(req.user._id)})
            res.render("profile.ejs", { reels: reels, user: userProfile[0], requser: requser[0] });
        } catch (err) {
            console.log(err);
            res.redirect('/feed')
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
                    {_id: ObjectId(req.user.id)},
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
    unfollowUser: async (req,res) => {
        try{
            let user = await User.find({_id: req.params.userId})
            if (user[0].followers.includes(req.params.reqUserId)) {
                await User.findOneAndUpdate(
                    {_id: req.params.userId},
                    {$pull: {followers: req.params.reqUserId}}
                )
                await User.findOneAndUpdate(
                    {_id: req.params.reqUserId},
                    {$pull: {following: req.params.userId}}
                )
            }
           
            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;  
        }catch(err){
            console.log(err)
            req.flash("info", 'Something went wrong...')
            res.redirect('/u/'+req.user.userName)
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
            for(let j = 0; j < user[0].following.length; j++){
                let u = await User.findById(user[0].following[j])
                following.push(u)
            }
            res.render('followers.ejs', {user: user[0], requser: req.user, following: following, followers: followers})
        }catch(err){
            console.log(err)
        }
    }
}