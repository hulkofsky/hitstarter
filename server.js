const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const port = 3000
const router = require('./routes/users')
const passport = require('passport')
const jwt = require('jsonwebtoken')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(morgan('dev'))

//initialize passport
app.use(passport.initialize())

//bring in password strategy
require('./config/passport')(passport)

app.use('/', router)

app.listen(port)
console.log(`server is running on ${port}`)