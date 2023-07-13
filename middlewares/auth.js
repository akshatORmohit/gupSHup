const islogin = async(req,res,next)=>{
    try{
       if(req.session.user){
       }else{
           res.redirect('/');
       }
    }catch(error){
      console.log(error.message);
    }
    next();
}
const islogout = async(req,res,next)=>{
    try{
       if(req.session.user){
        res.redirect('/dashboard');
       }else{
       }
    }catch(error){
      console.log(error.message);
    }
    next();
}

module.exports = {
    islogin,islogout
}