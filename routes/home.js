var express = require('express');

var homeRouter = express.Router();
var dbc = require('../database/database');

/**
 * Get all lists on the home page
 */
homeRouter.post('/lists', (req, res, next) => {
  var data = {
    error: 0
  }

  /**
   * Get the latest videos of all categories
   */
  var queryLatest = `(SELECT id,category,eng_title,director,creator,prod,poster FROM videos WHERE category='Movies' LIMIT 3)
    UNION
      (SELECT id,category,eng_title,director,creator,prod,poster FROM videos WHERE category='TV' LIMIT 3)
    UNION
      (SELECT id,category,eng_title,director,creator,prod,poster FROM videos WHERE category='Documentaries' LIMIT 3)
    UNION
      (SELECT id,category,eng_title,director,creator,prod,poster FROM videos WHERE category='Animations' LIMIT 3);`;
  /**
   * Get the watch later list
   */
  var queryWatchLater = `SELECT v.id,v.category,v.eng_title,v.director,v.creator,v.prod,v.poster
    FROM
      users u,
      watch_later w,
      videos v
    WHERE
      u.id=w.user_id AND w.video_id=v.id AND u.email='` + req.body.email + `';`;
  /**
   * Get the recommendations list
   */
  var queryRecomm = `SELECT v.id,v.category,v.eng_title,v.director,v.creator,v.prod,v.poster
    FROM
      users u,
      recommendations r,
      videos v
    WHERE
      u.id=r.user_id AND r.video_id=v.id AND u.email='` + req.body.email + `';`;

  dbc.getConnection((err, dbc) => {
    if (err) {
      data.error = 1;
      data.data = 'Internal Server Error';
      res.status(500).json(data);
    } else {
      dbc.query(queryLatest + queryWatchLater + queryRecomm, (err, results, fields) => {
        if (err) {
          data.error = 1;
          data.data = 'Error occured';
          res.status(400).json(data);
        } else {
          var arr = [], listArr = [];
           
          for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results[i].length; j++) {
              listArr.push(results[i][j])
            }
            arr.push(listArr);
            listArr = [];
          }

          data.data = arr;
          res.status(200).json(data);
        }
      });
      dbc.release();
    }
  })
});

/**
 * Delete items from one of the home lists
 */
homeRouter.post('/del_item', (req, res, next) => {
  var data = {
    error: 0
  }
  var tabName;

  switch (req.body.list) {
    case 'watchLater':
      tabName = 'watch_later';
      break;
    case 'recomm':
      tabName = 'recommendations';
      break;
  }
  var query = `DELETE FROM ` + tabName +
    ` WHERE video_id='` + req.body.key +
    `' AND user_id=(SELECT id FROM users WHERE email='` + req.body.email + `')`;

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
          data.recomm = rows;
          res.status(200).json(data);
        }
      });
      dbc.release();
    }
  })
});

module.exports = homeRouter;