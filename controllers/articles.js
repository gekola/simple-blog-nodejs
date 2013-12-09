var mongoose = require('mongoose')
,   Article = mongoose.model('Article')
,   passport = require('passport');


module.exports.index = function(req, res) {
  var q = [];
  if (req.user) {
    if (req.user['role'] != 'admin')
      q.push({$or: [{approved: true}, {author: req.user.username}]});
  } else {
    q.push({approved: true});
  }
  if (req.param('k'))
    q.push({tags: req.param('k')});
  if (req.param('c'))
    q.push({categories: req.param('c')});

  switch (q.length) {
  case 0:
    q = {};
    break;
  case 1:
    q = q[0];
    break;
  default:
    q = {$and: q};
  }

  Article.find(q).sort({created_at: -1}).exec(function(err, docs) {
    if (err)
      throw err;
    res.render('articles/index.jade', {title: 'Blog', articles: docs});
  });
};

module.exports.new = function(req, res) {
  res.render('articles/new.jade', {title: 'New Post', article: new Article()});
};

module.exports.edit = function(req, res) {
  findArticle(req.params.id, function(err, article) {
    res.render('articles/new.jade', {title: 'Edit Post', article: article});
  });
};

module.exports.update = function(req, res, next) {
  findArticle(req.params.id, function(err, article) {
    var body;
    try {
      body = JSON.parse(req.param('body'));
    } catch (x) {
      body = req.param('body');
    }

    article['title'] = req.param('title');
    article['preview'] = req.param('preview');
    article['body'] = body;
    article['tags'] = req.param('tags') || [];

    if (!article['seo_options'])
      article['seo_options'] = new Object();
    article['seo_options']['keywords'] = req.param('tags') || [];
    article['seo_options']['description'] = req.param('preview');

    handleSave(req, res, article, next);
  });
};

module.exports.create = function(req, res, next) {
  var body;
  try {
    body = JSON.parse(req.param('body'));
  } catch (x) {
    body = req.param('body');
  }
  var article = new Article({
    author: req.user['username'],
    title: req.param('title'),
    body: body,
    preview: req.param('preview'),
    tags: req.param('tags') || [],
    seo_options: {
      author: req.user['username'],
      description: req.param('preview'),
      keywords: req.param('keywords') || []
    }
  });
  return handleSave(req, res, article, next);
};

module.exports.show = function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('articles/show.jade', {title: article.title, article:article});
  });
};

module.exports.approve = function(req, res, next) {
  Article.findById(req.params.id, function(err, article) {
    switch(req.param('to')) {
    case '0':
      article.approved = false;
      break;
    case '1':
      article.approved = true;
      break;
    }
    article.save(function(err, doc){
      if (err)
        next(err);
      else
        res.redirect('/posts/' + req.params.id);
    });
  });
};

module.exports.addComment = function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    var path = req.param('comment-path');
    path = path ? path.split(',') : [];
    article.addComment(path, {
      author: req.user.username,
      comment: req.param('comment'),
      created_at: new Date()
    }, function(err) {
      res.redirect('/posts/' + req.params.id);
    });
  });
};

function findArticle(url_or_id, cb) {
  Article.findOne({$or: [{clear_url: url_or_id}, {_id: url_or_id}]}, cb);
}

function handleSave(req, res, article, next) {
  article.save(function(err, doc) {
    if (err && err.name == 'ValidationError') {
      for(x in err.errors) {
        req.flash('error', err.errors[x]['message']);
      }
      return res.render('articles/new', {
        title: 'Edit Post',
        article : article,
        errorMessages: req.flash('error')
      });
    }
    if (err)
      return next(err);
    return res.redirect('/posts/' + doc.id);
  });
}
