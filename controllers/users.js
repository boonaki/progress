const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    editUserProfile: async (req, res) => {
        try{
            res.render("editprofile.ejs", { user: req.user });
        }catch(err){
            console.log(err)
        }
    },
    submitProfileEdit: async (req, res) => {
        try{

        }catch(err){
            console.log(err)
        }
    },
}