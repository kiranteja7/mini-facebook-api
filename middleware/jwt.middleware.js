import jwt from 'jsonwebtoken';

const jwtAuth= (req, res, next)=>{

    //1 Read the token
    const token = req.headers['authorization'];

    //2  if not token return the error
    if(!token){
        return res.status(401).send('Token is not provided :)');
    }

    //3 check whether the token is valid or not 
    const secretCode = process.env.JWT_SEC;
    try{
    const payload = jwt.verify(token, secretCode);
    req.userID = payload.userID;
    }catch(err){
        return res.status(401).send(err);
    }

    //4 call next 
    next();
    //5 return error

}

export default jwtAuth;