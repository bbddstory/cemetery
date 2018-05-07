var express = require('express');

var homeRouter = express.Router();
var dbc = require('../database/database');

/**
 * Return a list of latest videos of all categories
 */
homeRouter.post('/latest', function (req, res, next) {
  var data = {
    error: 1,
    data: ''
  }

  var query = `(SELECT * FROM phantom_zone.videos WHERE category='Movies' LIMIT 3)
    UNION
      (SELECT * FROM phantom_zone.videos WHERE category = 'TV' LIMIT 3)
    UNION
      (SELECT * FROM phantom_zone.videos WHERE category = 'Documentaries' LIMIT 3)
    UNION
      (SELECT * FROM phantom_zone.videos WHERE category = 'Animations' LIMIT 3);`;
      
  dbc.getConnection(function (err, dbc) {
    if (err) {
      data['error'] = 1;
      data['data'] = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      
      dbc.query(query, function (err, rows, fields) {
        if (!err) {
          data.error = 0;
          data['data'] = rows;
          res.status(200).json(data);
        } else {
          data['data'] = 'Error Occured!';
          res.status(400).json(data);
        }
      });
      dbc.release();
    }
  });
});

module.exports = homeRouter;