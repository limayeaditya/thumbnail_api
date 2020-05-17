# Stateless Microservice for CashFlo

A simple stateless microservice in Nodejs, with three major functionalities -

 * Authentication
 * Image Thumbnail Generation


## Setup

The API requires [Node.js](https://nodejs.org/en/download/)

To get up and running: 

**1.** Clone the repo.
```
git clone https://github.com/limayeaditya/thumbnail_api.git
```

**2.**  ```cd``` into repo. Use the same directory name(below) if you do not change it.
```
cd thumbnail_api
```

**3.**  Setup the application by installing its dependencies with
```
npm install
```

**4.**  The app gets up and running on port 3000 with ```npm start```.

**5.**  **Important** Change the secret key in ```key.js``` file and set to any secret phrase you want.
 

## Testing the API routes.

Since this is mostly an API with post and patch requests, testing will be done with [Postman](https://www.getpostman.com/)

### Authentication
This is a mock authentication so you can pass in any username or password to login.
 1. Set the request to **POST** and the url to _http://localhost:3000/_. 
 2. In the **Body** for the Postman request, select **x-www-form-urlencoded**.
 3. You will be setting 2 keys (for username and password). Set the ```username``` key to any name. Set ```password``` to any password (minimum of 6 characters).
 4. Hit ```Send```. You will get a result in this format:
 ```
{
    "token": "eyJhbGciOiJIUzI1NiJ9.YWRpdHlh.hzgzfroavhFtF2RiksRQXdhYNTxRyIJfxMUUOa5Kyhc",
    "username": "aditya",
    "authorization": true
}
 ```


 ### Image Thumbnail Generation
This request contains a public image URL. It downloads the image, resizes to 50x50 pixels, and returns the resulting thumbnail.
 1. Set the request to **GET** and the url to _/image_.
 2. Set the key ```url``` to a public image url.
 3. Since this is a secure route, for testing, you will have to set the token in the ```Header```. Set key as ```token``` and value as token you received from **Authentication**.
 4. Image will be downloaded and converted to a thumbnail of size 50x50 pixels with a sample result as below:
 ```
{
    "thumbnail": "./lyricviz-app-icon.png",
    "converted": true
}
```


## Unit Testing

Unit testing is done using mochai.

Run ```npm test``` from the application's root directory.




## Built With

 * [Node.js](https://nodejs.org)
 * [Express](https://expressjs.com/)
 * [Mocha](https://mochajs.org/) - For testing



