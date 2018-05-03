var express = require('express');
var cors = require('cors');
var jwt = require('jsonwebtoken');

var usersRouter = express.Router();
var dbc = require('../database/database');
var token;

usersRouter.use(cors()); // Enable CORS

/**
 * APIs authorisation with JWT token
 */
usersRouter.use(function (req, res, next) {
  if (req.url === '/register' || req.url === '/login') {
    next();
  } else {
    var token = req.body.token || req.headers['token'];
    var data = {};

    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, function (err) {
        if (err) {
          data['error'] = 1;
          data['data'] = 'Token is invalid';
          res.status(500).json(data);
        } else {
          next();
        }
      });
    } else {
      data['error'] = 1;
      data['data'] = 'Please send a token';
      res.status(403).json(data);
    }
  }
});

/**
 * Register users
 */
usersRouter.post('/register', function (req, res, next) {
  var data = {
    error: 1,
    data: ''
  }
  var userData = {
    'id': new Date().getTime(),
    'first_name': req.body.firstName,
    'last_name': req.body.lastName,
    'email': req.body.email,
    'password': req.body.pwd
  }

  dbc.getConnection(function (err, dbc) {
    if (err) {
      data['error'] = 1;
      data['data'] = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query('INSERT INTO `phantom_zone`.`users` SET ? ', userData, function (err, rows, fields) {
        if (!err) {
          token = jwt.sign(req.body, process.env.SECRET_KEY, {
            expiresIn: 5000
          });
          res.status(201).send(token);
        } else {
          data['data'] = 'Error Occured!';
          res.status(400).json(data);
        }
      });
      dbc.release();
    }
  });
});

/**
 * User login
 */
usersRouter.post('/login', function (req, res, next) {
  var data = {};
  var email = req.body.email;
  var password = req.body.pwd;

  dbc.getConnection(function (err, dbc) {
    if (err) {
      data['error'] = 1;
      data['data'] = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query('SELECT * FROM `phantom_zone`.`users` WHERE email = ?', [email], function (err, rows, fields) {
        if (err) {
          data.error = 1;
          data['data'] = 'Error Occured!';
          res.status(400).json(data);
        } else {
          if (rows.length > 0) {
            if (rows[0].password == password) {
              data.error = 0;
              token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                expiresIn: 5000
              });
              data['token'] = token;
              res.status(200).json(data);
            } else {
              data.error = 1;
              data['data'] = 'Email and Password does not match';
              res.status(204).json(data);
            }
          } else {
            data.error = 1;
            data['data'] = 'Email does not exists!';
            res.status(204).json(data);
          }
        }
      });
      dbc.release();
    }
  });
});

/**
 * Get users
 */
usersRouter.get('/get', function (req, res) {
  var token = req.body.token || req.headers['token'];
  var data = {};

  dbc.getConnection(function (err, dbc) {
    if (err) {
      data['error'] = 1;
      data['data'] = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query('SELECT * FROM `phantom_zone`.`users`', function (err, rows, fields) {
        if (!err) {
          data['error'] = 0;
          data['data'] = rows;
          res.status(200).json(data);
        } else {
          data['data'] = 'No data found';
          res.status(204).json(data);
        }
      });
      dbc.release();
    }
  });
});

module.exports = usersRouter;