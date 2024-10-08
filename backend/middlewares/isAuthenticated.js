import jwt from "jsonwebtoken";
 const isAuthenticated=async (req,res,next)=>{
  try {
    const token=req.cookies.token;
    if(!token){
      return res.status(401).json({
        message:"user not authenicated",
        success:false
      });
    };
    const decode=await jwt.verify(token,process.env.SECRET_KEY);
   
    if(!decode){
      return res.status(401).json({
        message:"invalid",
        success:false
      });
    }
    req.id=decode.userid;
    next();
  } catch (error) {
    console.log(error);
  }
}


export default isAuthenticated;