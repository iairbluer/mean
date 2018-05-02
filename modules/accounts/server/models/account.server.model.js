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
 * Account Schema
 */
var AccountSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  customerName: {
    type: String,
    default: '',
    trim: true,
    required: 'Customer name cannot be blank'
  },
  customerId: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  status: { 
    type: String, 
    enum:['CONNECTED','DISCONNECTED', 'PROCESSING'], 
    default: 'DISCONNECTED'},
  provider: {
    providerName: {
      type: String,
      trim: true,
      default: ''
    },
    providerData: {
      type: Object,
      defult: null
    }
  }
});

AccountSchema.statics.seed = seed;

mongoose.model('Account', AccountSchema);

/**
* Seeds the User collection with document (Article)
* and provided options.
*/
function seed(doc, options) {
  var Account = mongoose.model('Account');

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
        Account
          .findOne({
            customerId: doc.customerId
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
            message: chalk.yellow('Database Seeding: Account\t' + doc.customerId + ' skipped')
          });
        }

        var account = new Account(doc);

        account.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Account\t' + account.customerId + ' added'
          });
        });
      });
    }
  });
}
