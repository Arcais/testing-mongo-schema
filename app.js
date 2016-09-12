var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/taiga');

var usersSchema = new mongoose.Schema({
  username: String,
  password: String
},{collection:"userstest"});

var User = mongoose.model('User', usersSchema);

var usertesting = new User({ username: "arcais2" , password: "unencrypted" });
usertesting.save();

/* ************************** */

var roomsSchema = new mongoose.Schema({
  roomname: String,
  messages: [
  	{
	  	userid: {
	  		type: mongoose.Schema.ObjectId,
	  		ref: 'User'
	  	},
	  	timestamp: {
	  		type: Date, 
	  		default: Date.now
	  	},
	  	body: String
  	}
  ]
},{collection:"roomstest"});

var Room = mongoose.model('Room', roomsSchema);

var roomtesting = new Room({ roomname: "World of Warcraft" , messages:[{ userid: '57d6cef6bce0ff1da0f3442e' , body: 'asdf' },{ userid: '57d6cef6bce0ff1da0f3442e' , body: 'asdf2' },{ userid: '57d6cef6bce0ff1da0f3442e' , body: 'asdf3' }] });
roomtesting.save();

//
//

console.log("finished");