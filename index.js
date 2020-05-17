var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

//include token verification and thumbnail generation
var middlewares = require('./middlewares');

/**
 * Required for token generation along with username
 * @type {string}
 */
const key = require('./key');

//make the thumbnails folder static
app.use(express.static('thumbnails'));

/**
 * Render login on http://localhost:3000/
 * @param {string} path - Render on given path
 * @param {Function} - Express response on path specified
 */
app.get('/', function(req, res){
   res.render('login');
});


/**
 * Set view engine to PUG
 */
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
    const password = req.body.password;
    let token = jwt.sign(user, key.secret);

    //pass the token as response 
    res.status(200).json({token: token, user: user, authorization: true});

});

//initially verifies the token and then generates the thumbnail
app.get('/image',middlewares.validity,middlewares.thumbnailCreation,(req,res)=>{

    //send response as link to the generated thumbnail
	res.send("Successfully created and downloaded the thumbnail");
	
});

//listening on port 3000
app.listen(3000);

module.exports = app;