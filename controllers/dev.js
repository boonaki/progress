const User = require("../models/User");
const Post = require("../models/Post");
const Reel = require("../models/Reel");
const Comment = require('../models/Comment');
const { ObjectId } = require("mongodb");

module.exports = {
    doTheThing: async (req,res) => {
        try{
            // this code updated all of the likes value in each post from an array to an object
            // const filter = {}
            // updateDoc = {
            //     $set: {
            //         likes: {},
            //     }
            // }
            // await Post.updateMany(filter, updateDoc);

            // let posts = await Post.find()
            // for (let i = 0; i < posts.length; i++){
            //     console.log(i)
            //     await Reel.updateOne(
            //         {_id : ObjectId(posts[i].reel), "captures._id" : ObjectId(posts[i].id)},
            //         {$set: {"captures.$.likes": {}}},
            //         {upsert: true}
            //     )
            // }

            // **************************** //
            // this code updated all the reel likes to a number
            // await Reel.updateMany({}, {$set: {likes: 0}}, {upsert: true})

            // **************************** //
            // this code updated the reels with the total count of their likes
            // let reels = await Reel.find()
            // let totalLikes = 0
            // for(let i = 0; i < reels.length; i++){
            //     for(let j = 0; j < reels[i].captures.length; j++){
            //         totalLikes += Object.keys(reels[i].captures[j].likes).length
            //     }
            //     await Reel.findOneAndUpdate({_id: ObjectId(reels[i].id)}, {$set: {likes: totalLikes}})
            //     totalLikes = 0;
            // }

            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;  
        }catch(err){
            console.log(err)
        }
    }
    
}