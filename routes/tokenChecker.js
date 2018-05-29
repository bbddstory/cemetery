var express = require('express');
var jwt = require('jsonwebtoken');

var tokenChecker = express.Router();

/**
 * APIs authorisation with JWT
 */
tokenChecker.use(function (req, res, next) {
    // console.log('-- Token checker --');
    // console.log('Token: ', req.body.token);
    // console.log('URL: ', req.url);
    // console.log('-------------------');
    
    if (req.url === '/users/register' || req.url === '/users/login') {
        next();
    } else {
        var token = req.body.token || req.headers['token'];
        var data = {};

        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, function (err) {
                if (err) {
                    data['error'] = 1;
                    data['data'] = 'Not authorised';
                    res.status(401).json(data); // Token has expired
                } else {
                    next();
                }
            });
        } else {
            data['error'] = 1;
            data['data'] = 'Please sign in';
            res.status(403).json(data);
        }
    }
});

module.exports = tokenChecker;