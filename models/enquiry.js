const mongoose = require('mongoose');

const enquirySchema = mongoose.Schema({
        firstname:{
            type: String,
            trim: true,
        },
        lastname:{
            type: String,
            trim: true,
        },
        mobile:{
            type: String,
        },
        service:{
            type: String,
            trim: true
        },
        status:{
            type: String
        },
        response:{
            type: String,
            trim : true
        },
        description:{
            type: String,
            trim: true
        },
    },
    {
        timestamps: true
    }
);

const Enquiry = module.exports = mongoose.model('Enquiry',enquirySchema);
module.exports.createEnquiry=(newEnquiry,callback)=>{
    newEnquiry.status = 'Pending';
    newEnquiry.save(callback);
}


