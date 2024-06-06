
import { OtpRepository } from './otp.repository.js';


export class OtpController{

    constructor(){
        this.otpRepository = new OtpRepository();
    }

    async sendOtp(req, res, next) {
    
    try{
    const { email } = req.body;

    const currentUser = req.userID;

    const data =await this.otpRepository.sendOtp(email , currentUser, req);

    res.status(data.status).json(data.message);

    }catch(err){
        console.log(err);
        next(err);
    }
  };

    async verifyOtp(req, res, next) {
    try{
    const { otp } = req.body;
    const data = await this.otpRepository.verifyOtp(req, otp);
    res.status(data.status).json(data.message);

     }catch(err){
        console.log(err);
        next(err);
        }
    }

}