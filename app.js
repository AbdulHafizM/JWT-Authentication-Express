require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
const path = require('path')
const connectDB = require('./db/connect')
const authenticateToken = require('./middleware/auth')
const authRouter = require('./routes/main')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use('',authRouter)

app.get('/',(req,res)=>{
    res.render('pages/index')
})

app.get('/login', (req,res)=>{
    res.render('pages/login')
})

app.get('/register', (req,res)=>{
    res.render('pages/register')
})

app.get('/dashboard', authenticateToken, (req,res)=>{
    res.render('pages/dashboard')
})

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(4000,()=>{
            console.log('server is live')
        })
    }catch(err){
        console.log(err)
    }
}

start()