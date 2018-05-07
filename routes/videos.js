var express = require('express');

var videosRouter = express.Router();
var dbc = require('../database/database');

/**
 * Add a new video
 */
videosRouter.post('/add', function (req, res, next) {
  var data = {
    error: 1,
    data: ''
  }
  var videoData = {
    'id': new Date(),
    'eng_title': req.body.engTitle,
    'orig_title': req.body.origTitle,
    'year': req.body.year,
    'runtime': req.body.runtime,
    'stars': req.body.stars,
    'director': req.body.director,
    'creator': req.body.creator,
    'plot': req.body.plot,
    'imdb': req.body.imdb,
    'rating': req.body.rating,
    'douban': req.body.douban,
    'mtime': req.body.mtime,
    'trailer': req.body.trailer,
    'featurette': req.body.featurette,
    'status': req.body.status,
    'category': req.body.category,
    'poster': req.body.poster,
    'subtitle': req.body.subtitle
  }

  dbc.getConnection(function (err, dbc) {
    if (err) {
      data['error'] = 1;
      data['data'] = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query('INSERT INTO `phantom_zone`.`videos` SET ? ', videoData, function (err, rows, fields) {
        if (!err) {
          data.error = 0;
          data['data'] = 'User registered successfully!';
          res.status(201).json(data);
        } else {
          data['data'] = 'Error Occured!';
          res.status(400).json(data);
        }
      });
      dbc.release();
    }
  });
});

module.exports = videosRouter;