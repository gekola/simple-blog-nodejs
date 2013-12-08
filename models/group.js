var mongoose = require('mongoose')
,   Schema = mongoose.Schema;

var GroupSchema = new Schema({
  title: {type: String},
  clear_url: {type: String, index: {unique: true}},
  description: {type: String}
});

module.exports = mongoose.model('Group', GroupSchema);
