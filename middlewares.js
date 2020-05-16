const path = require('path');
const jwt     = require('jsonwebtoken');
const key = require('./key');
const download = require('image-downloader');
const fs = require('fs');

const resizeImg = require('resize-img');



const validity = (req,res,next)=>{
	const {token} = req.headers;
	if(token){
		jwt.verify(token, key.secret, function(err, decoded) {
			if (err) {
				res.send('unauthorized');

			}
			else{
				next();
			}
		});
	}
	else{
		res.send('Not good')
	}
	
};

const ThumbnailCreation = (req,res,next)=>{
	
				
	


	let url = req.body.url;
	let ext = path.extname(url).trim();
	console.log(ext)
	if(ext === '.bmp' || ext === '.jpg' || ext ==='.png'){
		//generate
		const options = {
		 url: url,
		 dest: './'
		};

		download.image(options)
		.then(({ filename, image }) => {
			console.log(filename);
			resizeImg(fs.readFileSync(filename), {width:50, height:50}).then(buf => {
				fs.writeFileSync("./thumbnails/"+filename, buf);
				
				res.json({thumbnail: './'+filename});
			next();
		}).catch((err) => {
			res.send("Error");
		});
 
	})
	}

	else{
		res.send('File extensions allowed- [bmp,png,jpg]');
	}

};

module.exports.validity = validity;

module.exports.ThumbnailCreation = ThumbnailCreation;