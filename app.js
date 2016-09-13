var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://localhost/taiga');

var server = app.listen(8000, function() {
  console.log("App is listening on http://localhost:%d", server.address().port);
});

var usersSchema = new mongoose.Schema({
  username: {
  	type: String,
  	required: true
  },
  screenname: {
  	type: String,
  	required: true
  },
  password: {
  	type: String,
  	required: true
  },
  sesstoken: {
    type: String,
    default: ""
  },
  sessip: {
    type: String,
    default: ""
  }
},{collection:"users"});

var User = mongoose.model('User', usersSchema);

 // var userInsertObject = new User({ username: "arcayas22" , screenname: "ArCaYas22", password: "unencrypted" });
 // userInsertObject.save();

/* ************************** */

var roomsSchema = new mongoose.Schema({
  roomname: {
  	type: String,
  	required: true
  },
  prettyname: {
  	type: String,
  	required: true
  },
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
},{collection:"rooms"});

var Room = mongoose.model('Room', roomsSchema);

// var roomtesting = new Room({ roomname: "jojos-bizzare-adventure" , prettyname: "JoJo's Bizzare Adventure", messages:[] });
// roomtesting.save();

//
//


app.get('/graph/userlist', function(req,res){
	User.find(function(err,data){
		if(err){
			throw err;
		}
		res.send(data);
	});
});

app.get('/graph/roomlist', function(req,res){
	Room.find(function(err,data){
		if(err){
			throw err;
		}
		res.send(data);
	});
});

app.get('/graph/users/:username', function(req,res){
	User.find({ username: req.params.username.toLowerCase() },function(err,data){
		if(err){
			throw err;
		}
		if(data.length==0){
			res.send(null);
		}
		else{
			res.send({ id: data[0].id, username: data[0].username, screenname: data[0].screenname });
		}
	});
});

app.get('/graph/rooms/:roomname', function(req,res){
	Room.find({ roomname: req.params.roomname.toLowerCase() },function(err,data){
		if(err){
			throw err;
		}
		if(data.length==0){
			res.send(null);
		}
		else{
			res.send({ id: data[0].id, roomname: data[0].roomname, prettyname: data[0].prettyname });
		}
	});
});


app.get('/graph/messages/:roomname', function(req,res){
	Room.find({ roomname: req.params.roomname.toLowerCase() },function(err,data){
		if(err){
			throw err;
		}
		if(data.length==0){
			res.send(null);
		}
		else{
			var messages = data[0].messages;
			res.send(messages);
		}
	});
});

app.post('/graph/sendMessage', function (req, res) {
	var sentMessage=req.body;
 	var finalMessage = { userid: mongoose.Types.ObjectId(sentMessage.userid), body: sentMessage.body, timestamp: Date(sentMessage.timestamp) };
 	Room.where({ roomname: sentMessage.roomname.toLowerCase() }).update({ $push : {messages: finalMessage}},
    	function(err, result) {
			console.log(err);
			console.log(result);
		});
});