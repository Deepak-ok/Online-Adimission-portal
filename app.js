const express = require('express')
const app = express()
const port=3000
const web=require(`./routes/web`)

//routing method
//in this code they find / by default as a path
// app.get('/', (req, res) => {
//   res.send('Hello it is a home page')
// })

// app.get('/about1', (req, res) => {
//   res.send('Hello Deepak it is an about1 page')
// })

// app.get('/deepak', (req, res) => {
//   res.send('Hello Deepak I am prepare your World! it is deepak page')
// })

//route loader
app.use('/',web)

app.listen(port, () => {
  console.log(`server start locahost:${port}`)
})