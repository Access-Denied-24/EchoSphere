import jwt from "jsonwebtoken";

const userAuth = async(req,res,next) => {
  const { token } = req.cookies;

  if(!token) return res.json({success:false, message: "Not Authorized. Login again"})

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

    if(tokenDecode.id){
      // console.log(tokenDecode);
      // console.log((tokenDecode.id));
      // console.log('req body : ', req.body)
      req.body = req.body || {}; 
      
      req.body.userId = tokenDecode.id;
    }
    else{
      console.log('jwt error');
      return res.json({success:false, message: "Not Authorized. Login again"})
    } 

    next(); // will call controller func

  } catch (error) {
    res.json({success:false, message: error.message})
  }
}

export default userAuth