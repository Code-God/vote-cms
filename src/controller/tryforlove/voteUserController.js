const voteUserService = require('../../service/tryforlove/voteUserService');
const votePhotoService = require('../../service/tryforlove/votePhotoService');
const voteIpAdressService = require('../../service/tryforlove/voteIpAdressService');
const wxShareService = require('../../service/tryforlove/wxShareService');
const commonResult = require('../../common/commonResult');
const logger = require('../../../resources/logger/logConfig').logger;

/**
 * 保存用户信息
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function saveUser(req, res) {
  try{
    let param = req.body;
    logger.info("requestParam:",param);
    // 检测当前手机号是否已存在
    await voteUserService.checkUserByContact(param.contact);
    //插入用户基础表
    let user = await voteUserService.saveUser(param);
    //插入用户图片表
    await votePhotoService.savePhoto(param, user);
    await voteUserService.composeImage(param,user);
    // 返回用户信息和图片信息
    let userAndPhoto = await voteUserService.findUserById(user.dataValues.id);
    commonResult.returnSuccess(res,'保存成功', userAndPhoto);
  }catch(e) {
    commonResult.returnFailed(res, e);
  }
}

/**
 * 查询已审核用户信息列表
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function findUserList(req, res) {
  try{
    //获取GET请求参数
    let param = req.query || req.params;
    logger.info("requestParam:", param);
    //查询当前用户ip是否限制
    let ipAdress = await voteIpAdressService.findIpAdressByIp(req);
    //查询用户信息列表
    let userList = await voteUserService.findUserList(ipAdress, param);
    let count = await voteUserService.findUserCount();
    let result = {count: count, userList: userList};
    commonResult.returnSuccess(res,'查询成功', result);
  }catch(e) {
    commonResult.returnFailed(res, e);
  }
}

/**
 * 查询用户详情
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function findUser(req, res) {
  try{
    //获取GET请求参数
    let param = req.query || req.params;
    logger.info("requestParam:",param);
    //查询当前用户ip是否限制
    let ipAdress = await voteIpAdressService.findIpAdressByIp(req);
    //查询用户详情
    let user = await voteUserService.findUser(param, ipAdress);
    commonResult.returnSuccess(res,'查询成功', user);
  }catch(e) {
    commonResult.returnFailed(res, e);
  }
}

/**
 * 上传至阿里云OSS
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function upload(req, res) {
  try{
    //获取POST请求参数
    let param = req.body;
    //上传
    let imageSrc = await voteUserService.upload(param);
    commonResult.returnSuccess(res, '上传成功', imageSrc);
  }catch(e) {
    commonResult.returnFailed(res, e);
  }
}

/**
 * 分享
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function wxShare(req, res) {
  try {
    //获取GET请求参数
    let param = req.query || req.params;
    logger.info("requestParam:", param);
    let result = await wxShareService.getWxConfig(param);
    commonResult.returnSuccess(res, '分享成功', result);
  }catch(e) {
    commonResult.returnFailed(res, e);
  }
}

/**
 * 安全域名微信校验文件
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getMpVerify(req, res) {
  try {
    let data = await wxShareService.getMpVerify();
    res.send(data)
  }catch (e){
    res.send(e);
  }
}

module.exports = {
  saveUser: saveUser,
  findUserList: findUserList,
  findUser: findUser,
  upload: upload,
  wxShare: wxShare,
  getMpVerify: getMpVerify
};
