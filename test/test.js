const {expect} = require('chai')
const request = require('supertest')

const app = require('../index')

describe('Thumbnail API', ()=>{
    //Create dummy login data
    const loginDetails = {
        username: "anyuser",
        passsword: "anypassword"
    };
    const invalidLoginDetails = {
        username: "",
        passsword: ""
    };

    //Token variable to store generated token
    let token;

    //valid and invalid image URL
    const imageURL = 'https://i.ibb.co/wdjpq4W/lyricviz-app-icon.png';
    const invalidImageURL = 'https://i.ibb.co/wdjpq4W/lyricviz-app-icon';

    describe('Mock Authentication', () => {
        it('should deny empty username and password input fields',
            (done) => {
              request.agent(app)
                  .post('/')
                  .send(invalidLoginDetails)
                  .end((err, res) => {
                    expect(res.statusCode).to.equal(402);
                    done();
                  });
            });
            it('should accept username and password to return a token',
            (done) => {
              request.agent(app)
                  .post('/')
                  .send(loginDetails)
                  .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.authorization).to.equal(true);
                    token = res.body.token;
                    done();
                  });
            });
      });

    describe('Thumbnail generation', () =>{
        it('should accept the token and generate image thumbnail',
            (done) => {
                request.agent(app)
                    .get('/image')
                    .set('token',token)
                    .send({url: imageURL})
                    .end((err,res)=>{
                    expect(res.statusCode).to.equal(200);
                    done()
                    })
            }
        )
        it('should not generate image thumbnail if token is missing or invalid',
        (done) => {
            request.agent(app)
                .get('/image')
                .set('token','some-random-token')
                .send({url: imageURL})
                .end((err,res)=>{
                expect(res.statusCode).to.equal(401);
                
                done()
                })
            }
        )
        it('should not generate image thumbnail if the url is invalid',
        (done) => {
            request.agent(app)
                .get('/image')
                .set('token',token)
                .send({url: invalidImageURL})
                .end((err,res)=>{
                expect(res.statusCode).to.equal(400);
                
                done()
                })
            }
        )
        
    })
})