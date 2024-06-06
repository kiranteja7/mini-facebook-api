import dotenv from 'dotenv';

dotenv.config();


import nodemailer from 'nodemailer';



export const createMail = (otp, email) =>{

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:  'tkteja22@gmail.com',
          pass: 'miqf yavs htdq ggqb',
        },
      });
      

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return {status: 500, 'message': 'Error sending OTP'}
        }
      });
}

