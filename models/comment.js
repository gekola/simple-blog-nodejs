var mongoose = require('mongoose')
,   Schema = mongoose.Schema;

var CommentSchema = new Schema({
  author: {type: String, required: true},
  comment: {type: String, required: true},
  created_at: {type: Date, default: Date.now},
  comments: {type: [CommentSchema]}
});

module.exports = mongoose.model('Comment', CommentSchema);