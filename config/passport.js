const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('../config/keys')

module.exports = passport=>{
    const opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
    opts.secretOrKey = keys.secret
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
        user.findOne({id: jwt_payload.id}, (err,user)=>{
            if(err){
                return done(err, false)
            }
            if (user){
                done(null,user)
            }else{
                done(null, false)
            }
        })
    }))
}