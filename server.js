const user = require('./services/userservice');

const APP_SECRET = '162065773f102c50be377e1fab836915';
const VALIDATION_TOKEN = 'vicnoob';
const PAGE_ACCESS_TOKEN = 'EAAGNY1HOGtQBALAZAr7ZAtUtwLUHiOnpZA3gKZBewJUKXR5dlWoGFOrseRtGdf9uCNm4w4FrZBAbhXlS1G4QnUSuYRhOeWcAKDxNsZA3xdMZCwCow33uIxh54mj7ZCoONfGXuILjZAFxBuRqEfJwokp4UgIJHq1jdP9WEenLq2ehZAOwZDZD';

var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");

var senders = [];
app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function (req, res) { // Đây là path để validate tooken bên app facebook gửi qua
  if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log('dung token')
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.get('/test', async function (req, res) {
  let res1 = await user._UsersServices.deleteUsers('deleteUsers');
  res.send(res1);
});



app.get('/push', async function (req, res) {
  let res1 = await user._UsersServices.getAllUsers();
  if (res1 && res1.length) {
    for(let user of res1) {
      sendMessage(user.userId, 'this is push message');
    }
  }
  res.send('Sent');
});

app.post('/webhook', function (req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text = message.message.text;
          if (text == 'subscribe') {
            sendMessage(senderId, "Đã subscribe");
            user._UsersServices.addNewUsers(senderId);
          } else if (text.indexOf('unsub') > -1) {
            user._UsersServices.deleteUsers(senderId)
            sendMessage(senderId, "Đã unsubscribe");
          } else {
            sendMessage(senderId, "Ko subscribe");
          }
        }
      }
    }
  }

  res.status(200).send("OK");
});

// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

app.set('port', process.env.PORT || 5000);
app.set('ip', process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function () {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});