require('dotenv').config();

var mongoose = require('mongoose');
const port = 8000;
mongoose.connect('mongodb+srv://akshatormohit:Rsdkamar@1911@chat-app.8ajnorh.mongodb.net/?retryWrites=true&w=majority');

const  app =require('express')();

const http =require('http').Server(app);

const userroute = require('./routes/userroute');

app.use('/',userroute);

const io = require("socket.io")(http);

 var usp= io.of('/user-namespace');

 const user= require('./models/usermodel');

 const chat = require('./models/chatmodel');


 usp.on('connection',async function(socket){
       console.log('User Connected');
       
       var userid = socket.handshake.auth.token;
      await user.findByIdAndUpdate({_id:userid},{ $set: {isonline:'1'}});
      socket.broadcast.emit('getonlineuser',{userid :userid});
       socket.on('disconnect',async function(){
        console.log("User Disconnected");
        var userid = socket.handshake.auth.token;
         
       await user.findByIdAndUpdate({_id:userid},{ $set: {isonline:'0'}});
       socket.broadcast.emit('getofflineuser',{userid :userid});
       })

       socket.on('newchat',function(data){
         socket.broadcast.emit('loadnewchat',data);
       })


       socket.on('existchat',async function(data){
          var chats = await chat.find({
            $or : [ { sender_id :data.sender_id ,receiver_id :data.receiver_id}
                ,{ sender_id :data.receiver_id ,receiver_id :data.sender_id}
            ]
          });

          socket.emit('loadchats', {chats:chats});


       });
 });





http.listen(port ,function(err){
    if(err){
        console.log("404");
    }else{
        console.log("Server Succesfully Running");
    }
})
