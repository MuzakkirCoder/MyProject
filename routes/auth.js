import { Router } from "express";
const router = Router()
import User from "../models/user.js";
import bcrypt from 'bcrypt'
import { generateJWTToken } from "../token.js";


router.get('/login', (req, res) => {
  if(req.cookies.token) {
    res.redirect('/')
    return
  }
  res.render('login', {
   title:'Login | Muzakkir',
   isLogin:true,
   loginError: req.flash('loginError')
  })
})



router.get('/register', (req, res) => {
  if(req.cookies.token) {
    res.redirect('/')
    return
  }
  res.render('register', {
    title:'Register | Muzakkir',
    isRegister:true,
    registerError: req.flash('registerError')
  })
})

router.get('/lagout', (req, res) => {
  res.clearCookie('token')
   res.redirect('/') 
 })


router.post('/login', async (req, res) => {
  const {email, password} = req.body

  if(!email || !password) {
    req.flash('loginError', 'All fields is required')
    res.redirect('/login')
    return
  }

   const existUser = await User.findOne({email})
   if(!existUser) {
    req.flash('loginError', 'User not found')
    res.redirect('/login')    
    return
  }


  const isPassEqual = await bcrypt.compare(req.body. password, existUser.password)
  if(!isPassEqual) {
    req.flash('loginError', 'Password Wrong')
    res.redirect('/login')  
    return
  }
  const token = generateJWTToken(existUser._id)
  res.cookie('token', token, {httpOnly: true, secure: true})
  res.redirect('/')
  })

router.post('/register', async (req, res) => {
  const {firstname, lastname, email, password } = req.body

  if( !firstname || !lastname || !email || !password )  {
    req.flash('registerError', 'All fields is required')
    res.redirect('/register')
    return
  }

  const candidata = await User.findOne({email})
  if (candidata) {
    req.flash('registerError', 'User alredy exist')
    res.redirect('/register')
    return 
  }

  const  hashedPassword = await bcrypt.hash(req.body.password, 10)
  const userData = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email:req.body.email,
    password: hashedPassword,
  }
  const user = await User.create(userData)
  const token = generateJWTToken(user._id)
  res.cookie('token', token, {httpOnly: true, secure: true})
  res.redirect('/')
})


export default router;
