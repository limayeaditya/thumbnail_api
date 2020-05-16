var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

//include token verification and thumbnail generation
var middlewares = require('./middlewares');

//secret key: requisite for token generation
const key = require('./key');

app.use(express.static('thumbnails'));

//Renders the login screen on http://localhost:3000/
app.get('/', function(req, res){
   res.render('login');
});
//Sets the default view engine to pug
app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

//fetch the username and generate token for authentication
app.post('/', function(req, res){
    const user = req.body.user.toLowerCase();
    const password = req.body.password;
    let token = jwt.sign(user, key.secret);
    //pass the token as response
    res.status(200).json({token: token, user: user, authorization: true});

});

//initially verifies the token and then generates the thumbnail
app.get('/image',middlewares.validity,middlewares.ThumbnailCreation,(req,res)=>{
	res.send("Successfully created and downloaded the thumbnail");
	
});

//listening on port 3000
app.listen(3000);