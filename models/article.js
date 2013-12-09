var mongoose = require('mongoose')
,   Schema = mongoose.Schema
,   Comment = require('./comment')
,   SeoOptions = require('./seo_options')
,   Keyword = require('./keyword');

var ArticleSchema = new Schema({
  created_at: {type: Date, default: Date.now},
  author: {type: String, required: true},
  title: {type: String, required: true},
  body: {type: Object},
  clear_url: {type: String},
  preview: {type: String, required: true},
  approved: {type: Boolean, default: false},
  comments: {type: [Comment.schema], default: []},
  tags: {type: [String], ref: Keyword},
  clear_url: {type: String, index: {unique: true}},
  seo_options: {type: Object}
});


ArticleSchema.methods.addComment = function(path, comment, cb) {
  var article = this;
  path = path.map(function(e){ return '.' +  e + '.comments'; }).join('');
  var upd = new Object;
  upd['comments' + path] = comment;
  console.dir(upd);
  article.update({'$push': upd}, function(err){
    cb(err);
  });
};

module.exports = mongoose.model('Article', ArticleSchema);
