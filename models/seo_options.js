var mongoose = require('mongoose')
,   Schema = mongoose.Schema;

var SeoOptionsSchema = new Schema({
  author: {type: String},
  description: {type: String},
  keywords: {type: [String]}
});

module.exports = mongoose.model('SeoOptions', SeoOptionsSchema);
