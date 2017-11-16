// models/campaign.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const TYPES    = require('./campaign-types');
const moment = require('moment');

const CampaignSchema = new Schema({
  title         : { type: String, required: true },
  description   : { type: String, required: true },
  category      : { type: String, enum: TYPES, required: true },
  creator      : { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goal          : { type: Number, required: true },
  backerCount   : { type: Number, default: 0 },
  totalPledged  : { type: Number, default: 0 },
  deadline      : { type: Date, required: true },
  photo: String
});

CampaignSchema.virtual('cuantoqueda').get(() => {
  return moment(this.deadline).fromNow(true);
});


module.exports = mongoose.model('Campaign', CampaignSchema);
