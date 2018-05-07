var express = require('express');
var jwt = require('jsonwebtoken');

var usersRouter = express.Router();
var dbc = require('../database/database');

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
          var token = jwt.sign(req.body, process.env.SECRET_KEY, {
            expiresIn: '7d'
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
            if (rows[0].password === password) {
              data.error = 0;
              var token = jwt.sign({ email: rows[0].email, password: rows[0].password}, process.env.SECRET_KEY, {
                expiresIn: '7d'
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