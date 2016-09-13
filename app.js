var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/taiga');

var server = app.listen(8000, function() {
  console.log("App is listening on http://localhost:%d", server.address().port);
});

var usersSchema = new mongoose.Schema({
  username: String,
  screenname: String,
  password: String,
  sesstoken: String
},{collection:"userstest"});

var User = mongoose.model('users', usersSchema);

//var usertesting = new User({ username: "arcaya22" , screenname: "ArCaYa22", password: "unencrypted" , sesstoken: "notokenyet" });
//usertesting.save();

/* ************************** */

var roomsSchema = new mongoose.Schema({
  roomname: String,
  prettyname: String,
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

var Room = mongoose.model('rooms', roomsSchema);

//var roomtesting = new Room({ roomname: "jojos-bizzare-adventure" , prettyname: "JoJo's Bizzare Adventure", messages:[] });
//roomtesting.save();

//
//


app.get('/graph/userlist', function(req,res){
	User.find(function(err,data){
		res.send(data);
	});
});

app.get('/graph/roomlist', function(req,res){
	Room.find(function(err,data){
		res.send(data);
	});
});


app.get('/graph/messages/:roomname', function(req,res){
	Room.find({roomname: req.params.roomname.toLowerCase()},function(err,data){
		if(data.length==0){
			res.send(null);
		}
		else{
			var messages = data[0].messages;
			res.send(messages);
		}
	});
});

app.get('/graph/users/:username', function(req,res){
	User.find({username: req.params.username.toLowerCase()},function(err,data){
		if(data.length==0){
			res.send(null);
		}
		else{
			res.send({username: data[0].username, screenname: data[0].screenname});
		}
	});
});