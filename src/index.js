const express = require("express")
const app = express()
const router = require("./router/taskrouter")
const userRouter = require('./router/user')
require('./db/mongoose')
app.use(express.json())
app.use(router)
app.use(userRouter)
const port = process.env.PORT  

app.listen(port,()=>{
    console.log("sever started port")
})