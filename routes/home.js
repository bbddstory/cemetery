var express = require('express');

var homeRouter = express.Router();
var dbc = require('../database/database');

/**
 * Get all lists on the home page
 */
homeRouter.post('/latest', (req, res, next) => {
  var data = {
    error: 0
  }

  /**
   * Get the list of latest videos of all categories
   */
  var query = `(SELECT * FROM phantom_zone.videos WHERE category='Movies' LIMIT 3)
    UNION
      (SELECT * FROM phantom_zone.videos WHERE category = 'TV' LIMIT 3)
    UNION
      (SELECT * FROM phantom_zone.videos WHERE category = 'Documentaries' LIMIT 3)
    UNION
      (SELECT * FROM phantom_zone.videos WHERE category = 'Animations' LIMIT 3);`;

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
          data.latest = rows;
          res.status(200).json(data);
        }
      });
      dbc.release();
    }
  })
});

/**
 * Get the watch later list
 */
homeRouter.post('/watch_later', (req, res, next) => {
  var data = {
    error: 0
  }
  var query = `SELECT *
    FROM
      phantom_zone.users u,
      phantom_zone.watch_later w,
      phantom_zone.videos v
    WHERE
      u.id = w.user_id AND w.video_id = v.id AND u.email = '` + req.body.email + `';`;

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
          data.watchLater = rows;
          res.status(200).json(data);
        }
      });
      dbc.release();
    }
  })
});

/**
 * Get the recommendations list
 */
homeRouter.post('/recomm', (req, res, next) => {
  var data = {
    error: 0
  }
  var query = `SELECT *
    FROM
      phantom_zone.users u,
      phantom_zone.recommendations r,
      phantom_zone.videos v
    WHERE
      u.id = r.user_id AND r.video_id = v.id AND u.email = '` + req.body.email + `';`;

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
    default:
      break;
  }
  var query = `DELETE FROM phantom_zone.` + tabName
    + ` WHERE video_id = '` + req.body.key
    + `' AND user_id = (SELECT id FROM phantom_zone.users WHERE email = '` + req.body.email + `')`;

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