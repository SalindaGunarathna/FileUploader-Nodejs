const createHttpError = require("http-errors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const file = require("../mode/file");

exports.uploadFile = async (req, res, next) => {

    try {

        const image = req.files.image;
        if (!image) {
            throw createHttpError(404, "image not found");
        }
        if (!image.mimetype.startsWith("image")) {
            throw createHttpError(400, "Only images are allowed");
        }

        // Generate a unique identifier (UUID)
        const uniqueId = uuidv4();
        // Extract image extension 
        const fileExtension = image.name.split('.').pop();
        // Construct a unique filename by appending the uniqueId and image extension
        const uniqueFilename = `${uniqueId}.${fileExtension}`;
        // Set the local image path with the unique filename
        let filDirectoryepath = " "; // default

        filDirectoryepath = path.join(__dirname, '..', '..', 'public', 'file', uniqueFilename);

        image.mv(filDirectoryepath); // save image to local location

        // in database  only store relative path for thatdefine filepath
        const filepath = `file/${uniqueFilename}`;

        const newFile = new file({
            name: image.name,
            path: filepath,
            directory: filDirectoryepath,
            size: image.size
        });

        // save data to database


        await newFile.save();
        res.status(201).json(newFile);

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.deleteFile = async (req, res, next) => {
    try {
        const {filepath} = req.body;

        let filDirectoryepath = path.join(__dirname, '..', '..', 'public', filepath);
        
        // delete image from local location
        if (filDirectoryepath != " ") {
            fs.unlink(filDirectoryepath, (err) => {
                if (err) {
                    console.error("Unable to delete local image file:", err);
                } else {
                    console.log("Local image file deleted successfully.");
                }
            });

        }
        // delete data from database
        await file.deleteOne({ path: filepath });

        return 204;
    } catch (error) {
        next(error);
    }
}