const mongoose  = require("mongoose")
require('dotenv').config();
const port = process.env.PORT || 4000
const path = process.env.MONGO_URI

const app = require('./app')

mongoose.connect(path,{}).then(result =>{  
    console.log("data base  is  connected ")

    app.listen(port, ()=>{
        console.log('Server is running on http://localhost:' ,port)
    })
}).catch(err => console.log(err));
