var mongoose = require('mongoose')
,   Schema = mongoose.Schema
,   SeoOptions = require('./seo_options');

var CategorySchema = new Schema({
  clear_url: {type: String},
  name: {type: String},
  description: {type: String},
  seo_options: {type: Object}
});

module.exports = mongoose.model('Category', CategorySchema);