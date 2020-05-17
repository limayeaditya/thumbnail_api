var express = require('express');
var app = express();

//to generate token
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

//handle multipart/form data
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

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));


//Validate request and express to recieve the token
app.post('/', 

//Set validation parameters
body('user', 'Username is required.')
.isLength({min: 1}),

//Validate request and express to recieve the token
    (req, res) => {

        // Save errors from validation, if any.
        const errors = validationResult(req);

//Check if invalid
    if(!errors.isEmpty()){
        
        res.status(402).send('Invalid');

    } else { 

        const user = req.body.user.toLowerCase();
        const password = req.body.password;
        let token = jwt.sign(user, key.secret);

        //pass the token as response 
        res.status(200).json({token: token, user: user, authorization: true});

    }
}
);

//initially verifies the token and then generates the thumbnail
app.get('/image',middlewares.validity,middlewares.thumbnailCreation,(req,res)=>{

    //send response as link to the generated thumbnail
	res.send("Successfully created and downloaded the thumbnail");
	
});

//listening on port 3000
app.listen(3000);

module.exports = app;