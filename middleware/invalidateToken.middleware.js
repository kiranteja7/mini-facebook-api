
const blacklist = [];
let loggedOut = false;

export const invalidateToken = (req, res, next) =>{
     
    const token = req.headers['authorization'];


    if(req.path == '/logout' ){

        blacklist.push(token);
        const currentUser = blacklist[blacklist.length-1];

        if(loggedOut){
            return res.status(400).json({
                status: 'failure',
                message: 'User already logged out!'
            });
        }

        if(blacklist.includes(currentUser)){
            loggedOut= true;
            return  res.status(200).json({
                status: 'success',
                message: 'User Logged out successfully'
            });
        }
    }

    next();
}
