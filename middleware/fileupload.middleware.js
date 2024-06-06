
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
         cb(null, './uploads/');
    },
    filename: (req, file, cb)=>{
         const filename = new Date().toISOString().replace(/:/g, '_') +file.originalname;
         cb(null, filename);
    }
})

const limits = {
     fileSize: 30 * 1024 // 30KB in bytes
 };;

export const upload = multer({storage: storage, limits: limits});