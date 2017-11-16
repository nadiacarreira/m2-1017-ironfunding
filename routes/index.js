const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

/* GET home page. */
router.get('/', function(req, res, next) {
  Campaign.find()
  .populate('creator')
  .then( campaigns => {
    res.render('home',{campaigns});
  }).catch(e => next(e));
});

module.exports = router;
