const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const { promisify } = require('util');
const crypto = require('crypto');
require("dotenv").config({ path: "./config/.env" });

// sendgrid config
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/u/"+req.user.userName);
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/u/"+req.user.userName);
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/u/"+req.user.userName);
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    name: req.body.name,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/u/"+req.user.userName);
        });
      });
    }
  );
};

exports.postForgot = async (req,res) => {
    try{

        if (req.body.password !== req.body.confirm){
            req.flash('error', 'Passwords do not match');
            res.redirect(`/reset/${req.params.token}`);
        }
        const user = await User.findOne({email: req.body.email});
        if(!user){
            req.flash('errors', {msg: 'No account with that email address exists.'});
            return res.redirect('/forgot');
        }
        
        const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
        const expiration = Date.now() + 3600000;

        await User.findOneAndUpdate({email: req.body.email}, {$set: {resetPasswordToken: token, resetPasswordExpires: expiration}}, {$upset: true})

        const resetEmail = {
            to: user.email,
            from: 'progressiomail@proton.me',
            subject: 'Progressio Password Reset',
            text: `
              You are receiving this because you (or someone else) have requested the reset of the password for your account.
              Please click on the following link, or paste this into your browser to complete the process:
              http://${req.headers.host}/reset/${token}
              If you did not request this, you can safely ignore this email.
            `,
            html: `
                <p><strong>Hello ${user.name.split(' ')[0]},<strong></p>
                <p><strong>You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link to complete the process.<strong></p>
                <br>
                <div style="text-align: center">
                    <a href="http://${req.headers.host}/reset/${token}" style="display: inline-block; padding: 10px 25px; border-radius: 5px; background: #1c1e22; color: #ebebeb;">Reset Password</a>
                </div>
                <br>
                <p><strong>If the above did not work, then copy and paste this link into your browser to complete the process.<strong></p>
                <p>http://${req.headers.host}/reset/${token}</p>
                <p><strong>If you did not request this, you can safely ignore this email.<strong></p>
                <br>
                <span>Yours,</span>
                <p style="font-size: 18px"><i>Progressio<i></p>
            `
        };
    
        await sgMail.send(resetEmail)
        req.flash('info', {msg: `An e-mail has been sent to ${user.email} with further instructions.`});
        res.redirect('/forgot');
    }catch(err){
        console.log(err)
    }
}

exports.postReset = async (req,res) => {
    try{
        const user = await User.findOne({resetPasswordToken: req.params.token})
        
        if(!user){
            req.flash('errors', {msg: 'Password reset token is invalid or has expired.'});
            return res.redirect('/forgot');
        }

        user.password = req.body.password;
        await user.save((err) => {
            if (err) {
              return next(err);
            }
        });

        await User.findOneAndUpdate({_id: user.id}, {$set: {resetPasswordToken: "", resetPasswordExpires: 0}})

        const resetEmail = {
            to: user.email,
            from: 'progressiomail@proton.me',
            subject: 'Your password has been changed',
            text: `
            This is a confirmation that the password for your account "${user.userName}" has just been changed.
            `,
            html: `
                <div style="text-align: center">
                    <span style="display: inline-block"><strong>This is a confirmation that the password for your account "${user.userName}" has just been changed.<strong></span>
                </div>
            `
        };

        await sgMail.send(resetEmail)
        req.flash('success', {msg: `Success! Your password has been changed.`});

        res.redirect('/login');


    }catch(err){
        console.log(err)
    }
}
