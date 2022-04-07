const express = require('express');
const jsonServer = require('json-server');
const server = jsonServer.create();
const auth = require('json-server-auth');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const JWT_SECRET_KEY=require('json-server-auth/dist/constants').JWT_SECRET_KEY;
const path = require('path');
const router = jsonServer.router(path.join(__dirname,'/client/src/db/data.json'));
const middlewares = jsonServer.defaults();
const axios = require('axios');
const app = express();
const fileUpload = require('express-fileupload');
// const timeout = require('connect-timeout');
const fs = require('fs');
const randToken = require('rand-token');
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// app.use(timeout('5s'))
server.use(
    cors({
        origin: "*",
        preflightContinue: false,
        methods: "GET,POST,DELETE",
        credentials: true
    })
);

server.use(auth);
server.use(middlewares);
// server.use(jsonServer.bodyParser);
app.use(server);
app.use(express.json())
app.use(fileUpload());
// app.use(cookieParser);
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
app.post('/users/upload',(req,res)=>{
    console.log('/users/upload');
    let uploadPath;
    if(req.files === null){
        return res.status(400).json({msg:'No  file uploaded'});
    }

    const file = req.files.file;

    uploadPath = __dirname + '/client/public/uploads/'+file.name;

    file.mv(uploadPath,err=>{
        if(err){
            console.log(err);
            return res.status(500).json(err);
        }

        res.json({fileName: file.name, filePath: uploadPath});
    });
});

app.delete("/users/delete", async(req,res)=> {
    console.log("/users/delete");
    const deleteId = req.query.id;
    console.log(deleteId);
    console.log(fs.existsSync(path.join(__dirname,"/client/public/uploads/"+deleteId+".jpg")));
    if(fs.existsSync(path.join(__dirname,"/client/public/uploads/"+deleteId+".jpg"))){
        try{
            fs.unlinkSync(path.join(__dirname,"/client/public/uploads/"+deleteId+".jpg"));
            console.log("image delete");
        }catch(err){
            console.log(err);
        }
    }
})

app.post('/users/register',(req,res)=>{
    console.log('/users register url call');
    try{
        // const data = jwt.verify(token, JWT_SECRET_KEY);
        const _username = req.body.username;
        const _password = req.body.password;

        let userInfo = [];

        const generateToken = () => {
            const token = jwt.sign(
                    {username:_username},
                    JWT_SECRET_KEY,
                    {expiresIn:JWT_EXPIRES_IN, subject:_username}
            );
            return token;
        }
        
        console.log(_username + " " + _password);
        axios({
            url: 'http://localhost:3001/users',
            method: 'GET'
        }).then((response)=>{
            console.log(response.data);
            console.log(response.data.length);
            userInfo = JSON.stringify();
            response.data.map(user => {
                if(user.id === _username){
                    return res.status(409).json({msg:'이미 가입된 사용자입니다.'});
                }
            })
            console.log(_username);
            console.log(JSON.parse(JSON.stringify(response.data))[0].username);
            console.log(JSON.parse(JSON.stringify(response.data))[0].nickname);
                
            axios.post('http://localhost:3001/users',{
                id:JSON.stringify(response.data).length + 1,
                username:_username,
                password:_password,
                nickname:'',
                status:true
            }).then((response)=>{
                console.log('user add success!');
                const token = generateToken();
               
                console.log(token);
                return res.status(200).cookie('access_token', token, {
                    maxAge:1000*60
                });
            });
            
        });

    }catch(err){
        console.log(req.query.username+req.query.password)
        res.status(401).json({msg:err});
    }
});

app.get('/users',(req,res)=>{
    console.log('/users url call');

    try{
        // const data = jwt.verify(token, JWT_SECRET_KEY);
        const _username = req.query.username;
        const _password = req.query.password;
        const generateToken = () => {
            const token = jwt.sign(
                    {username:_username},
                    JWT_SECRET_KEY,
                    {expiresIn:JWT_EXPIRES_IN, subject:_username}
            );
            return token;
        }

        axios({
            url: 'http://localhost:3001/users',
            method: 'GET'
        }).then((response)=>{
            console.log(_username);
            console.log(JSON.parse(JSON.stringify(response.data))[0].username);
            console.log(JSON.parse(JSON.stringify(response.data))[0].nickname);
            console.log(JSON.parse(JSON.stringify(response.data))[0]);
            // console.log(_cookies);
            // const _cookies = req.cookies.access_token;
            // const decoded = jwt.verify(_cookies,JWT_SECRET_KEY);
            // console.log(decoded);
            if(_username == JSON.parse(JSON.stringify(response.data))[0].username){

            }else{
                return res.status(400).json({msg:'not found username'});
            } 
            console.log('send json data isLoggedIn true');
            const token = generateToken();
               
            console.log(token);
            return res.status(200).cookie('access_token', token, {
                maxAge:1000*60
            }).json(JSON.parse(JSON.stringify(response.data))[0]);
        });
    }catch(err){
        console.log(req.query.username+req.query.password)
        res.status(401).json({msg:err});
    }
})

app.get('/users/check',(req,res)=>{
    console.log('/users/check url call');

    try{
        const _username = req.query.username;
        console.log(req.cookies.access_token);
        const access_token = req.cookies.access_token;

        const generateToken = () => {
            const token = jwt.sign(
                    {username:_username},
                    JWT_SECRET_KEY,
                    {expiresIn:JWT_EXPIRES_IN, subject:_username}
            );
            return token;
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const now = Math.floor(Date.now()/1000);
        if(decoded.exp - now < 60){
            axios({
                url: 'http://localhost:3001/users',
                method: 'GET'
            }).then((response)=>{
                console.log(_username);
                console.log(JSON.parse(JSON.stringify(response.data))[0].username);
                console.log(JSON.parse(JSON.stringify(response.data))[0].nickname);
                console.log(JSON.parse(JSON.stringify(response.data))[0]);

                if(_username == JSON.parse(JSON.stringify(response.data))[0].username){
    
                }else{
                    return res.status(400).json({msg:'not found username'});
                } 

                const token = generateToken();
                   
                console.log(token);
                return res.status(200).cookie('access_token', token, {
                    maxAge:1000*60
                }).json(JSON.parse(JSON.stringify(response.data))[0]);
            });
        }

    }catch(err){
        console.log(req.query.username);
        res.status(401).json({msg:err});
    }
});

app.listen(5000,()=>console.log('Server started...'));