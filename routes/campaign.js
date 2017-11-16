const express  = require('express');
const Campaign = require('../models/Campaign');
const TYPES    = require('../models/campaign-types');
const router   = express.Router();
const { ensureLoggedIn }  = require('connect-ensure-login');

const multer = require('multer');
const uploader = multer({dest:'./public/uploads'});

router.get('/new', (req, res) => {
  res.render('campaigns/edit', { types: TYPES, campaign:{}});
});

router.post('/new', [ensureLoggedIn('/auth/login'), uploader.single('photo')], (req, res, next) => {
  const {title, goal, description, category, deadline } = req.body
  const newCampaign = new Campaign({
    title, goal, description, category, deadline,
    photo: req.file.filename,
    creator: req.user._id
  })
  newCampaign.save().then(c => {
    res.redirect(`/campaign/${c._id}`);
  }).catch(e => res.render('campaigns/new', { campaign:newCampaign, types: TYPES }));
});

router.get('/:id', (req, res) => {
  Campaign.findById(req.params.id)
          .populate('creator')
          .then( campaign => {
            console.log(campaign);
            res.render('campaigns/detail',{campaign})
          })
          .catch(e => next(e));
});

router.get('/:id/edit', ensureLoggedIn('/auth/login'), (req, res, next) => {
  Campaign.findById(req.params.id)
  .then(campaign =>{
    res.render('campaigns/edit', { campaign, types: TYPES })
  })
  .catch(e => next(e));
});


const ensureOwnerEdits = (req,res,next) =>{
  Campaign.findById(req.params.id)
  .populate('creator')
  .then(campaign =>{
    if(req.user._id.equals(campaign.creator._id)){
      return next();
    };
    throw new Error("YOu are not the owner");
  })
  .catch(e => {
    console.error(e);
    res.redirect('/campaign/'+req.params.id)
  });
}


router.post('/:id/edit', [ensureLoggedIn('/auth/login'), ensureOwnerEdits, uploader.single('photo')], (req, res, next) => {

  const {title,goal,description,category,deadline} = req.body;
  console.log(req.file);
  const updates = {title,goal,description,category,deadline,
    photo: req.file.filename
  };

  Campaign.findByIdAndUpdate(req.params.id, updates)
  .then(campaign => res.redirect(`/campaign/${campaign._id}`))
  .catch(e => {
    console.log(e);
    console.log("CAMPAIGN UPDATED");
    res.render('campaigns/edit', {
      campaign:updates,
      error: e.message,
      types: TYPES
    });
  });
});

module.exports = router;
