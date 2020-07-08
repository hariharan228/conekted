const express = require('express')
const { model } = require('../models/user')
const router = express.Router()
const mongoose = require ('mongoose')
const  User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')

//get routes
router.get('/',(req,res)=>{
    res.send('Hello')
})

router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user")
})

//end get routes

//post routes

router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body
    if(!email||!password||!name){
       return res.status(422).json({error:"Please add all the fields"})
    }
    else{
        res.json({message:"Success"})
    }
    User.findOne({email:email}).then((saveduser)=>{
        if(saveduser){
            return res.status(422).json({error:"User already exists"})
        }
        bcrypt.hash(password,12)
        .then(hashed=>{
            const user = new User({
                email,
               name,
               password:hashed,
               pic
           })
           user.save()
           .then(user=>{
               res.json({message:"User saved successfully"})
           })
           .catch(err=>{
               console.log(err)
           })
        })
        
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(422).json({error:"Please provide email or pwd"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email"})
        }
        else{

            bcrypt.compare(password,savedUser.password)
            .then(doMatch=>{
                if(doMatch){
                    //res.json({message:"Successfully logged in"})
                    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    const {_id,name,email,followers,following,pic} = savedUser
                    res.json({token,user:{_id,name,email,followers,following,pic}})
                }
                else{
                   return res.status(422).json({error:"Invalid password"})
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})
//end post routes

module.exports = router