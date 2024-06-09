const request = require('supertest');
const express = require('express');
const fileUpload = require('express-fileupload');
const fileHandler = require('../src/controller/filehaddler');
const fs = require('fs');
const path = require('path');
const mockFs = require('mock-fs');
const { createHttpError } = require('http-errors');

const app = express();
app.use(fileUpload());
app.post('/upload', fileHandler.uploadFile);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message
    });
});

describe('file haddel controller ', () => {

    afterEach(() => {
        mockFs.restore();
    });

    it('should return 404 if no image is uploaded', async () => {
        const res = await request(app).post('/upload');
        
        expect(res.status).toBe(404);
        console.log(res.body);
        expect(res.body.message).toBe('Image not found');
    });

    it('should return 400 if uploaded file is not an image', async () => {
        const res = await request(app)
            .post('/upload')
            .attach('image', Buffer.from('<html></html>'), 'test.html');

        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Only images are allowed");
    });



})