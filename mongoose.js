var express =  require('express');
var routes = require('./routes/main');
var profile = require('./routes/dashboard');
var path = require('path');
var http = require('http');
var session = require('express-session');
var bodyparser = require('body-parser');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook');
var mongodb = require('mongodb');
var md5 = require('md5');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/login');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var User = require('./models/user');

var app = express();
app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 100000 }
}))

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

 //Body Parser Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://Esfera:esfera456@ds133547.mlab.com:33547/esferasoft',function(err){
	if(err) console.log(err);
	console.log("Connected");
});


// passport.use(new LocalStrategy({
// 				username: 'email',
//   				password: 'password'
// 			},
// 		    function(username, password, done) {
// 		     User.findOne({ email:username,password:password }, function(err, userdata) {
// 				  if (err) { return done(err); }
// 				      if (!userdata) {
// 				        return done(null, null);
// 				      }
// 				      return done(null, userdata);
// 				   });
// 				}
// 		   ));
	  



// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//  	done(null, user);
// });



app.get('/',routes.index);
app.get('/logout',routes.logout);
app.get('/dashboard',ensureLoggedIn,profile.dashboard);
app.post('/process', passport.authenticate('local', { successRedirect: '/dashboard',successFlash: 'Welcome!',failureRedirect: '/',failureFlash: true}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on Ejsport ' + app.get('port'));
});