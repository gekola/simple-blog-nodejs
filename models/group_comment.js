var mongoose = require('mongoose')
,   Schema = mongoose.Schema
,   Comment = require('./comment');

var GroupCommentSchema = new Schema({
  group_id: {type: Schema.ObjectId, ref: 'GroupSchema', index: {unique: false}},
  comment: {type: Object}
});
GroupCommentSchema.index({'comment.created_at': 1, group_id: 1});

module.exports = mongoose.model('GroupComment', GroupCommentSchema);
