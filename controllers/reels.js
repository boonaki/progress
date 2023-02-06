const Reel = require("../models/Reel");
const Post = require("../models/Post");
const User = require("../models/User")
const cloudinary = require("../middleware/cloudinary");
const { ObjectId } = require("mongodb");

module.exports = {
    // getProfile: async (req, res) => {
    //     try {
    //       const reels = await Reel.find({ creator: req.user.id });
    //     //   const posts = await Post.find({ creator: req.user.id });
    //       res.render("profile.ejs", { reels: reels, user: req.user });
    //     } catch (err) {
    //       console.log(err);
    //     }
    // },
    getReel: async (req, res) => {
        try {
            const reel = await Reel.findById(req.params.id);
            const user = await User.findById(reel.creator)
            const posts = await Post.findById({reel: req.params.id}).sort({createdAt: "asc"}).lean()
            res.render("reel.ejs", { reel: reel, requser: req.user, posts: posts, user: user });
        } catch (err) {
            console.log(err);
        }
    },
    reelCreate: async (req,res) => {
        try{
            res.render("reelcreate.ejs", {user: req.user.id})
        } catch(err){
            console.log(err)
        }
    },
    createReel: async (req, res) => {
      try {
        // Upload image to cloudinary
        // const result = await cloudinary.uploader.upload(req.file.path);
  
        await Reel.create({
          title: req.body.title,
          caption: req.body.caption,
          creator: req.user._id,
        });
        console.log("Reel has been added!");
        res.redirect("/u/"+req.user.userName);
      } catch (err) {
        console.log(err);
      }
    },
    likeReel: async (req, res) => {
      try {
        let reel = await Reel.find({_id: req.params.reelId})
        if(!reel[0].likes.includes(req.user.id)){
            await Reel.findOneAndUpdate(
              { _id: req.params.reelId },
              {
                $push: { likes: req.user.id },
              }
            );
            console.log("Likes +1");
        }

        res.redirect(`/u/${req.params.user}`);
      } catch (err) {
        console.log(err);
      }
    },
    deleteReel: async (req, res) => {
        try {
            // Find posts by id
            let posts = await Post.find({ reel: ObjectId(req.params.reelId) });
            await posts.forEach((post) => {
                post.deleteOne()
                cloudinary.uploader.destroy(post.cloudinaryId)
            })
            // Delete posts assigned with ID
            // await cloudinary.uploader.destroy(post.cloudinaryId);
            // Delete post from db
            await Reel.deleteOne({ _id: ObjectId(req.params.reelId) });
            console.log("Deleted Reel + Posts");
            res.redirect("/u/"+req.user.userName);
        } catch (err) {
            console.error(err)
        }
    },
    viewReel: async (req, res) => {
        try{
            const reel = await Reel.findById(req.params.reelId)
            const user = await User.findById(reel.creator)
            const allReels = await Reel.find({creator: user._id})
            res.render("viewreel.ejs", {reel: reel, requser: req.user, user: user, allReels: allReels})
        }catch(err){
            console.log(err)
        }
    },
    giveStar: async (req,res) => {
        try{
            await Reel.updateOne({_id: req.params.reelId}, {$push: {stars: req.params.user}})
            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;  

        }catch(err){
            res.redirect('/u/' + req.params.user)
        }
    },
    unstar: async (req,res) => {
        try{
            await Reel.updateOne({_id: req.params.reelId}, {$pull: {stars: req.params.user}})
            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo; 
        }catch(err){
            console.log(err)
            req.flash("info", {msg: "Something went wrong, please try again."})
            res.redirect('/u/' + req.params.user)
        }
    }
  };