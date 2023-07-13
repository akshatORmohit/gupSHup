const mongoose = require('mongoose');


const userschema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required :true,
        unique:true
    },
    image:{
        type:String,
        required :true
    },
    password:{
        type:String,
        required :true
    },
    isonline:{
        type:String,
        default :'0'
    }


},
  {timestamps :true}
);


module.exports = mongoose.model('user',userschema);
