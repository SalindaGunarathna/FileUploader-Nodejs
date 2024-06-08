const mongoose = require('mongoose')


const fileSchema = new mongoose.Schema({
    name: String,
    path: String,
    direcotory: String,
    size: Number
})

module.exports = mongoose.model('File', fileSchema)