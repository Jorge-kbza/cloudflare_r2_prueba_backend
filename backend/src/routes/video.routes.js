const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const videoController = require('../controllers/video.controllers');
const validate = require('../middlewares/validate.middleware');
const { uploadVideoSchema } = require('../validations/video.schema');

router.post('/upload', upload.single('video'), validate(uploadVideoSchema), videoController.uploadVideo);
router.get('', videoController.getVideos);
router.get('/:id', videoController.getVideoById);
router.get('/:id/stream', videoController.streamVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;