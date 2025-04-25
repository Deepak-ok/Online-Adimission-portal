const express=require('express')
const FrontController=require('../Controllers/FrontController')
const route=express.Router()

// route.get('/', (req, res) => {
//   res.send('Hello it is a home page')
// })

// route.get('/about', (req, res) => {
//   res.send('Hello Deepak it is an about page')
// })

route.get('/',FrontController.home)
route.get('/about',FrontController.about)
route.get('/course',FrontController.course)
route.get('/contact',FrontController.contact)
route.get('/login',FrontController.login)
route.get('/register',FrontController.register)


module.exports=route