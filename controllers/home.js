module.exports.index = function(req, res){
  if(req.isAuthenticated())
    res.redirect('/posts/');
  else
    res.render('home/index');
};

module.exports.notFound = function(req, res){
  req.flash('error', "That doesn't seem to be a page.");
  res.redirect('/');
};
