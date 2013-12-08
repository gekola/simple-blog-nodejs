//var mongoose = require('mongoose')
//,   Image = mongoose.model('Image')

module.exports.create = function(req, res) {
  var attachment = req.param('attachment')
  ,   file = req.files['attachment']['file']
  ,   re = new RegExp("public(/.*)")
  ,   url = re.exec("public/uploads/31201-1n8se41.png")[1];
  console.dir(attachment);
  console.dir(file);
  res.send(200, {file: {url: url, large: {url: url}}});
};
