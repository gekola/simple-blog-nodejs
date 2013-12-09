var mongoose = require('mongoose')
,   Group = mongoose.model('Group')
,   GroupComment = mongoose.model('GroupComment')
,   User = mongoose.model('User');

module.exports.index = function(req, res, next) {
  Group.find(function(err, groups) {
    if (err)
      next(err);
    else
      res.render('groups/index', {groups: groups});
  });
};

module.exports.show = function(req, res, next){
  var clear_url = req.params.id
  ,   q = {clear_url: clear_url};
  Group.findOne(q, function(err, group){
    GroupComment
      .find({group: group['_id']})
      .sort({created_at: -1})
      .limit(5)
      .exec(function(err, comments) {
        User
          .find({groups: group['_id']})
          .limit(10)
          .exec(function(err, users) {
            res.render('groups/show', {group: group, comments: comments, users: users});
        });
    });
  });
};
