var express = require('express');

var searchRouter = express.Router();
var dbc = require('../database/database');

/**
 * Search videos according to category
 */
searchRouter.post('/', (req, res, next) => {
  var data = {
    error: 0
  }
  var query_fuzzy = `SELECT *
    FROM
        phantom_zone.videos
    WHERE
        UPPER(eng_title) LIKE UPPER('%` + req.body.key + `%')
            OR UPPER(orig_title) LIKE UPPER('%` + req.body.key + `%');`;
  var query_exact = `
    (SELECT * FROM phantom_zone.videos WHERE 
        UPPER(eng_title) LIKE UPPER('% ` + req.body.key + ` %')
            OR UPPER(orig_title) LIKE UPPER('% ` + req.body.key + ` %'))
    UNION
    (SELECT * FROM phantom_zone.videos WHERE
        UPPER(eng_title) LIKE UPPER('` + req.body.key + ` %')
            OR UPPER(orig_title) LIKE UPPER('` + req.body.key + ` %'))
    UNION
    (SELECT * FROM phantom_zone.videos WHERE
        UPPER(eng_title) LIKE UPPER('% ` + req.body.key + `')
            OR UPPER(orig_title) LIKE UPPER('% ` + req.body.key + `'));`;

  dbc.getConnection((err, dbc) => {
    if (err) {
      data.error = 1;
      data.data = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query(req.body.type ? query_exact : query_fuzzy, (err, rows, fields) => {
        if (err) {
          data.error = 1;
          data.data = 'Error occured';
          res.status(400).json(data);
        } else {
          data.results = rows;
          res.status(200).json(data);
        }
      });
      dbc.release();
    }
  });
});

module.exports = searchRouter;