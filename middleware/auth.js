const jwt = require('jsonwebtoken');  //this require for checking token is valid



const checkAuth=(req,res,next)=>{
  //  console.log("hello auth") 
       const token=req.cookies.token
      // console.log(token)   
      if(!token){
        req.flash("error","token not get")
      }  
      try {
        const decoded=jwt.verify(token,"gygusddcgdwvhjdhd")
        // console.log(decoded)
        req.user=decoded
        // console.log(req.user)
        next()
      } catch (error) {
        req.flash("error","you are not login")
        return res.redirect("/login")
      }                                         
}
module.exports=checkAuth