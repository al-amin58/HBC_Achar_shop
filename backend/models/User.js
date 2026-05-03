import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        sparse: true,
    },  
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        sparse: true,
    },  
    resetOtp:{
         type: String,
          default: null 
    },
    resetOtpExpires: { 
        type: Date,   
        default: null 
    },

}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);

 