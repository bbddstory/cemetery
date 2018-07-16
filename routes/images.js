var express = require('express');
var jwt = require('jsonwebtoken');

var imagesRouter = express.Router();
var dbc = require('../database/database');
var fs = require('fs');
var formidable = require('formidable');

imagesRouter.post('/upload', (req, res, next) => {
  console.log('-- In upload...');
  
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    console.log(files);
    
    // res.write('File uploaded');
    console.log('File uploaded');
    
    var oldpath = files.imageupload.path;
    console.log(oldpath);
    
    var newpath = '../../images/' + files.imageupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write('File uploaded and moved!');
      res.end();
    });
  });
});

/**
 * Get images in base64 format
 */
// base64 encoded images loading tryout
imagesRouter.post('/get/:id', (req, res, next) => {
  console.log(req.params.id);
  
  var data = {
    error: 0,
    data: []
  }
  
  var bitmap = fs.readFileSync('../../images/' + req.params.id);
  // Convert binary data to base64 encoded string
  var img = new Buffer(bitmap).toString('base64');
  data.data.push(img);

  bitmap = fs.readFileSync('../../images/girl.png');
  img = new Buffer(bitmap).toString('base64');
  data.data.push(img);

  bitmap = fs.readFileSync('../../images/oil.png');
  img = new Buffer(bitmap).toString('base64');
  data.data.push(img);
  
  bitmap = fs.readFileSync('../../images/putin.png');
  img = new Buffer(bitmap).toString('base64');
  data.data.push(img);

  bitmap = fs.readFileSync('../../images/us.png');
  img = new Buffer(bitmap).toString('base64');
  data.data.push(img);

  bitmap = fs.readFileSync('../../images/well.png');
  img = new Buffer(bitmap).toString('base64');
  data.data.push(img);

  bitmap = fs.readFileSync('../../images/mugshot.jpg');
  img = new Buffer(bitmap).toString('base64');
  data.data.push(img);
  
  res.status(200).json(data);
});

imagesRouter.post('/register', (req, res, next) => {

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
imagesRouter.post('/login', (req, res, next) => {
  var data = {
    error: 0
  }
  var email = req.body.email;
  var password = req.body.pwd;

  var queryUser = `SELECT * FROM users WHERE email='` + email + `';`;
  var queryFriends = `SELECT first_name, email
                      FROM users
                      WHERE
                        id IN (SELECT friend_id
                            FROM friends
                            WHERE user_id = (SELECT user_id FROM users WHERE email = '` + email + `'));`;

  dbc.getConnection((err, dbc) => {
    if (err) {
      data.error = 1;
      data.data = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query(queryUser + queryFriends, (err, results, fields) => {
        if (err) {
          data.error = 1;
          data.data = 'Error Occured!';
          res.status(400).json(data);
        } else {
          if (results[0].length === 1) {
            if (results[0][0].password === password) {
              data.token = jwt.sign(req.body, process.env.SECRET_KEY, {
                expiresIn: '7d'
              });
              data.user = results[0][0].first_name;

              var arr = [];

              for (var i = 0; i < results[1].length; i++) {
                arr.push({
                  name: results[1][i].first_name,
                  email: results[1][i].email
                });
              }

              data.friends = arr;
              res.status(200).json(data);
            } else {
              data.error = 1;
              data.data = 'Email or password wrong';
              res.status(406).json(data);
            }
          } else {
            data.error = 1;
            data.data = 'Email not found';
            res.status(406).json(data);
          }
        }
      });
      dbc.release();
    }
  });
});

/**
 * Get user friends
 */
imagesRouter.post('/friends', (req, res, next) => {
  var data = {
    error: 0
  }
  var email = req.body.email;

  var queryFriends = `SELECT first_name name, email
                    FROM users
                    WHERE
                      id IN (SELECT friend_id
                          FROM friends
                          WHERE user_id = (SELECT user_id FROM users WHERE email = '` + email + `'));`;

  dbc.getConnection((err, dbc) => {
    if (err) {
      data.error = 1;
      data.data = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query(queryFriends, (err, rows, fields) => {
        if (err) {
          data.error = 1;
          data.data = 'Error Occured!';
          res.status(400).json(data);
        } else {
          data.friends = rows;
          res.status(200).json(data);
        }
      });
      dbc.release();
    }
  });
});

module.exports = imagesRouter;