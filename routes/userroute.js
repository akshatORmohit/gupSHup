const express = require('express');
const user_route = express();

const bodyparser =require('body-parser');
user_route.use(bodyparser.urlencoded({ extended: true }));

const session = require("express-session");
const {SESSION_SECRET }=process.env;
user_route.use(session({secret :SESSION_SECRET }));

user_route.set('view engine','ejs');
user_route.set('views' ,'./views');


user_route.use(bodyparser.json());
user_route.use(bodyparser.urlencoded({extended:true}));

const path = require('path');

user_route.use(express.static('public'));



const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'));
    },
    filename : function(req,file,cb){
        const  name = Date.now()+'-'+file.originalname; 
        cb(null,name);
    }
});

const upload = multer({storage:storage});


const usercontroller =require('../controllers/usercontroller');



const auth = require('../middlewares/auth');

user_route.get('/register',usercontroller.registerload);
user_route.post('/register',upload.single('image'),usercontroller.register);
user_route.get('/',usercontroller.loginload);
user_route.post('/',usercontroller.login);
user_route.get('/logout',usercontroller.logout);

user_route.get('/dashboard',usercontroller.dashboardload);

user_route.post('/save-chat',usercontroller.savechat);
user_route.get('*',function(req,res){
    res.redirect('/');
})



module.exports =user_route;