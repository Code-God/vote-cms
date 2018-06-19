const UUID = require('uuid');
const fs = require('fs');
const logger = require('../../../resources/logger/logConfig').logger;
const devConfig = require('../../../resources/config/devConfig');
const VoteUser = require('../../entity/voteUser');
const voteUserModel = require('../../model/voteUserModel');
const images = require("images");
const sd = require('silly-datetime');
const utils = require('../../common/commonTool');
const async = require('async');

const endTime = Date.parse(new Date('2018-5-21 00:00:00'));

/**
 * 保存用户信息
 * @param param
 * @returns {Promise<any>}
 */
function saveUser(param) {
  return new Promise(async (resolve, reject) => {
    try{
      //定义voteUser实例
      let voteUser = new VoteUser();
      voteUser.userName = param.userName;
      voteUser.contact = param.contact;
      voteUser.laud = 0;
      voteUser.deleteFlag = 0;
      voteUser.status = 0;
      voteUser.review = 1;
      voteUser.createDate = new Date();
      let users = await voteUserModel.saveUser(voteUser);
      resolve(users);
    }catch(e) {
      reject("保存用户信息失败");
      logger.info("saveUserService: ", e);
    }
  });
}

function syntheticPicture(url,basefilePath) {
  return new Promise((resolve, reject) => {
    let task1 = function (callback) {
      utils.createQr(url, function (err, data) {
        if (err) {
          console.log(err);
          callback(err, null);
          return;
        }
        callback(null, data);
        resolve(data);
      })
    };
    let task2 = function (waterImg, callback) {
      //原图
      utils.addWater(basefilePath, waterImg, function (data) {
        callback(null, data);
      })
    };
    async.waterfall([task1, task2], function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
    });
  })
}

/**
 * 合成图片
 * @param param
 * @param user
 * @returns {Promise<any>}
 */
function composeImage(param, user) {
  return new Promise(async (resolve, reject) => {
    try{
      let fileName = param.photoUrl.split('images/')[1];
      //相片
      let filePath = devConfig.fileConfig.filePath + fileName;
      //相框
      let fileFrame = devConfig.fileConfig.fileFrame + param.photoFrame;
      //新图片
      let filePathNew = devConfig.fileConfig.filePath + UUID.v1() + '.jpg';
      //二维码连接
      let url = 'http://vote.jsure.com/520/details.html?userId=' + user.dataValues.id;
      //父图片地址
      let basefilePath = devConfig.fileConfig.filePath + fileName.split(".")[0] + "_b.png";
      //创建父模板
      images(560, 640).save(basefilePath);
      // 压缩495，495相片
      images(filePath).size(495,495).save(filePathNew);
      // 合成图片
      images(basefilePath).draw(images(filePathNew),35,55).save(basefilePath);
      images(basefilePath).draw(images(fileFrame),0,0).save(basefilePath);
      //二维码
      let codeData = await syntheticPicture(url,basefilePath);
      fs.unlinkSync(filePathNew);// 上传之后删除本地文件
      fs.unlinkSync(codeData);// 上传之后删除本地文件
      logger.info("合成成功");
      resolve(basefilePath)
    }catch(e) {
      reject("合成图片失败");
      logger.info("composeImageService: ", e);
    }
  });
}

/**
 * 查询用户列表信息
 * @param ipAdress
 * @param param
 * @returns {Promise<any>}
 */
function findUserList(ipAdress,param) {
  return new Promise(async (resolve, reject) => {
    try{
      // let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
      let time = new Date().getTime();
      let orderBy = "id";
      // const endTime = Date.parse(new Date('2018-5-21 00:00:00'));
      if(time >= endTime){
          orderBy = 'laud';
      }
      //只查询审核通过的
      let review = 1;
      let users = await voteUserModel.findUserList(review, Number(param.pageIndex), Number(param.pageSize), orderBy);
      if(null != users && null != ipAdress && users.length > 0){
        users = await checkIp(ipAdress, users, true);
      }
      if(users.length === 0){
        reject("无用户列表信息");
      }else {
        resolve(users);
      }
    }catch(e) {
      reject("查询用户列表信息失败");
      logger.info("findUserListService: ", e);
    }
  });
}

/**
 * 查询用户信息总数
 * @returns {Promise<any>}
 */
function findUserCount() {
  return new Promise(async (resolve, reject) => {
    try{
      //只查询审核通过的
      let review = 1;
      let count = voteUserModel.findUserListCount(review);
      resolve(count);
    }catch(e) {
      reject("查询用户列表信息失败");
      logger.info("findUserListService: ", e);
    }
  });
}

/**
 * 为单个用户投票
 * @param param
 * @param ipAdress
 * @returns {Promise<any>}
 */
