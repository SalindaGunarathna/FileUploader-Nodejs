const express  = require('express')
const router = express.Router()
const file = require('../controller/filehaddler')
const path = require('path')

router.post("/upload", file.uploadFile);
router.delete("/delete", file.deleteFile);
router.get("/findOnefile",file.findSingleFile);

module.exports = router