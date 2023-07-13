const user= require('../models/usermodel');
const chat= require('../models/chatmodel'); 
const bcrypt =require('bcrypt');

const path = require('path');


let mainfolder = path.join(__dirname,"../");


const registerload = async(req,res)=>{
    try{
       res.render('register');
    } catch(error){
       console.log(error.message);
    }
}

const register = async(req,res)=>{
    try{

        const passwordhash = await bcrypt.hash(req.body.password,12);

        const user1 = new user({
            name : req.body.name,
            email : req.body.email,
            image : 'images/'+req.file.filename,
            password :passwordhash
        });

        await user1.save();
        res.render('register' ,{message :'registered'});
    } catch(error){
       console.log(error.message);
    }
}

const loginload = async(req,res)=>{
    try{

        res.render('login');
     
    } catch(error){
       console.log(error.message);
    }
}


const login = async(req,res)=>{
    try{
        const email  =req.body.email;
        let password =req.body.password;
  
        const userdata = await user.findOne({email:email});

        
        if(userdata){
            console.log(password);
            console.log(userdata.password);

            const match = await bcrypt.compare(password,userdata.password);
           if(match){
            console.log("yes");
            req.session.user =userdata;
            try{
                res.redirect('/dashboard');

            }catch(error){
                console.log(error.message);
            }
            
           }else{
            res.render('login' ,{message :'Password is Incorrect'});
           }
        }else{
            res.render('login' ,{message :'Email Does Not Exist'});
        }
    } catch(error){
        console.log(error.message);
    }
}

const logout = async(req,res)=>{
    try{
      console.log("hello");
      req.session.destroy();
      res.redirect('/');
    } catch(error){
       console.log(error.message);
    }
}

const dashboardload = async(req,res)=>{
    try{

        var users = await user.find({_id : { $nin:[req.session.user._id]}});
   
         res.render('dashboard' ,{user : req.session.user ,users :users});
       } catch(error){
          console.log(error.message);
       }
}

const savechat = async(req,res)=>{
      try{
        var chat1 = new chat({
            sender_id:req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message:req.body.message,
        })

        let newchat1= await chat1.save();
        res.status(200).send({success:true,msg:"chat inserted",data:newchat1});
       } catch(error){
        console.log(error.message);
        res.status(404).send({success:false,msg:error.message});
       }
}




module.exports={
    registerload,
    register,
    loginload,
    login,
    logout,
    dashboardload,
    savechat

 }