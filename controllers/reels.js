const Reel = require("../models/Reel");
const Post = require("../models/Post");

module.exports = {
    getReel: async (req, res) => {
        try {
            const reel = await Reel.findById(req.params.id);
            const posts = await Post.findById({posts: req.params.id}).sort({createdAt: "asc"}).lean()
            res.render("reel.ejs", { reel: reel, user: req.user, posts: posts });
        } catch (err) {
            console.log(err);
        }
    },
    createReel: async (req, res) => {
      try {
        // Upload image to cloudinary
        // const result = await cloudinary.uploader.upload(req.file.path);
  
        await Reel.create({
          title: req.body.title,
          image: result.secure_url,
          cloudinaryId: result.public_id,
          caption: req.body.caption,
          likes: 0,
          user: req.user.id,
        });
        console.log("Post has been added!");
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
        // Find post by id
        let post = await Post.findById({ _id: req.params.id });
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(post.cloudinaryId);
        // Delete post from db
        await Post.remove({ _id: req.params.id });
        console.log("Deleted Post");
        res.redirect("/profile");
      } catch (err) {
        res.redirect("/profile");
      }
    },
  };