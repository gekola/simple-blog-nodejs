var mongoose = require('mongoose')
,   Article = mongoose.model('Article');

module.exports.index = function(req, res, next) {
  Article.aggregate(
    {$match: {approved: true}},
    {$project: {tags: 1}},
    {$unwind: '$tags'},
    {$group: {_id: '$tags', count: {$sum: 1}}},
    {$sort: {count: -1}},
    function(err, doc) {
      if (err)
        next(err);
      else
        res.render('tags/index', {tags: doc});
  });
};
