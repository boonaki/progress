const Reel = require("../models/Reel");
const Post = require("../models/Post");
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
            const posts = await Post.findById({reel: req.params.id}).sort({createdAt: "asc"}).lean()
            res.render("reel.ejs", { reel: reel, user: req.user, posts: posts });
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
          likes: 0,
          creator: req.user._id,
          posts: []
        });
        console.log("Reel has been added!");
        res.redirect("/profile");
      } catch (err) {
        console.log(err);
      }
    },
    likeReel: async (req, res) => {
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
          }
        );
        console.log("Likes +1");
        res.redirect(`/post/${req.params.id}`);
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
            res.redirect("/profile");
        } catch (err) {
            console.error(err)
        }
    },
    viewReel: async (req, res) => {
        try{
            let reel = await Reel.findById({ _id: req.params.reelId})
            res.render("viewreel.ejs", {reel: reel, user: req.user})
        }catch(err){
            console.log(err)
        }
    }
  };