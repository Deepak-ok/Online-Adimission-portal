const express = require('express')
const app = express()
const port=3000
const web=require(`./routes/web`)
const connectDB = require('./DB/ConnectDB')
const flash=require('connect-flash')
const session=require('express-session')
require('dotenv').config()
const userSetInfo =require('./middleware/userSetInfo')


//image upload
// const fileUpload=require('express-fileupload')

// app.use(fileUpload({
//   useTempFiles:true,
// }))

const cookieParser = require('cookie-parser')  //get token from cookie

app.use(cookieParser())

app.use(userSetInfo)

//session
app.use(session({
    secret: 'secret',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false,
}));
// Flash messages
app.use(flash())


app.set('view engine','ejs')  //view engine ejs

app.use(express.static('public')) //for using public files in that path

connectDB()

//data get form
app.use(express.urlencoded())




//route loader
app.use('/',web)

app.listen(process.env.PORT, () => {
  console.log(`server start locahost:${process.env.PORT}`)
})