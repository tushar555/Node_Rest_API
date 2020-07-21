const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed-controllers');

router.get('/getposts', feedController.getfeeds)

module.exports = router;