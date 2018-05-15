var express = require('express');
var jwt = require('jsonwebtoken');

var usersRouter = express.Router();
var dbc = require('../database/database');

/**
 * Register users
 */
usersRouter.post('/register', (req, res, next) => {
  var data = {
    error: 0
  }
  var userData = {
    'id': new Date().getTime(),
    'first_name': req.body.firstName,
    'last_name': req.body.lastName,
    'email': req.body.email,
    'password': req.body.pwd
  }

  dbc.getConnection((err, dbc) => {
    if (err) {
      data.error = 1;
      data.data = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query('INSERT INTO users SET ? ', userData, (err, rows, fields) => {
        if (err) {
          data.error = 1;
          data.data = 'Error occured';
          res.status(400).json(data);
        } else {
          data.token = jwt.sign(req.body, process.env.SECRET_KEY, {
            expiresIn: '7d'
          });
          res.status(201).json(data);
        }
      });
      dbc.release();
    }
  })
});

/**
 * User login
 */
usersRouter.post('/login', (req, res, next) => {
  var data = {
    error: 0
  }
  var email = req.body.email;
  var password = req.body.pwd;

  dbc.getConnection((err, dbc) => {
    if (err) {
      data.error = 1;
      data.data = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query('SELECT * FROM users WHERE email=?', [email], (err, rows, fields) => {
        if (err) {
          data.error = 1;
          data.data = 'Error Occured!';
          res.status(400).json(data);
        } else {
          if (rows.length === 1) {
            if (rows[0].password === password) {
              data.token = jwt.sign(req.body, process.env.SECRET_KEY, {
                expiresIn: '7d'
              });
              data.user = rows[0].first_name
              res.status(200).json(data);
            } else {
              data.error = 1;
              data.data = 'Email or password wrong';
              res.status(204).json(data);
            }
          } else {
            data.error = 1;
            data.data = 'Email not found';
            res.status(204).json(data);
          }
        }
      });
      dbc.release();
    }
  })
});

module.exports = usersRouter;