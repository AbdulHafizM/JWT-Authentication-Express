const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async(req,res) => {
    console.log(req.body)
    const {username, email, password} = req.body

    const findUser = await User.findOne({email})
    if(findUser){
        return res.redirect('/register')
    }

    const hashedPass = await bcrypt.hash(password, 10)

    const user = new User({
        username: username,
        email:email,
        password: hashedPass
    })

    await user.save()
    res.redirect('/login')
}


const login = async(req,res) => {
    const {email, password} = req.body
    const findUser = await User.findOne({email})

    if(!findUser){
        return res.redirect('/login')
    }

    const isMatch = await bcrypt.compare(password, findUser.password)
    if(!isMatch){
        return res.redirect('/login')
    }
    const tokenUser = {
        id : findUser.id,
        username : findUser.username
    }
    const token = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30d',
    })
    sendToken = (token) =>{
        return res.status(200).json({token})
    } 
    await sendToken(token)
}


module.exports = {login,register}