var mongoose = require('mongoose')
,   User = mongoose.model('User')
,   passport = require('passport');

// Get login page
module.exports.login = function(req, res){
  res.render('users/login', {redirect: req.param('redirect') || "" });
};

/*
// Get dashboard
module.exports.dashboard = function(req, res){
  res.render('users/dashboard');
};
*/

// Authenticate user
module.exports.authenticate = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err)
      return next(err);
    if (!user) {
      req.flash('error', info.message);
      var dest = '/login';
      if (req.body.redirect)
        dest += '?redirect='+req.body.redirect;
      return res.redirect(dest);
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var dest = req.body.redirect || '/posts/';
      return res.redirect(dest);
    });
  })(req, res, next);
};

// Get registration page
module.exports.register = function(req, res){
  res.render('users/new', {user: new User({})});
};

module.exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

module.exports.account = function(req,res){
  res.render('users/edit');
};

module.exports.index = function(req, res, next){
  User.find(function(err,users){
    if(err)
      return next(err);
    res.render('users/index',{
      users:users
    });
  });
};

// Update user
module.exports.update = function(req, res, next){
  var user = req.user;
  // remove password attribute from form if not changing
  if (!req.body.password) delete req.body.password;
  // ensure valid current password
  user.validPassword(req.body['current_password'], function(err, isMatch){
    if (err)
      return next(err);
    if (isMatch)
      return updateUser();
    else
      return failedPasswordConfirmation();
  });
  function updateUser(){
    user.set(req.body);
    user.save(function(err, user){
      if (err && err.code == 11001){
        var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
        req.flash('error', "That " + duplicatedAttribute + " is already in use.");
        return res.redirect('/account');
      }
      if(err)
        return next(err);
      req.flash('success', "Account updated successfully.");
      return res.redirect('/account');
    });
  }
  function failedPasswordConfirmation(){
    req.flash('error', "Incorrect current password.");
    return res.redirect("/account");
  }
};

module.exports.create = function(req, res, next){
  var newUser = new User(req.body);
  newUser.save(function(err, user){
    if (err && err.code == 11000) {
      var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
      req.flash('error', "That " + duplicatedAttribute + " is already in use.");
      return res.render('users/new', {user : newUser, errorMessages: req.flash('error')});
    }
    if(err)
      return next(err);
    req.login(user, function(err) {
      if (err)
        return next(err);
      req.flash('success', "Account created successfully!");
      return res.redirect('/posts/');
    });
  });
};

// Validations for user objects upon user update or create
module.exports.userValidations = function(req, res, next){
  var creatingUser = req.url == "/register";
  var updatingUser = !creatingUser; // only to improve readability
  req.assert('email', 'You must provide an email address.').notEmpty();
  req.assert('first_name', 'First Name is required.').notEmpty();
  req.assert('last_name', 'Last Name is required.').notEmpty();
  req.assert('email', 'Your email address must be valid.').isEmail();
  req.assert('username', 'Username is required.').notEmpty();
  if(creatingUser || (updatingUser && req.body['password'])){
    req.assert('password', 'Your password must be 6 to 20 characters long.').len(6, 20);
  }
  var validationErrors = req.validationErrors() || [];
  if (req.body.password != req.body['password_confirmation'])
    validationErrors.push({msg:"Password and password confirmation did not match."});
  if (validationErrors.length > 0){
    validationErrors.forEach(function(e){
      req.flash('error', e.msg);
    });
    if (creatingUser)
      return res.render('users/new', {
        user: new User(req.body),
        errorMessages: req.flash('error')});
    else
      return res.redirect("/account");
  } else next();
};

// Get password reset request
module.exports.resetPassword = function(req, res){
  res.render('users/reset_password');
};

// Process password reset request
module.exports.generatePasswordReset = function(req, res, next){
  // Validations
  req.assert('email', 'You must provide an email address.').notEmpty();
  req.assert('email', 'Your email address must be valid.').isEmail();
  var validationErrors = req.validationErrors() || [];
  if (validationErrors.length > 0){
    validationErrors.forEach(function(e){ req.flash('error', e.msg); });
    return res.redirect("/reset_password");
  }
  // Passed validations
  User.findOne({email:req.body.email}, function(err, user){
    if(err)
      return next(err);
    if(!user){
      // Mimic real behavior if someone is attempting to guess passwords
      req.flash('success', "You will receive a link to reset your password at "+req.body.email+".");
      return res.redirect('/');
    }
    user.generatePerishableToken(function(err,token){
      if(err)
        return next(err);
      // Generated reset token, saving to user
      user.update({
        reset_password_token : token,
        reset_password_token_created_at : Date.now()
      }, function(err){
        if(err)
          return next(err);
        // Saved token to user, sending email instructions
        res.mailer.send('mailer/password_reset', {
            to: user.email,
            subject: 'Password Reset Request',
            username: user.username,
            token: token,
            urlBase: "http://"+req.headers.host+"/password_reset"
          }, function(err) {
            if(err) return next(err);
            // Sent email instructions, alerting user
            req.flash('success', "You will receive a link to reset your password at "+req.body.email+".");
            res.redirect('/');
          });
      });
    });
  });
};

// Get password reset page
module.exports.passwordReset = function(req, res, next){
  res.render("users/password_reset", {
    token: req.query.token,
    username: req.query.username
  });
};

// Verify passport reset and update password
module.exports.processPasswordReset = function(req, res, next){
  User.findOne({username:req.body.username}, function(err, user){
    if(err)
      return next(err);
    if(!user){
      req.flash('error', "Password reset token invalid.");
      return res.redirect("/");
    }
    var tokenExpiration = 6; // time in hours
    if(req.body.token == user['reset_password_token'] &&
       Date.now() < (user['reset_password_token_created_at'].getTime() +
                     tokenExpiration * 3600000)){
      // Token approved, on to new password validations
      req.assert('password', 'Your password must be 6 to 20 characters long.').len(6, 20);
      var validationErrors = req.validationErrors() || [];
      if (req.body['password'] != req.body['password_confirmation'])
        validationErrors.push({msg:"Password and password confirmation did not match."});
      if (validationErrors.length > 0){
        validationErrors.forEach(function(e){ req.flash('error', e.msg); });
        return res.render('users/password_reset', {errorMessages: req.flash('error'), token : req.body.token, username : req.body.username});
      }
      // Passed new password validations, updating password
      user.set(req.body);
      user.save(function(err, user){
        if(err)
          return next(err);
        req.login(user, function(err) {
          if (err)
            return next(err);
          req.flash('success', "Password updated successfully, you are now logged in.");
          return res.redirect('/posts/');
        });
      });
    } else {
      req.flash('error', "Password reset token has expired.");
      return res.redirect("/");
    }
  });
};
