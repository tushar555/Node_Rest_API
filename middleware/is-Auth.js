const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {

    const token = req.get('Authorization').split(' ')[1];
    let newToken;
    try {
        newToken = jwt.verify(token, 'somesupersecrete')
    } catch{
        const err = new Error('Failed');
        err.statusCode = 500;
        throw err;
    }

    if (!newToken) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
    }

    req.userId = newToken.userId;
    next()
}