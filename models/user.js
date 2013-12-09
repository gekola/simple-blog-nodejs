var mongoose = require('mongoose')
,   Schema = mongoose.Schema
,   bcrypt = require('bcrypt')
,   SALT_WORK_FACTOR = 1;

var roles = ['banned', 'commenter', 'author', 'admin'];
var UserSchema = new Schema({
  created_at: {type: Date, default: Date.now},
  username: {type: String, required: true, index: {unique: true}},
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  email: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  reset_password_token: {type: String},
  reset_password_token_created_at: {type: Date},
  groups: {type: [Schema.ObjectId], ref: 'GroupSchema'},
  role: {type: String, default: 'commenter', enum: roles}
});


UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err)
      return next(err);
    return bcrypt.hash(user.password, salt, function(err, hash) {
      if (err)
        return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.validPassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err)
      return cb(err);
    return cb(null, isMatch);
  });
};

UserSchema.methods.generatePerishableToken = function(cb){
  var user = this;
  var timepiece = Date.now().toString(36);
  var preHash = timepiece + user.email;
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err)
      return cb(err);
    // hash the token along with our new salt
    return bcrypt.hash(preHash, salt, function(err, hash) {
      if (err)
        cb(err);
      else
        cb(null, hash);
    });
  });
};
UserSchema.virtual('full_name').get(function() {
  return this['first_name'] + ' ' + this['last_name'];
});

module.exports = mongoose.model('User', UserSchema);
