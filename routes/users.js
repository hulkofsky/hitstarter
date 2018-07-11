const express = require('express')
const router = express.Router()
const {Client} = require('pg')
const keys = require('../config/keys')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//connecting to postgres
console.log(keys.postgres)
const postgresClient = new Client(keys.postgres)
postgresClient.connect((err)=>{
    err ? console.log(`Postgres connection error: ${err}`) :
    console.log('Postgres connected!')
})

router.post('/signup', (req,res)=>{
    if(!req.body.username||!req.body.email||!req.body.password){
        res.json({success: false, message: 'Pls enter name, email and password to register'})
    }else{
        bcrypt.genSalt(10, (err,salt)=>{
            if (err){
                console.log(err, 'while crypting password(gensalt)')
            }
            bcrypt.hash(req.body.password, salt, (err, hash)=>{
                if (err) {
                    console.log(err, 'while crypting password')
                }else{
                    const user = {
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    }
                    const query = `INSERT INTO users (name, email, password) VALUES ('${user.username}', '${user.email}', '${user.password}');`
                    postgresClient.query(query, (err)=>{
                        if(err) {
                            console.log(err, 'while adding user to DB')
                            return res.json({success: false, message: 'An error has been occured while inserting in Postgres'})
                        }
                        res.json({success: true, message: 'Succesfully registered a new user'})
                    })
                }
                
            })
        })
    } 
})

router.post('/signin', (req,res)=>{
    if(!req.body.email||!req.body.password) {
        res.json({success: false, message: 'Pls enter email and password to sign in'}) 
    }else{
        const query = `SELECT * FROM users WHERE email='${req.body.email}'`
        postgresClient.query(query, (err, result)=>{
        if(err) {
            console.log(err, 'while selecting user from DB')
            return res.json({success: false, message: 'An error has been occured while getting user from DB'})
        }
        if(result.rows[0]) {
            const user = result.rows[0]
            
            bcrypt.compare(req.body.password, user.password, (err, isMatch)=>{
                if (err) {
                    console.log(err)
                    return res.json({success: false, massage: `An error has been occured while comparing passwords ${err}`})
                }
                if(isMatch) {
                    console.log(user)
                    const token = jwt.sign(user, keys.secret, {
                        expiresIn: 10000 //in seconds
                    })
                    res.json({success: true, token: 'JWT ' + token})
                }else{
                    res.json({success: false, message: 'Authentication failed. Passwords did not match'})
                }
            })
        }else{
            res.json({success: false, message: 'User with this email not found'})
        }
        
    })
    }
    
})

router.get('/', (req,res)=>{
    res.send('homepage text')
})

module.exports = router