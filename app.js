var express = require('express')
,   expressValidator = require('express-validator')
,   passport = require('passport')
,   LocalStrategy = require('passport-local').Strategy
,   flash = require('connect-flash')
,   less = require('less-middleware')
,   mongoose = require('mongoose')

//  Models
,   ArticleModel = require('./models/article')
,   CategoryModel = require('./models/category')
//, CommentModel = require('./models/comment')
,   GroupModel = require('./models/group')
,   GroupCommentModel = require('./models/group_comment')
//, ImageModel = require('./models/image')
,   KeywordModel = require('./models/keyword')
,   UserModel = require('./models/user')
,   UserStatusModel = require('./models/user_status')
//, SeoOptionsModel = require('./models/seo_options')

,   Keyword = mongoose.model('Keyword')
,   User = mongoose.model('User')
//,   Article = mongoose.model('Article')

//  Controllers
,   HomeController = require('./controllers/home')
,   ArticlesController = require('./controllers/articles')
,   UsersController = require('./controllers/users')

,   http = require('http')
,   path = require('path')
,   slashes = require("connect-slashes");


var app = express();

// all environments
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());

  app.use(less({
    src: __dirname + '/public',
    paths: [__dirname + '/public/ext_assets/bootstrap/less'],
    sourceMap: true
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(slashes());

  app.use(express.urlencoded());
  app.use(express.bodyParser());
  app.use(expressValidator());
  app.use(express.methodOverride());
  app.use(express.cookieParser('secret'));
  app.use(express.session());
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function(req, res, next){
    app.locals.userIsAuthenticated = req.isAuthenticated();
    app.locals.user = req.user;
    app.locals.errorMessages = req.flash('error');
    app.locals.successMessages = req.flash('success');
    next();
  });
  app.use(app.router);
});


app.configure('development', function() {
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/blog');
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function (err, user) {
      if (err)
        return done(err);
      if (!user)
        return done(null, false, {message: "Sorry, we don't recognize that username."});
      user.validPassword(password, function(err, isMatch){
        if(err)
          return done(err);
        if(isMatch)
          return done(null, user);
        else done(null, false, { message: 'Incorrect password.' });
      });
    });
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  req.flash('error', 'Please sign in to continue.');
  var redirect = req.url;
  return res.redirect('/login?redirect='+redirect);
};

function redirectAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return res.redirect('/');
  return next();
};


app.get('/',                  HomeController.index);
app.get('/login',             redirectAuthenticated,
                              UsersController.login);
app.get('/reset_password',    redirectAuthenticated,
                              UsersController.resetPassword);
app.post('/reset_password',   redirectAuthenticated,
                              UsersController.generatePasswordReset);
app.get('/password_reset',    redirectAuthenticated,
                              UsersController.passwordReset);
app.post('/password_reset',   redirectAuthenticated,
                              UsersController.processPasswordReset);
app.post('/login',            redirectAuthenticated,
                              UsersController.authenticate);
app.get('/register',          redirectAuthenticated,
                              UsersController.register);
app.post('/register',         redirectAuthenticated,
                              UsersController.userValidations,
                              UsersController.create);
app.get('/account',           ensureAuthenticated,
                              UsersController.account);
app.post('/account',          ensureAuthenticated,
                              UsersController.userValidations,
                              UsersController.update);
//app.get('/dashboard',         ensureAuthenticated,
//                              UsersController.dashboard);
app.get('/logout',            UsersController.logout);
app.get('/users',             ensureAuthenticated,
                              UsersController.index);
app.get('/posts/',            ArticlesController.index);
app.get('/posts/new',         ensureAuthenticated,
                              ArticlesController.new);
app.post('/posts/new',        ensureAuthenticated,
                              ArticlesController.create);
app.get('/posts/:id',         ArticlesController.show);
app.post('/posts/:id/add_comment',
                              ensureAuthenticated,
                              ArticlesController.addComment);
app.get('/posts/:id/edit',    ensureAuthenticated,
                              ArticlesController.edit);
app.post('/posts/:id/edit',   ensureAuthenticated,
                              ArticlesController.update);
app.get('/posts/:id/approve', ensureAuthenticated,
                              ArticlesController.approve);
app.all('*',                  HomeController.notFound);
/*
app.get('/', function(req, res) {
  articleProvider.findAll(function(error, docs) {
    console.dir(docs);
    res.render('index.jade', {title: 'Blog', articles: docs});
  });
});
*/

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  Keyword.distinct('_id', function(err, keywords) {
    if (err)
      throw err;
    app.locals.keywords = keywords;
    http.createServer(app).listen(app.get('port'), function() {
      console.log('Express server listening on port ' + app.get('port'));
    });
  });
});
