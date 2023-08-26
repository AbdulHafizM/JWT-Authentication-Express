require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())

const users = []

const posts = [
    {
        username : 'Kyle',
        title:'Post 1'
    },
    {
        username : 'John',
        title:'Post 2'
    }
]

app.get('/posts', authenticateToken, (req,res) => {
    console.log(Error)
    console.log(StatusCodes)
    console.log(req.user)
    console.log(req.headers['authorization'])
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req,res)=>{
    const username = req.body.username
    const user = {name : username}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken})
})


app.get('/users', (req,res)=>{
    console.log(req)
    res.json(users)
})

app.post('/users', async(req,res)=>{
    try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = {name: req.body.name, password: hashedPassword}
    users.push(user) 
    res.status(201).json(users)
    }catch(err){
        res.status(500).send(err)
    }
})

app.post('/users/login', async(req,res)=>{
    const user = users.find(user => user.name == req.body.name)
    if(user == null){
        res.status(400).send('User not found')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send("success")
        }else{
            res.send("Not allowed")
        } 
    } catch (error) {
        res.status(500).send()
    }
})

function authenticateToken(req,res,next){
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(4000,()=>{
    console.log('server is live') 
})