const express=require('express')
const FrontController=require('../controllers/FrontController')
const AdminController=require('../Controllers/Admin/AdminController')
const CategoryController=require('../Controllers/Admin/CategoryController')
const JobController=require('../Controllers/Admin/JobController')
const route=express.Router()
const checkAuth=require('../middleware/auth')
const uploadResume=require('../middleware/UploadResume')
const ContactController = require('../Controllers/Admin/ContactController')

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
route.get('/joblist',FrontController.joblist)
route.get('/jobdetails/:id', FrontController.jobDetails)
//upload resume
route.post('/job/apply/:id',uploadResume.single('resume'),FrontController.jobApply)


//admin dashboard controllernode
route.get('/dashboard',checkAuth,AdminController.dashboard)
route.post('/AdminInsert',AdminController.userInsert)
route.post('/verifyLogin',AdminController.verifyLogin)
route.get('/logout',AdminController.logout)
//forgot password
route.get('/forgotPassword',AdminController.forgotPassword) 
route.post('/forgot-password',AdminController.forgotpassword1)
// Reset password
route.get('/reset-password/:token',AdminController.resetPasswordForm);
route.post('/reset-password/:token',AdminController.resetPassword);
route.get('/changePassword',AdminController.changePassword)
route.post('/changePassword1',AdminController.changepasswordUpdate)

//contact controller
route.post('/contactInsert',ContactController.contactInsert)



//category Controller
route.get('/category/display',checkAuth,CategoryController.dispay)  //category controller
route.post('/insertCategory',checkAuth,CategoryController.insertCategory)
route.get('/deleteCategory/:id',checkAuth,CategoryController.deleteCategory)
route.get('/viewCategory/:id',checkAuth,CategoryController.viewCategory)
route.get('/editCategory/:id',checkAuth,CategoryController.editCategory)
route.post('/UpdateCategory/:id',checkAuth,CategoryController.UpdateCategory)


 //category controller
route.get('/job/display',checkAuth,JobController.dispay) 
route.post('/insertJobs',checkAuth,JobController.insertJobs) 
route.get('/viewJob/:id',checkAuth,JobController.viewJob)
route.get('/editJob/:id',checkAuth,JobController.editJob)
route.post('/updateJob/:id',checkAuth,JobController.updateJob) 
route.get('/deleteJob/:id',checkAuth,JobController.deleteJob)

//my application
route.get('/myapplications',checkAuth,JobController.myApplication)
route.get('/applicants',checkAuth,JobController.viewAllJobs)
route.post("/admin/application/:id/status", checkAuth, JobController.updateApplicationStatus);





module.exports=route