const express  = require('express')
const router = express.Router()
const file = require('../controller/filehaddler')
const path = require('path')

router.post("/upload", file.uploadFile);
router.get("/delete", file.deleteFile);

module.exports = router