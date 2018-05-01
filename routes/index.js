var express = require('express');
var router = express.Router();

var mysql = mysql || require('mysql');
var connection = connection || mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: 'root',
  database: 'phantom_zone'
});

const RESULT = {
  foo: 'bar'
}
const test_str = 'foobar123';

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('content-type', 'application/json');
  next();
});

/* GET home page. */
router.get('/exptest', function(req, res, next) {
  let sqlResult;
  // res.render('index', { title: 'Express123' });

  // console.log(JSON.stringify(RESULT));
  // connection.connect();

  // connection.query('SELECT * FROM videos;', function (err, rows, fields) {
  //   if (err) throw err;
  //   console.log(rows)
  // })
  let query = "INSERT INTO `phantom_zone`.`videos`(`id`,`eng_title`,`orig_title`,`year`,`runtime`,`stars`,`director`,`creator`,`plot`,`imdb`,`rating`,`douban`,`mtime`,`trailer`,`featurette`,`status`,`category`,`poster`,`subtitle`)"
    + " VALUES(" + new Date().getTime() + ","
    + "'Counterpart',"
    + "'N/A',"
    + "2017,"
    + "'1h',"
    + "'J.K. Simmons, Harry Lloyd, Olivia Williams',"
    + "'N/A','Justin Marks',"
    + "'A UN employee discovers the agency he works for is hiding a gateway to a parallel dimension.',"
    + "'tt4643084',8.2,'26474254','224002',"
    + "'https://www.youtube.com/embed/c3Bu2DOM66g?rel=0&amp;showinfo=0',"
    + "'https://www.youtube.com/embed/mwqKdd7PNAA?rel=0&amp;showinfo=0',"
    + "1,'TV',"
    + "'https://ia.media-imdb.com/images/M/MV5BMTcwNTM3OTQ4OV5BMl5BanBnXkFtZTgwMjgxMjEzNDM@._V1_UX182_CR0,0,182,268_AL_.jpg',"
    + "'N/A');";

  console.log(query);
  
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows)
  })

  // connection.end()

  res.send(JSON.stringify(RESULT));
  // res.send(test_str);
});

module.exports = router;
