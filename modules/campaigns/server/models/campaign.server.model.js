'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * campaign Schema
 */
var CampaignSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  campaignName: {
    type: String,
    default: '',
    trim: true,
    required: 'Campaign name cannot be blank'
  },
  clientId: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  account: {
    type: Schema.ObjectId,
    ref: 'Account'
  },
  status: { 
    type: String, 
    enum:['CONNECTED','DISCONNECTED', 'PROCESSING'], 
    default: 'DISCONNECTED'
  },
  provider: {
    type: String,
    trim: true,
    default: ''
  },
  providerData: {
    type: Object,
    defult: null
  }
});

CampaignSchema.statics.seed = seed;

mongoose.model('Campaign', CampaignSchema);

/**
* Seeds the User collection with document (Article)
* and provided options.
*/
function seed(doc, options) {
  var Campaign = mongoose.model('Campaign');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Campaign
          .findOne({
            campaignName: doc.campaignName
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Account (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: campaign\t' + doc.campaignName + ' skipped')
          });
        }

        var campaign = new Campaign(doc);

        campaign.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: campaign\t' + campaign.campaignName + ' added'
          });
        });
      });
    }
  });
}
