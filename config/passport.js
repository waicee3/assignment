const localStrategy=require('passport-local').Strategy;
const User = require('../models/user');
const passport = require('passport');

module.exports=(passport)=>{
    passport.serializeUser((user,done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err,user)
        });
    });

    passport.use(new localStrategy({usernameField : 'identifier'},(username,password,done)=>{
        User.getUserByUsername(username,(err, user)=>{
            if(err) throw  err;
            if(!user){
                return done(null,false);
            }
            else{
                User.comparePassword(password,user.password,(err, isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }
                    else{
                        return done(null,false);
                    }
                })
            }
        })
    }))
}