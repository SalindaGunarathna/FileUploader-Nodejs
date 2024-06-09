const mongoose = require('mongoose')


const fileSchema = new mongoose.Schema({
    name: String,
    filepath: String,
    direcotory: String,
    size: Number
})

module.exports = mongoose.model('File', fileSchema)