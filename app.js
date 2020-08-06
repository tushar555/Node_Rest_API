const express = require('express');
const app = express();
const feedRouter = require('./routes/feeds-route');
const parser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const authRouter = require('./routes/auth');


const fileStorage = multer.diskStorage({
    destination: (err, file, cb) => {
        cb(null, 'images');

    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (req.mimetype === 'image/png' || req.mimetype === 'image/jpg' || req.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}




app.use(parser.json());
app.use(multer({ storage: fileStorage }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader('Access-Control-Allow-Headers', "Content-Type", "Authorization");
    next()
})
app.use('/feed', feedRouter);
app.use('/auth', authRouter);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ "message": message });
})

mongoose.connect('mongodb+srv://tusharsaindane02:Puv2Ki27dem43Kqb@cluster0-golou.mongodb.net/messages?retryWrites=true&w=majority').then((result) => {
    // console.log(result, "Connect")
    app.listen(8080);
}).catch((err) => {

})

