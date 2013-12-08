var mongoose = require('mongoose')
,   Schema = mongoose.Schema;

var KeywordSchema = new Schema({
  _id: {type: String}
});

module.exports = mongoose.model('Keyword', KeywordSchema);
