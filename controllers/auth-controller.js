const Post = require('../models/posts');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/auth');

exports.signup = (req, res, next) => {
    const err = validationResult(req);
    console.log(err)
    if (!err.isEmpty()) {
        const error = new Error('Error');
        throw error;
    }

    let email = req.body.email
    let name = req.body.name
    let password = req.body.password

    bcrypt.hash(password, 12).then((hash) => {
        const user = new User({
            email: email,
            name: name,
            password: hash
        })

        return user.save();
    }).then((user) => {
        res.status(201).json({ message: 'Success', userId: user._id })
    }).catch(err => next(err))

}


exports.signin = (req, res, next) => {
    const err = validationResult(req);
    console.log(err)
    if (!err.isEmpty()) {
        const error = new Error('Error');
        error.statusCode = 422;
        throw error;
    } else {
        User.findOne({ email: req.body.email }).then((user) => {
            if (!user) {
                const error = new Error('Error');
                error.statusCode = 404;
                throw error;
            }
            Founduser = user;
            return bcrypt.compare(req.body.password, user.password)

        }).then((isMatch) => {
            if (!isMatch) {
                const error = new Error('Error');
                error.statusCode = 404;
                throw error;
            }
            const token = jwt.sign({ email: Founduser.email, userId: Founduser._id.toString() }, 'somesupersecrete', { expiresIn: '1h' })
            res.status(200).json({ token: token, message: 'Success' })

        }).catch((err) => {
            next(err);
        })


    }
}