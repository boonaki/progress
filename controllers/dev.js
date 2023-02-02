const User = require("../models/User");
const Post = require("../models/Post");
const Reel = require("../models/Reel");
const Comment = require('../models/Comment');
const { ObjectId } = require("mongodb");

module.exports = {
    // this function updated all of the likes value in each post from an array to an object
    doTheThing: async (req,res) => {
        try{
            // const filter = {}
            // updateDoc = {
            //     $set: {
            //         likes: {},
            //     }
            // }
            // await Post.updateMany(filter, updateDoc);

            // let posts = await Post.find()

            // for(let i = 0; i < posts.length; i++) {
            //     await Reel.findOneAndUpdate(
            //         {_id : posts[i].id, "captures._id" : ObjectId(req.params.id)},
            //         {$set: {"captures.$.likes": {}}}
            //     )
            // }

            req.session.returnTo = req.header('Referer') || '/'; 
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;  
        }catch(err){
            console.log(err)
        }
    }
}