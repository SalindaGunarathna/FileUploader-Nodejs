require('dotenv').config()
const express = require('express')
const cors = require('cors');    
const createHttpError = require('http-errors')
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload'); 


const app = express()
app.use(express.json()); 
app.use(fileUpload()); 


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(bodyParser.raw()); 
app.use(cors());

app.use('/public', express.static(path.join(__dirname, '..', '..', '..', 'public')));

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

const file = require('./routers/filehaddler')

app.use('/api/v1',file)

// error handler
app.use ((err,req,res,next) => {
     
   
    if (createHttpError.isHttpError(err)) {
        res.status(err.status).send({massage: err.message});
    }else[
        res.status(500).send({massage: err.message}),
    ]

    // unknown error
     res.status(500).send({massage:"Unknown error"})
})

module.exports  = app