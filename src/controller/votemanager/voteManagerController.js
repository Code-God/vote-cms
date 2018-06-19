const tryforloveService = require('../../service/votemanager/tryforloveService');
const userService = require('../../service/votemanager/userService');
const md5 = require("md5");
const voteResult = require('../../common/voteResult');
const logger = require('../../../resources/logger/logConfig').logger;

/**
 * 登录
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function login(req, res) {
  try{
    let param = req.body;
    logger.info("requestParam:", param);
    let password = md5(param.password);
    //查询用户信息列表
    let userList = await userService.findUser(param, password);
    req.session.login = true;
    voteResult.returnSuccess(res,'200','登录成功', userList);
  }catch(e) {
    voteResult.returnFailed(res, e.errCode, e.msg);
  }
}

/**
 * 登出
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function loginOut(req, res) {
  try{
    req.session.login = false;
    voteResult.returnSuccess(res,'200','退出登录', null);
  }catch(e) {
    voteResult.returnFailed(res, e.errCode, e.msg);
  }
}


/**
 * 查询用户信息列表
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function findAllUserList(req, res) {
  try{
    //获取GET请求参数
    let param = req.query || req.params;
    logger.info("requestParam:",param);
    //查询用户信息列表
    let userList = await tryforloveService.findAllUserList(param);
    let userCount = await tryforloveService.findUserCount(param);
    let result = {userCount: userCount, userList: userList};
    voteResult.returnSuccess(res,'200','查询成功', result);
  }catch(e) {
    voteResult.returnFailed(res, e.errCode, e.msg);
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
    //查询用户详情
    let user = await tryforloveService.findUser(param);
    voteResult.returnSuccess(res,'200', '查询成功', user);
  }catch(e) {
    voteResult.returnFailed(res, e.errCode, e.msg);
  }
}

/**
 * 修改用户信息
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function updateUser(req, res) {
  try{
    //获取PUT请求参数
    let param = req.body;
    logger.info("requestParam:",param);
    //查询用户详情
    let user = await tryforloveService.updateUser(param);
    voteResult.returnSuccess(res,'200', '修改用户信息成功', user);
  }catch(e) {
    voteResult.returnFailed(res, e.errCode, e.msg);
  }
}

/**
 * 删除用户信息
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function deleteUser(req, res) {
  try{
    //获取DELETE请求参数
    let param = req.body;
    logger.info("requestParam:",param);
    //查询用户详情
    let user = await tryforloveService.deleteUser(param);
    voteResult.returnSuccess(res,'200', '删除成功', user);
  }catch(e) {
    voteResult.returnFailed(res, e.errCode, e.msg);
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
    logger.info("requestParam:",param);
    //上传
    let imageSrc = await voteUserService.upload(param);
    voteResult.returnSuccess(res, '200', '上传成功', imageSrc);
  }catch(e) {
    voteResult.returnFailed(res, e.errCode, e.msg);
  }
}

module.exports = {
  findAllUserList: findAllUserList,
  findUser: findUser,
  upload: upload,
  updateUser: updateUser,
  login: login,
  loginOut: loginOut,
  deleteUser: deleteUser
};
