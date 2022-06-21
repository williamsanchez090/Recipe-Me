const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
var passport = require('passport');
var session      = require('express-session');
var flash    = require('connect-flash');

/**
 * App Routes 
*/
// require('config\passport')(passport); // pass passport for configuration
router.get('/', recipeController.homepage);

router.get('/recipe/:id', recipeController.exploreRecipe );
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);

// required for passport
router.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

 // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    router.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
    })
  
    // process the login form
    router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
  
    // SIGNUP =================================
    // show the signup form
    router.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
  
    // process the signup form
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
  
  // =============================================================================

//   user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    router.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
    // route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

  // PROFILE SECTION =========================
  router.get('/home', isLoggedIn, function(req, res) {
    db.collection('posts').find({postedBy: req.user._id}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', {
        user : req.user,
        posts: result
      })
    })
});
//feed page
router.get('/feed', function(req, res) {
  db.collection('posts').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('feed.ejs', {
      posts: result
    })
  })
});

module.exports = router;