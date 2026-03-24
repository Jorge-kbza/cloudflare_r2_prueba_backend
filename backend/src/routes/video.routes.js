const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const videoController = require('../controllers/video.controller');

router.post('/upload', upload.single('video'), videoController.uploadVideo);

module.exports = router;