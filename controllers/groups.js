var mongoose = require('mongoose')
,   Group = mongoose.model('Group')
,   GroupComment = mongoose.model('GroupComment');

module.exports.index = function(req, res, next) {
  Category.find(function(err, categories) {
    if (err)
      next(err);
    else
      res.render('categories/index', {categories: categories});
  });
};

module.exports.show = function(req, res, next){
  var clear_url = req.params.id
  ,   q = {clear_url: clear_url};
  Category.findOne(q, function(err, category){
    Article
      .find({categories: category['_id']})
      .sort({created_at: -1})
      .limit(5)
      .exec(function(err, articles) {
        res.render('categories/show', {category: category, articles: articles});
    });
  });
};
