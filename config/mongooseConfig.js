
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const db_url = process.env.DBURL;

export const connectToMongoose = async() =>{
    try{
     await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true});
     console.log("CONNECT TO MONGOOSE USING MONGO DB");
    }catch(err){
        console.log(err);
    }

}