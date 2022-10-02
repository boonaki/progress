const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Reel = require("../models/Reel");
const User = require("../models/User");
const linkPreviewGenerator = require("link-preview-generator");
const { ObjectId } = require("mongodb");

module.exports = {
    getFeed: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: "desc" }).lean();
            res.render("feed.ejs", { posts: posts });
        } catch (err) {
            console.log(err);
        }
    },

    getPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            res.render("post.ejs", { post: post, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },

    createCapturePage: async (req, res) => {
        try {
            const user = await User.find({ _id: req.user.id })
            res.render("createcapture.ejs", { reel: req.params.reelId, user: user[0] })
        } catch (err) {
            console.log(err)
        }
    },
    addCaptureImage: async (req, res) => {
        try {
            //Upload image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            let today = new Date();
            let DD = String(today.getDate()).padStart(2, '0');
            let MM = String(today.getMonth() + 1).padStart(2, '0');
            let YYYY = today.getFullYear();
            today = YYYY + '/' + MM + '/' + DD;

            let post = await Post.create({
                title: req.body.title,
                imageLink: result.secure_url,
                cloudinaryId: result.public_id,
                caption: req.body.caption,
                type: 'image',
                userName: req.user.userName,
                reel: req.params.reelId,
                date: today
            })

            await Reel.findOneAndUpdate(
                { _id: req.params.reelId },
                { $push: { captures: post } },
                { upsert: true }
            )
            console.log('updated and added maybe')
            res.redirect('/u/'+req.user.userName)
        } catch (err) {
            console.log(err)
        }
    },
    addCaptureText: async (req, res) => {
        try{
            let today = new Date();
            let DD = String(today.getDate()).padStart(2, '0');
            let MM = String(today.getMonth() + 1).padStart(2, '0');
            let YYYY = today.getFullYear();
            today = YYYY + '/' + MM + '/' + DD;
            let post = await Post.create({
                title: req.body.titleText,
                description: req.body.description,
                userName: req.user.userName,
                type: 'text',
                caption: 'NA',
                reel: req.params.reelId,
                date: today
            })
            await Reel.findOneAndUpdate(
                { _id: `${req.params.reelId}`},
                { $push: {captures: post}},
                { upsert: true}
            )
            res.redirect('/u/'+req.user.userName)
        }catch(err){
            console.log(err)
        }
    },
    addCaptureLink: async (req, res) => {
        try{
            let today = new Date();
            let DD = String(today.getDate()).padStart(2, '0');
            let MM = String(today.getMonth() + 1).padStart(2, '0');
            let YYYY = today.getFullYear();
            today = YYYY + '/' + MM + '/' + DD;

            const previewData = await linkPreviewGenerator(req.body.link);

            let post = await Post.create({
                title: req.body.titleLink,
                caption: req.body.caption,
                userName: req.user.userName,
                extLinkInfo: previewData,
                type: 'link',
                reel: req.params.reelId,
                date: today
            })
            await Reel.findOneAndUpdate(
                { _id: req.params.reelId },
                { $push: {captures: post}},
                { upsert: true}
            )
            res.redirect('/u/'+req.user.userName)
        }catch(err){
            console.log(err)
        }
    },
    likePostViewReel: async (req, res) => {
        try {
            await Post.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $inc: { likes: 1 },
                }
            );
            await Reel.findOneAndUpdate(
                {_id : req.params.reelId, "captures._id" : ObjectId(req.params.id)},
                {$inc: {"captures.$.likes": 1}}
            )
            console.log("like +1")
            res.redirect(`/reel/viewreel/${req.params.reelId}`);
        } catch (err) {
            console.log(err);
        }
    },
    deletePost: async (req, res) => {
        try {
            
            // // Delete image from cloudinary
            if(req.params.type == 'image'){
                // Find post by id
                let post = await Post.findById({ _id: req.params.id });
                await cloudinary.uploader.destroy(post.cloudinaryId);
            }
            // Delete post from db
            await Reel.findOneAndUpdate(
                {_id : req.params.reelId},
                {$pull: {"captures" : {_id: ObjectId(req.params.id)}}}
            )
            await Post.deleteOne({ _id: req.params.id });
            console.log("Deleted Post");
            res.redirect("/reel/viewreel/"+req.params.reelId);
        } catch (err) {
            console.error(err)
            res.redirect('/u/'+req.user.userName);
        }
    },
};
