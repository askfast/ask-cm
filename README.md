# ASK-CM Library

Node CM library for ASK CS usage

## Usage

var userId; // set userId
var username; // set username
var password; // set password
var cm = new CM(userId, username, password);
cm.sendSMS("TEST", "+31612345678", "Test message", function(err, res) {
  if(err) {
    return console.log(err);
  }

  console.log("Result: ", res);
});