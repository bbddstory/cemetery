var express = require('express');
var imagesRouter = express.Router();
// var jwt = require('jsonwebtoken');
// var dbc = require('../database/database');
var fs = require('fs');
var formidable = require('formidable');
// const sharp = require('sharp');
// var aes = require("crypto-js/AES");
var crypto = require("crypto-js");

imagesRouter.post('/upload', (req, res, next) => {
  // console.log('1. /upload');

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    // console.log('2. File uploaded');

    var srcPath = files.imageupload.path;
    var destPath = '../../images/' + files.imageupload.name;

    console.log(files.imageupload.name);
    
    var key = crypto.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
    var iv = crypto.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

    var cipherTxt = crypto.AES.encrypt(files.imageupload.name, key,
      {
        iv: iv,
        // mode: crypto.mode.ECB,
        // padding: crypto.pad.NoPadding
      }).toString().replace(/\//gi, '');

    console.log(cipherTxt);

    // console.log('srcPath:', srcPath);
    // console.log('destPath:', destPath);

    fs.copyFile(srcPath, destPath, function (err) {
      if(err) {
        res.type('json').sendStatus(500);
        throw err;
      } else {
        // Generate reduced version
        // sharp(oldpath)
        //   .resize(450, null)
        //   .jpeg({
        //     quality: 90,
        //     progressive: true
        //   })
        //   .toFile(newpath, (err, info) => {
        //     console.log(err);
        //     console.log(info);
        //   }).toBuffer();
  
        // Generate thumbnail
        // sharp(oldpath)
        //   .resize(120, null)
        //   .jpeg({
        //     quality: 90,
        //     progressive: true
        //   })
        //   .toFile(newthumb, (err, info) => {
        //     console.log(err);
        //     console.log(info);
        //   }).toBuffer();
  
        // console.log('3. File copied');
        res.type('json').sendStatus(200);
      }
    });
  });
});

/**
 * Get images in base64 format
 */
// base64 encoded images loading tryout
imagesRouter.post('/get/:id', (req, res, next) => {
  // console.log(req.params.id);

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

module.exports = imagesRouter;