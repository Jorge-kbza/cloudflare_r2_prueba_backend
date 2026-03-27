const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const videoController = require('../controllers/video.controllers');

router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.get('', videoController.getVideos);
router.get('/:id', videoController.getVideoById);
router.get('/:id/url', videoController.getVideoUrl);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;