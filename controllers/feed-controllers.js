const { validationResult } = require('express-validator/check')
const Post = require('../models/posts');
const socket = require('../socket')

exports.getfeeds = async (req, res, next) => {
    console.log("AAAAAAAAAAAAAAA")

    console.log(req.headers.authorization)
    try {
        const posts = await Post.find();
        if (!posts) {
            const err = new Error('Error No post available');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ posts: posts, "message": "success" });
    } catch (err) {
        next(err)
    }
    // Post.find().then((posts) => {
    //     if (!posts) {
    //         const err = new Error('Error No post available');
    //         err.statusCode = 404;
    //         throw err;
    //     }
    //     res.status(200).json({ posts: posts, "message": "success" });

    // }).catch(err => next(err))
}

exports.getSinglePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).then(post => {
        if (!post) {
            const err = new Error('Error No post available');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ post: post, "message": "success" });
    }).catch(err => next(err))

}


exports.addfeeds = (req, res, next) => {
    const errors = validationResult(req);
    let title = req.body.title
    let content = req.body.content
    console.log(req.file)
    if (!errors.isEmpty()) {
        const err = new Error('Incorrect input');
        err.statusCode = 422;
        throw err;
    }


    if (!req.file) {
        const err = new Error('No file');
        err.statusCode = 422;
        throw err;
    }
    let imageUrl = req.file.path;


    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: {
            "name": "Tushar"
        }
    })
    socket.getIO().emit('posts', { action: 'create', post: post })
    post.save().then(result => {

        res.status(201).json({
            post: result,
            message: 'Success'
        })
    }).catch(error => next(error))


}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    if (!postId) {
        const err = new Error('No ID available');
        err.statusCode = 404;
        throw err;
    }
    Post.findById(postId).then((post) => {
        if (!post) {
            const err = new Error('No ID available');
            err.statusCode = 404;
            throw err;
        }
        const errors = validationResult(req);
        const title = req.body.title;
        const content = req.body.title;
        if (!errors.isEmpty()) {
            const err = new Error('Incorrect input');
            err.statusCode = 422;
            throw err;
        }
        let imageUrl = req.body.image;
        if (req.file) {
            imageUrl = req.file.path;
        }

        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;

        return post.save();

    }).then((result) => {
        res.status(200).json({ "message": "Success", post: result });
    }).catch(err => {
        next(err)
    })





}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).then((result) => {
        if (!result) {
            const err = new Error('No ID available');
            err.statusCode = 404;
            throw err;
        }

        return Post.findByIdAndRemove(postId)

    }).then((result) => {
        res.status(200).json({ message: "success", post: result });
    }).catch(err => {
        next(err)
    })
}