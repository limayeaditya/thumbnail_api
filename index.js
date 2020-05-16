var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var middlewares = require('./middlewares');
const key = require('./key');


require('dotenv').config();

app.use(express.static('thumbnails'));



app.get('/', function(req, res){
   res.render('login');
});

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

app.post('/', function(req, res){
    const user = req.body.user.toLowerCase();
    let token = jwt.sign(user, key.secret);
    
    res.status(200).send({token: token});

});

app.get('/image',middlewares.validity,middlewares.ThumbnailCreation,(req,res)=>{
	res.send("Successfully downloaded and thumbnail created");
	
});
app.listen(3000);