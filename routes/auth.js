var express = require('express');
const passport = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

var router = express.Router();

router.get('/signup', ensureLoggedOut(), (req, res, next)  => {
  res.render('auth/signup');
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/auth/signup'
}));

router.get('/login', ensureLoggedOut(), (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successReturnToOrRedirect:'/',
  failureRedirect : '/auth/login'
}));

router.get('/logout', ensureLoggedIn(), (req,res)=>{
  req.logout();
  res.redirect('/');
});

module.exports = router;
