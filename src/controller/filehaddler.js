const createHttpError = require("http-errors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const File = require("../models/file");

const publicDirectory = path.join(__dirname, "..", "..", "public");
const fileDirectory = path.join(publicDirectory, "file");

exports.uploadFile = async (req, res, next) => {
    try {

       
        if (!req.files || !req.files.image) {
            throw createHttpError(404, "Image not found");
        }else if (req.files !=null){
            var image = req.files.image;

        }
        
         if (!image.mimetype.startsWith("image")) {
            throw createHttpError(400, "Only images are allowed");       
        }


        const uniqueId = uuidv4();
        const fileExtension = path.extname(image.name);
        const uniqueFilename = `${uniqueId}${fileExtension}`;
        const filePath = path.join(fileDirectory, uniqueFilename);   

        await image.mv(filePath);

        const dbFilePath = `file/${uniqueFilename}`;

        const newFile = new File({
            name: image.name,
            filepath: dbFilePath,
            directory: filePath,
            size: image.size
        });

        await newFile.save();
        res.status(201).json(newFile);

    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.deleteFile = async (req, res, next) => {
    try {
        const { filepath } = req.body;


        if (filepath === undefined || filepath === null || filepath === "") {
            throw createHttpError(400, "File path is required");
        }

        const fileToDeletePath = path.join(publicDirectory, filepath);

        fs.unlink(fileToDeletePath, async (err) => {
            try {
                if (err) {
                    console.error("Unable to delete local image file:", err);
                    throw createHttpError(500, "File deletion failed");
                } else {

                    console.log("Local image file deleted successfully.");
                    await File.deleteOne({ filepath: filepath });
                    res.status(200).json({ message: `Image deleted successfully. Path: ${filepath}` });

                }


            } catch (error) {
                console.error(error);
                next(error);
            }
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
}


exports.findSingleFile = async (req, res, next) => {
    try {

        if (req.body.filepath) {

            const { filepath } = req.body

            const file = await File.findOne({filepath: filepath })
           
            if (!file) {
                throw createHttpError(404, "Image not found");
            }else{
                res.status(200).json(file);
            }         
           

        } else {
            throw createHttpError(404, "file path is null ,please provide file path")
        }

    } catch (error) {
        console.log(error)
        next(error)

    }

}
