var express = require('express');

var searchRouter = express.Router();
var dbc = require('../database/database');

/**
 * Load video details by ID
 */
searchRouter.post('/load', (req, res, next) => {
  var data = {
    error: 0
  }
  var query = `SELECT *
    FROM
        phantom_zone.videos
    WHERE
        id='` + req.body.key + `';`;

  dbc.getConnection((err, dbc) => {
    if (err) {
      data.error = 1;
      data.data = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query(query, (err, rows, fields) => {
        if (err) {
          data.error = 1;
          data.data = 'Error occured';
          res.status(400).json(data);
        } else {
          data.details = rows[0];
          res.status(200).json(data);
        }
      });
      dbc.release();
    }
  });
});

module.exports = searchRouter;