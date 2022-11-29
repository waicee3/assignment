const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        trim: true
    },
},
    {
        timestamps: true
    }
);

const User = module.exports = mongoose.model('User',userSchema);
module.exports.createUser=(callback)=>{
    bcryptjs.genSalt(10,(err,salt)=>{
        const newUser =new User({
            username: 'admin',
            password: '12345'
        });
        bcryptjs.hash(newUser.password,salt,(err,hash)=>{
            newUser.password=hash;
            newUser.save(callback);
        })
    })
}

module.exports.comparePassword=(password,hash,callback)=>{
    bcryptjs.compare(password,hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    })
}
module.exports.getUserByUsername=(username,callback)=>{
   User.findOne({
       username: username
   },callback)
}
