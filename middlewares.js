const path = require('path');
const jwt     = require('jsonwebtoken');
const key = require('./key');
const download = require('image-downloader');
const fs = require('fs');
const resizeImg = require('resize-img');

/**
 * Verify the token with secret key
 * @param {Object} req - Express request object 
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function, on successful verification
 *  
 */
const validity = (req,res,next)=>{
	const {token} = req.headers;
	if(token){
		jwt.verify(token, key.secret, function(err, decoded) {
			if (err) {
				res.status(401).send('Unauthorized');
				//token invalid
			}
			else{
				next();
				//go for thumbnail generation
			}
		});
	}
	else{
		res.status(401).send('Token is missing')
		//token is missing
	}
	
};

/**
 * Create the thumbnail of the image in ""
 * @param {Object} req - Express request object 
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function, on successful verification
 */
const thumbnailCreation = (req,res,next)=>{
	
	let url = req.body.url; //image URL 
	let ext = path.extname(url).trim(); //trims the image name from the URL
	
	//check for valid file extensions
	if(ext === '.bmp' || ext === '.jpg' || ext ==='.png'){
		
		//download options
		const options = {
		 url: url,
		 dest: './'
		};

		download.image(options) // download image
		.then(({ filename, image }) => {
			
			resizeImg(fs.readFileSync(filename), {width:50, height:50}).then(buf => {
				fs.writeFileSync("./thumbnails/"+filename, buf); //download the image resized to thumbnail
		
				res.status(200).json({thumbnail: './'+filename}); //send json including link to new thumbnail as response
			
		}).catch((err) => {
			res.status(400).send("Error"); //error found
			
		});
 
	})
	}

	else{

		res.status(400).send('File extensions allowed- [bmp,png,jpg]'); //response for invalid file extension
	}

};

module.exports.validity = validity;

module.exports.thumbnailCreation = thumbnailCreation;