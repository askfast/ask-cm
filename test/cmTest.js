var CM = require('../index'),
  request = require('request'),
  sinon = require('sinon'),
  async = require('async'),
  should = require('should');

describe('CM', function () {

  var cm = new CM();
  before(function(done){
    sinon
      .stub(request, 'post')
      .yields(null, null, "");
    done();
  });

  after(function(done) {
    request.post.restore();
    done()
  });


  describe('generateMessage', function () {
    it("should generate a cm message", function(done){
      cm.generateCMXML("TEST", "0031612345678", "Test message", function(err, message){
        done()
      })
    })
  });


  describe('sendSMS', function () {
    var address = "+316123456789";
    it("should should through a number format exception", function(done){
      cm.sendSMS("TEST", address, "Test message", function(err, res) {
        err.should.be.equal("A given address is invalid")
        done()
      })
    })

    it("should should through a to long from address exception", function(done){
      cm.sendSMS("TEST MESSAGE", "31612345678", "Test message", function(err, res){
        err.should.equal("from can't be larger then 11 characters")
        done()
      })
    })

    it("should send an cm message", function(done){
      cm.sendSMS("TEST", "0031612345678", "Test message", function(err, res){
        request.post.called.should.be.equal(true);
        res.should.be.empty;
        done(res);
      })
    })
  })
})