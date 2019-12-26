// importing the required modules
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;


// fetching the setup file
const config=require('../setup/config');


// fetching the schema
const Admin=require('../models/Admin');


// configuring the strategy
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;


// exporting the strategy
module.exports=passport=>{
passport.use(new JwtStrategy(opts,(jwt_payload, done)=>{
    Admin.findById(jwt_payload.id)
            .then(admin=>{
                if (admin)
                    return done(null, admin);
                else
                    return done(null, false);
    })
    .catch(err=>console.log(err));
}));
};