var express = require("express");
var app = express();
var nunjucks = require("nunjucks");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/wdyws");
var Message = null;

var db = mongoose.connection;

db.on("error", console.error);
db.once("open", function() {
	var messageSchema = new mongoose.Schema({
		user: String,
		content: String,
	});
	Message = mongoose.model("Message", messageSchema);
});

nunjucks.configure("views", {
	autoescape: true,
	express: app
});


app.use(express.static("./public"));
app.use(express.bodyParser());

app.get("/", function(request, response){
	Message.find(function(err, users){
		console.log(users);
		response.render("index.html", {
		name: "What Do You Wanna Say?",
		pageName: "Home",
		pages: {
			"Home": "/",
			"Send Message": "/sendmessage",
			"About": "/about"
		},
		users: users
	});
	});
	
});

app.get("/sendmessage", function(request, response){
	response.render("sendmessage.html", {
		name: "What Do You Wanna Say?",
		pageName: "Send Message",
		pages: {
			"Home": "/",
			"Send Message": "/sendmessage",
			"About": "/about"
		}
	})
});

app.get("/about", function(request, response){
	response.render("about.html", {
		name: "What Do You Wanna Say?",
		pageName: "About",
		pages: {
			"Home": "/",
			"Send Message": "/sendmessage",
			"About": "/about"
		}
	});
});

app.post("/sent_message", function(request, response){
	var newMessage = new Message({user: request.body.message.name, content: request.body.message.content});
	newMessage.save(function(err){
		if(!err) {
			response.redirect("/");
		}
	});
});

app.listen(3000);
console.log("Now listening on: http://localhost:3000");