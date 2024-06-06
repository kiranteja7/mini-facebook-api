
import { applicationError } from '../../error-handler/applicationError.js';
import {createMail} from '../../mailer.js';
import { userModel } from '../user/user.schema.js';

export class OtpRepository{


   async sendOtp(toEmail, currentUser, req){

    try{
    const user = await userModel.findOne({email : toEmail});

    if(!user){
        return {status: 404, message: { status: 'failure', message : 'User not found!'}};
    }

    if(user._id != currentUser){
        return {status: 401, message: { status: 'failure', message: 'You cant access this user details'}};
    }
        
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    req.session.otp = otp;
    req.session.otpExpires = Date.now() + 300000; // OTP valid for 5 minutes

    const error = createMail(otp, toEmail);
    if(error){
        return error;
    }

    return {status: 200, message: {status: 'success','message': 'OTP send! Remember that it will be expired in 5 mins'}};
   }catch(err){
    console.log(err);
    new applicationError('something went wrong', 500);
   }
  }
  
  
   async verifyOtp(req, otp){

    if (req.session.otp && req.session.otpExpires > Date.now()) {
        if (otp.toString() == req.session.otp) { 
          req.session.verified = true
          return {status: 200, message: { status: 'success', message: 'OTP valid and verified successfull!'}};
        }
        return {status: 400, message: {status: 'failure', message: 'Invalid OTP'}};
      }
      return {status: 400, message: {status: 'failure', message: 'OTP Expired'}};
  }
}