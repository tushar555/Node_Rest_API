const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed-controllers');
const { body } = require('express-validator/check');
const isAuth = require('../middleware/is-Auth');


router.get('/getposts', feedController.getfeeds)
router.post('/addposts', [
    body('title').trim().isAlphanumeric().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
], feedController.addfeeds)
router.get('/getposts/:postId', feedController.getSinglePost)

router.put('/updatePost/:postId', feedController.updatePost);
router.delete('/delete/:postId', feedController.deletePost);

module.exports = router;