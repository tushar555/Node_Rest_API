const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const User = require('../models/user');
const authController = require('../controllers/auth-controller');
const bcrypt = require('bcryptjs');

let Founduser;
router.put('/signup', [
    body('email').isEmail().custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
            if (user) {
                Promise.reject('Try another Email')
            }
        })
    }
    ),
    body('name').trim().not().isEmpty(),
    body('password').trim().isLength({ min: 5 })
], authController.signup)

router.post('/signin', [
    body('email').isEmail().trim(),
    body('password').trim()
], authController.signin)

module.exports = router;