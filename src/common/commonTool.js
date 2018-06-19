const utils = {};
const fs = require('fs');
const qr = require('qr-image');
const images = require("images");
const UUID = require('uuid');
const devConfig = require('../../resources/config/devConfig');

/**
 * 根据地址生成二维码
 * 参数 url(string) 地址
 * 参数 callback(Function)
 */
utils.createQr = function(url, callback){
  let qr_png = qr.image(url, { type: 'png',size : 2 });
  let imgName = devConfig.fileConfig.filePath + UUID.v1();
  imgName = `${imgName}.png`;
  let qr_pipe = qr_png.pipe(fs.createWriteStream(imgName));
  qr_pipe.on('error', function(err){
    callback(err,null);
    return;
  });
  qr_pipe.on('finish', function(){
    callback(null,imgName);
  })
};

/**
 * 给图片添加水印
 * 参数 sourceImg(string) 原图片路径
 * 参数 waterImg(string) 水印图片路径
 * 参数 callback(Function)
 */
utils.addWater = function(sourceImg, waterImg, callback){
  //等比缩放80*80像素
  images(waterImg).size(80, 80).save(waterImg);
  //水印
  images(sourceImg).draw(images(waterImg), 463, 557).save(sourceImg);
  callback(sourceImg);
};

module.exports = utils;
