var xml2js = require('xml2js'),
    request = require('request'),
    phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const CM_URL = "http://smssgateway.clubmessage.nl/cm/gateway.ashx";

var CM = function(userId, username, password) {
  this.userId = userId || process.env.CM_USER_ID;
  this.username = username || process.env.CM_USERNAME;
  this.password = password || process.env.CM_PASSWORD;

  if(!this.userId || !this.username || !this.password) {
    throw 'CM Client requires an userId, username and password explicitly ' +
    'or via the CM_USER_ID, CM_USERNAME and CM_PASSWORD environment variables';
  }
}

CM.prototype.sendSMS = function(from, to, message, callback) {
  var cm = this;
  var invalidAddress = false;
  if(from.length > 11) {
    return callback("from can't be larger then 11 characters", null);
  }

  if (!cm.isValidPhoneNumber(to)) {
    return callback("A given address is invalid");
  } else {
    var parse = phoneUtil.parse(to, "NL")
    to = "00" + parse.getCountryCode() + parse.getNationalNumber();
  }

  // TODO: Check encoding message

  this.generateCMXML(from, to, message, function(err, cmmessage){
    request.post({body: cmmessage, url: CM_URL}, function(err, response, body){

      //TODO: Check error
      callback(err, body);
    })
  })
}

CM.prototype.generateCMXML = function(from, to, message, callback) {

    var xml = {
      MESSAGES : {
        CUSTOMER: {
          $: {
            ID: this.userId
          }
        },

        USER: {
          $: {
            LOGIN: this.username,
            PASSWORD: this.password
          }
        },

        MSG: {
          FROM: {
            _: from
          },

          TO: {
            _: to
          },

          BODY: {
            _: message
          }
        }
      }
  }

  var builder = new xml2js.Builder({cdata: true});
  var cmMessage = builder.buildObject(xml);

  callback(null, cmMessage);
}

CM.prototype.isValidPhoneNumber = function(address, locale) {

  if(locale == null) {
    locale = "NL";
  }
  var parse = phoneUtil.parse(address, locale);
  try {
    if (phoneUtil.isValidNumber(parse)) {
      return true;
    }
  } catch(e) {
    console.log(e);
  }

  return false;
}

module.exports = CM;