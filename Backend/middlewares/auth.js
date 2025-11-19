const jwt = require("jsonwebtoken");
const User = require("../models/user");
//Protect routes: only allow protected routes with a valid cookie token
async function requireAuth(req, res,next) {
    try{
        const token = req.cookies?.token;
        if(!token) return res.status(401).json({message: "Not Authenticated"});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) return res.status(401).json({mesage: "User Not found"});
        req.user = user;
        next();
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Invalid Token"});   
    }
}

function requiredRoles(...allowedRoles) {
    //returns a function(middleware) that checks roles
    return(req, res, next) => {
        if(!req.user) return res.status(401).json({message: "Not authenticated"});
        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({message: "Insufficient Permissions"});

        }
        next();

    }
}module.exports= {requireAuth, requiredRoles};
