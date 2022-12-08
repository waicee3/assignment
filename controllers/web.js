const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');
const Enquiry = require('../models/enquiry');const auth =(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/sign-in');
    }
}



router.get('/',(req,res)=>{
    User.findOne({username : 'admin'},(err,admin)=>{
        if(err) throw err;
        if(!admin){
            User.createUser((err)=>{
                if(err) throw err;
                 res.render('./index');
            });
        }
        else{
            res.render('./index');
        }
    })
});

router.get('/about-us',(req,res)=>{
    res.render('./about-us');
});

router.get('/cake-listing',(req,res)=>{
    res.render('./cake-listing');
});

router.get('/dresses-listing',(req,res)=>{
    res.render('./dresses-listing');
});

router.get('/florist-listing',(req,res)=>{
    res.render('./florist-listing');
});
router.get('/contact-us',(req,res)=>{
    res.render('./contact-us');
});
router.get('/dashboard-cakes',auth,(req,res)=>{
    Enquiry.find({service:'cakes'},(err,enquiries)=>{
        if(err) throw err;
        res.render('./dashboard-cakes',{
            enquiries : enquiries,
            active : 'cakes'
        });

    });
});

router.get('/dashboard-dresses',auth,(req,res)=>{
    Enquiry.find({service:'dresses'},(err,enquiries)=>{
        if(err) throw err;
        res.render('./dashboard-dresses',{
            enquiries : enquiries,
            active : 'dresses'
        });

    });
});

router.get('/dashboard-flowers',auth,(req,res)=>{
    Enquiry.find({service:'flowers'},(err,enquiries)=>{
        if(err) throw err;
        res.render('./dashboard-flowers',{
            enquiries : enquiries,
            active : 'flowers'
        });

    });

});

router.post('/enquiry',(req,res)=>{
    try{
        
        if(validatePhoneNumber(req.body.mobile)){
        
            Enquiry.find({$and:[{mobile : req.body.mobile}, {service: req.body.service}]},(err, enquiry)=>{
                if(err) throw err;
                if(enquiry.length != 0){
                    req.flash('error','Enquiry already sent');
                    res.redirect('/');
                }
                else{
                    Enquiry.createEnquiry(new Enquiry(req.body),(err)=>{
                        if(err) throw err;
                        req.flash('success','Enquiry successfully sent');
                        res.redirect('/');
                    });
                }
            })
        }else{
            res.flash('error','Invalid mobile number');
            res.redirect('/');
        }
    }catch (e) {
        req.flash('error',/*'An error occured'*/e);
        res.redirect('/');
    }
});

router.get('/enquiry/:_id',auth,(req,res)=>{
    try{
        Enquiry.updateOne(req.params,{$set:{status : 'Resolved'}},(err, enquiry)=>{
            if(err) throw err;
            req.flash('success',"You have responded to an enquiry");
            res.redirect(req.header('Referer'));
        });
    }catch(e){
        req.flash('error', 'An error occured internally');
        res.redirect(req.header('Referer'));
    }
})

router.get('/sign-in',(req,res)=>{
    res.render('./login');
});

router.post('/sign-in',passport.authenticate('local',{failureRedirect: '/sign-in-error'}),(req,res)=>{
    res.redirect('/dashboard-cakes');
});

router.get('/sign-in-error',(req,res)=>{
    req.flash('error',"Either username or password is incorrect");
    res.render('./login');
});

router.get('/admin-dashboard',auth,(req,res)=>{
    res.render('./admin-dashboard');
});

router.get('/logout',(req,res)=>{
    req.logOut(err=>{
        if(err) throw err
        res.render('./login');
    });
});

function validatePhoneNumber(number) {
  var econetNumber = /^((\+|00)?263|0)?7(7|8)\d{7}$/;
    var netoneNumber = /^((\+|00)?263|0)?71\d{7}$/;
    var telecelNumber = /^((\+|00)?263|0)?73\d{7}$/;
    
    if(econetNumber.test(number)){
        return true;
    }else if(netoneNumber.test(number)){
        return true;
    }else if(telecelNumber.test(number)){
        return true;
    }else{
        return false
    }

//   return re.test(input_str);
}


module.exports=router
