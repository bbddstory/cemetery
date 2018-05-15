var express = require('express');

var videosRouter = express.Router();
var dbc = require('../database/database');

/**
 * Load videos of a specified category, paginate the data
 */
videosRouter.post('/load_cat', (req, res, next) => {
  var data = {
    error: 0
  }
  var cat = req.body.category;
  var ipp = req.body.ipp;
  var queryCnt = `SELECT COUNT(*) cnt FROM videos WHERE category='` + cat + `';`
  var queryPage = `SELECT id,category,eng_title,director,creator,prod,poster FROM videos WHERE category='` + cat
    + `' ORDER BY year asc LIMIT ` + ipp * (req.body.currPage - 1) + `,` + ipp + `;`

  dbc.getConnection((err, dbc) => {
    if (err) {
      data.error = 1;
      data.data = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query(queryCnt + queryPage, (err, results, fields) => {
        if (err) {
          data.data = 'Error occured';
          res.status(400).json(data);
        } else {
          data.cnt = results[0][0].cnt;
          data.data = results[1];
          res.status(200).json(data);
        }
      });
      dbc.release();
    }
  });
});

/**
 * Add a new video
 */
videosRouter.post('/add', (req, res, next) => {
  var data = {
    error: 0
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

  dbc.getConnection((err, dbc) => {
    if (err) {
      data.error = 1;
      data.data = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query(`INSERT INTO videos SET ? `, videoData, (err, rows, fields) => {
        if (err) {
          data.data = 'Error occured';
          res.status(400).json(data);
        } else {
          data.data = 'Added';
          res.status(201).json(data);
        }
      });
      dbc.release();
    }
  });
});

module.exports = videosRouter;