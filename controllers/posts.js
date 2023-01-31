const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Reel = require("../models/Reel");
const User = require("../models/User");
const Comment = require('../models/Comment');
const { ObjectId } = require("mongodb");
const { post } = require("../routes/main");
const fetch = require('node-fetch')

module.exports = {
    getFeed: async (req, res) => {
        try {
            const users = await User.find()
            const posts = await Post.find().sort({ createdAt: "desc" }).lean();
            const requser = await User.find({_id: req.user._id})
            const ruReels = await Reel.find({creator: req.user._id})
            
            res.render("feed.ejs", { posts: posts, users: users, requser: requser[0], ruReels: ruReels });
        } catch (err) {
            console.log(err);
        }
    },

    // updatePosts: async (req, res) => {
    //     try{
    //         //find all posts and update with new property
    //         //grab all users
    //         //update all posts that have the same name of the current user
    //         const users = await User.find()
    //         for(let i = 0; i < await users.length; i++){
    //             await Post.updateMany(
    //                 {userName: users[i].userName},
    //                 {$set: 
    //                     {userId: ObjectId(users[i].id)}
    //                 },
    //                 {multi: true}
    //             )
    //             const reels = await Reel.find(
    //                 {creator: ObjectId(users[i].id)},
    //             )
    //             for(let j = 0; j < await reels.length; j++){
    //                 await Reel.updateMany(
    //                     {_id: ObjectId(reels[j].id)},
    //                     {$set: 
    //                         {"captures.$[elem].userId": ObjectId(users[i].id)}
    //                     },
    //                     { arrayFilters: [ { "elem": { "elem.userName": users[i].userName}},{"multi": true} ], upsert: true }
    //                 )
    //             }
    //         }
    //         console.log('success')
    //         res.redirect('/u/boonaki')
    //     }catch(err){
    //         console.log(err)
    //         res.redirect('/u/boonaki')
    //     }
    // },

    getPost: async (req, res) => {
        try {
            const comments = await Comment.find({postId: req.params.id})
            const post = await Post.findById(req.params.id);
            const reel = await Reel.findById(post.reel);
            const user = await User.find({userName: post.userName})
            res.render("post.ejs", { cap: post, user: user[0], comments: comments, requser: req.user, reelcaption: reel.caption });
        } catch (err) {
            console.log(err);
        }
    },
    getEditPost: async (req, res) => {
        try{
            const post = await Post.findById(req.params.id)
            if(post.userName === req.user.userName){
                const user = req.user
                res.render("editpost.ejs", {cap: post, user: user, requser: req.user})
            }else{
                req.flash('info', 'Not Valid')
                res.redirect('/');
            }

        }catch(err){
            res.redirect('/feed')
        }
    },

    createCapturePage: async (req, res) => {
        try {
            const user = await User.find({ _id: req.user.id })
            let reel = await Reel.find({_id: req.params.reelId})
            res.render("createcapture.ejs", { reel: reel, user: user[0] })
        } catch (err) {
            req.flash('info', 'Something went wrong...')
            res.redirect('/reel/viewreel/'+req.params.reelId)
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
                reelName: req.params.reelName,
                userName: req.user.userName,
                userId: req.user.id,
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
            req.flash("info", 'Something went wrong...')
            res.redirect('/u/'+req.user.userName)
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
                userId: req.user.id,
                type: 'text',
                reelName: req.params.reelName,
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
            req.flash("info", 'Something went wrong...')
            res.redirect('/u/'+req.user.userName)
        }
    },
    addCaptureLink: async (req, res) => {
        try{
            let today = new Date();
            let DD = String(today.getDate()).padStart(2, '0');
            let MM = String(today.getMonth() + 1).padStart(2, '0');
            let YYYY = today.getFullYear();
            today = YYYY + '/' + MM + '/' + DD;

            const url = `http://api.linkpreview.net/?key=${process.env.LPG_API}&q=${req.body.link}`
            const data = await fetch(url);
            const previewData = await data.json();

            if(previewData.error === 423){
                previewData.description = 'Access to this website is blocked.'
            }

            let post = await Post.create({
                title: req.body.titleLink,
                caption: req.body.caption,
                userName: req.user.userName,
                userId: req.user.id,
                extLink: req.body.link,
                extLinkInfo: previewData,
                reelName: req.params.reelName,
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
            req.flash("info", 'Something went wrong...')
            res.redirect('/u/'+req.user.userName)
        }
    },

    likePostViewReel: async (req, res) => {
        try {
            let post = await Post.find({_id: req.params.id})
            // console.log(post)
            if(!post[0].likes.includes(req.user.id)){
                await Post.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $push: { likes : req.user.id },
                    }
                );
                await Reel.findOneAndUpdate(
                    {_id : req.params.reelId, "captures._id" : ObjectId(req.params.id)},
                    {$push: {"captures.$.likes": req.user.id}}
                )
            }
            console.log(req.originalUrl)
            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;  
        } catch (err) {
            console.log(err)
            req.flash("info", {msg: 'Unable to like post'})
            res.redirect('/u/'+req.user.userName)
        }
    },

    editPost: async (req, res) => {
        try{
            if(req.params.type === 'link'){
                if(req.body.link !== req.body.caplink){
                    const url = `http://api.linkpreview.net/?key=${process.env.LPG_API}&q=${req.body.link}`
                    const data = await fetch(url);
                    const previewData = await data.json()
                    
                    await Post.findOneAndUpdate(
                        {_id: req.params.id},
                        {$set:
                            {
                                title: req.body.title,
                                extLink: req.body.link,
                                caption: req.body.caption,
                                extLinkInfo: previewData,
                            }
                        }
                    )
                    await Reel.findOneAndUpdate(
                        {_id: req.params.reelId, "captures._id" : ObjectId(req.params.id)},
                        {$set: 
                            {
                                "captures.$.title": req.body.title,
                                "captures.$.extLink": req.body.link,
                                "captures.$.caption": req.body.caption,
                                "captures.$.extLinkInfo": previewData,
                            }
                        }
                    )
                }else{
                    await Post.findOneAndUpdate(
                        {_id: req.params.id},
                        {$set:
                            {
                                title: req.body.title,
                                caption: req.body.caption,                               
                            }
                        }
                    )
                    await Reel.findOneAndUpdate(
                        {_id: req.params.reelId, "captures._id" : ObjectId(req.params.id)},
                        {$set: 
                            {
                                "captures.$.title": req.body.title,
                                "captures.$.caption": req.body.caption,
                            }
                        }
                    )
                }
            }else if(req.params.type === 'text'){
                await Post.findOneAndUpdate(
                    {_id: req.params.id},
                    {$set:
                        {
                            title: req.body.title,
                            description: req.body.description,
                            caption: req.body.caption,                               
                        }
                    }
                )
                await Reel.findOneAndUpdate(
                    {_id: req.params.reelId, "captures._id" : ObjectId(req.params.id)},
                    {$set: 
                        {
                            "captures.$.title": req.body.title,
                            "captures.$.description": req.body.description,
                            "captures.$.caption": req.body.caption,
                        }
                    }
                )
            }else if(req.params.type === 'image'){
                await Post.findOneAndUpdate(
                    {_id: req.params.id},
                    {$set:
                        {
                            title: req.body.title,
                            caption: req.body.caption,                               
                        }
                    }
                )
                await Reel.findOneAndUpdate(
                    {_id: req.params.reelId, "captures._id" : ObjectId(req.params.id)},
                    {$set: 
                        {
                            "captures.$.title": req.body.title,
                            "captures.$.caption": req.body.caption,
                        }
                    }
                )
            }

            res.redirect("/post/"+req.params.id)
        }catch(err){
            console.log(err)
        }
    },

    deletePost: async (req, res) => {
        try {
            // Delete image from cloudinary
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
            //return user back to their profile page
            res.redirect('/u/'+req.user.userName);
        }
    },

};
