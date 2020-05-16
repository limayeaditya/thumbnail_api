const path = require('path');
const jwt     = require('jsonwebtoken');
const key = require('./key');
const download = require('image-downloader');
const fs = require('fs');
const resizeImg = require('resize-img');

//check if token is valid
const validity = (req,res,next)=>{
	const {token} = req.headers;
	if(token){
		jwt.verify(token, key.secret, function(err, decoded) {
			if (err) {
				res.send('unauthorized');
				//token invalid
			}
			else{
				next();
				//go for thumbnail generation
			}
		});
	}
	else{
		res.send('Token missing')
		//token is missing
	}
	
};

const ThumbnailCreation = (req,res,next)=>{
	
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
		
				res.json({thumbnail: './'+filename}); //send json including link to new thumbnail as response
			next();
		}).catch((err) => {
			res.send("Error"); //error found
			
		});
 
	})
	}

	else{

		res.send('File extensions allowed- [bmp,png,jpg]'); //response for invalid file extension
	}

};

module.exports.validity = validity;

module.exports.ThumbnailCreation = ThumbnailCreation;