const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

//Help Createatoken 
const generateToken =(userId) => {
    return jwt.sign({id: userId},process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

//Register User
const registerUser= async(req, res)=> {
try {
    const{name, email, password, role} = req.body;
    //check if email Exists
    const userExists = await User.findOne({email});
    if(userExists) return res.status(400).json({message: "User already exists "});

    //Create new User
    const user= await User.create({name, email, password, role})

    //token
    const token = generateToken(user._id)

    //send token in cookie 
    res.cookie("token", token,{
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
    });
    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,


    });

}catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const aboutMe = async(req, res) => {
    try{
        const token = req.cookies?.token;
        if(!token) return res.status(200).json(null);
        const decoded = require("jsonwebtoken").verify(token, proccess.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) return res.status(200).json(null);
        res.json({id: user._id, name: user.name, email: user.email, role: user.role});

    }catch(err) {
       res.status(200).json(null);
    }
}

//Login User
const loginUser = async(req, res)=> {
    try {
       const {email, password}= req.body;

    //find user by email
    const user = await User.findOne({email}).select("+password");
    if(user&&(await user.matchPassword(password))){
        const token= generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict"


        });

        res.json({
            success: true,
            message: "login Successful",
            user:{
                _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,

            }
            

        });
        
        
    }else {
        res.status(401).json({message: "invalid email or password"})
    }

    }catch(err){
        res.status(500).json({message: err.message});
    }
   

};

// 3. Logout User
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
module.exports = { registerUser, loginUser, logoutUser, aboutMe};