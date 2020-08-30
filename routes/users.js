var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');
const User = require('../models/users');
const passport = require('passport');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser,(req, res, next) => {
  User.find({})
  .then((user) => {
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(user);
  })
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

router.post('/login', (req, res,next) => {

  passport.authenticate('local',(err,user,info) => {
    if(err)
      return next(err);
    
      if(!user){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful',err: info});
      }
      else{req.logIn(user, (err) => {
        if(err){
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful',err: 'Could not login user'});
        }
      else{var token = authenticate.getToken({_id: req.user._id});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Login Successful',token:token});
      }})
  }})(req,res,next);
 
});
router.get('/checkJWTToken',(req,res) => {
  passport.authenticate('jwt',{session: false},(err,user,info) => {
    if(err)
    return next(err);

    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type','application/json');
      return res.json({status: 'JWT invalid',success:false,err:info})
    }
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      return res.json({status: 'JWT valid',success:true,user:user})
    }
  })(req,res);
})

module.exports = router;