function laudForUser(param, ipAdress) {
  return new Promise(async (resolve, reject) => {
    try{
      let time = new Date().getTime();
      // const endTime = Date.parse(new Date('2018-5-21 00:00:00'));
      if(time >= endTime){
        reject("此活动已结束，谢谢您的参与!");
      }else {
        let voteUser = new VoteUser();
        voteUser.id = param.id;
        voteUser.review = 1;
        let users = await voteUserModel.findUserById(voteUser);
        if(null != users && null != ipAdress && users.length > 0) {
          users = await checkIp(ipAdress, users, false);
        }
        if(null != users && users.length > 0) {
          //定义voteUser实例
          const voteUser = new VoteUser();
          voteUser.id = param.id;
          voteUser.laud = Number(users[0].dataValues.laud) + 1;
          let user = await voteUserModel.updateUser(voteUser);
          resolve(user);
        }else {
          reject("此用户不存在");
        }
      }
    }catch(e) {
      reject("投票失败或重复投票");
      logger.info("laudForUserService: ", e);
    }
  });
}

/**
 * 获取url请求客户端ip
 * @param req
 * @returns {Promise<any>}
 */
function getClientIp(req) {
  return new Promise((resolve, reject) => {
    try{
      let ip = req.get("X-Real-IP") || req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
      if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
      }
      resolve(ip);
    }catch(e) {
      reject("获取url请求客户端ip失败");
      logger.info("getClientIpService: ", e);
    }
  })
}

/**
 * 查询用户详情
 * @param param
 * @param ipAdress
 * @returns {Promise<any>}
 */
function findUser(param, ipAdress) {
  return new Promise(async (resolve, reject) => {
    try{
      let users;
      let voteUser = new VoteUser();
      voteUser.review = 1;
      if(!isNaN(param.id)) {
        voteUser.id = param.id;
        users = await voteUserModel.findUserById(voteUser);
      }else {
        voteUser.userName = param.id;
        users = await voteUserModel.findUserByName(voteUser);
      }
      if (null != ipAdress && null != users && users.length > 0){
        users = await checkIp(ipAdress, users, true);
      }
      if(users.length === 0){
        reject("无此用户");
      }else {
        resolve(users);
      }
    }catch(e) {
      reject("查询用户详情失败");
      logger.info("findUserService: ", e);
    }
  });
}

/**
 * 上传至阿里云OSS
 * @param param
 * @returns {Promise<any>}
 */
function upload(param) {
  return new Promise((resolve, reject) => {
    let time = new Date().getTime();
    // const endTime = Date.parse(new Date('2018-5-21 00:00:00'));
    if(time >= endTime){
      reject("此活动已结束，谢谢您的参与!");
    }else {
      // 接收前台POST过来的base64图片数据流
      let imgData = param.imgData;
      // 构建图片名
      let fileName = UUID.v1() + '.jpg';
      // 构建图片路径
      let filePath = devConfig.fileConfig.filePath + fileName;
      //过滤data:URL
      let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
      let dataBuffer = new Buffer(base64Data, 'base64');
      fs.writeFile(filePath, dataBuffer, function(err) {
        if(err){
          reject("上传失败");
          logger.info("uploadService: ", err);
        }else {
          images(filePath).save(filePath, {
            quality : 75   //保存图片到文件,图片质量为70
          });
          let filePathSmall = devConfig.fileConfig.filePath + fileName.split(".")[0] + "_s.jpg";
          images(filePath).size(200,200).save(filePathSmall, {
            quality : 20   //保存图片到文件,图片质量为70
          });
          let imageUrl = 'http://vote.jsure.com/vote/images/'+fileName;
          resolve(imageUrl);
        }
      });
    }
  });
}

/**
 * 根据ID查询用户信息
 * @param id
 * @returns {Promise<any>}
 */
function findUserById(id) {
  return new Promise(async (resolve, reject) => {
    try{
      let voteUser = new VoteUser();
      voteUser.id = id;
      voteUser.review = 1;
      let users = await voteUserModel.findUserById(voteUser);
      resolve(users);
    }catch(e) {
      reject("根据ID查询用户信息失败");
      logger.info("findUserByIdService: ", e);
    }
  });
}

/**
 * 根据联系方式查询用户信息
 * @param contact
 * @returns {Promise<any>}
 */
function checkUserByContact(contact) {
  return new Promise(async (resolve, reject) => {
    try{
      let voteUser = new VoteUser();
      voteUser.contact = contact;
      voteUser.review = 1;
      let users = await voteUserModel.findUserByContact(voteUser);
      if(users.length > 0) {
        reject("该手机号已经存在，谢谢您的参与")
      }else{
        resolve(users);
      }
    }catch(e) {
      reject("根据手机号查询用户信息失败");
      logger.info("findUserByIdService: ", e);
    }
  });
}

/**
 * 检测ip
 * @param ipAdress
 * @param users
 * @param check
 * @returns {Promise<any>}
 */
function checkIp(ipAdress, users, check) {
  return new Promise((resolve, reject) => {
    for(let i = 0; i < ipAdress.length; i++){
      for(let j = 0; j < users.length; j++){
        if(ipAdress[i].dataValues.voteUserId === users[j].dataValues.id){
          if(check){
            users[j].dataValues.status = 1;
          }else {
            reject("您已经投过票了");
          }
        }
      }
    }
    resolve(users);
  });
}

module.exports = {
  saveUser: saveUser,
  findUserList: findUserList,
  laudForUser: laudForUser,
  getClientIp: getClientIp,
  findUser: findUser,
  upload: upload,
  findUserById: findUserById,
  findUserCount: findUserCount,
  checkUserByContact: checkUserByContact,
  composeImage: composeImage
};

