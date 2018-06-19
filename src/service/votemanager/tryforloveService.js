const logger = require('../../../resources/logger/logConfig').logger;
const VoteUser = require('../../entity/voteUser');
const voteUserModel = require('../../model/voteUserModel');

/**
 * 修改资料
 * @param param
 * @returns {Promise<any>}
 */
function updateUser(param) {
  return new Promise(async (resolve, reject) => {
    try{
      let voteUser = new VoteUser();
      voteUser.id = param.id;
      voteUser.review = param.review;
      voteUser.contact = param.contact;
      voteUser.userName = param.userName;
      voteUser.laud = param.laud;
      let newUser = await voteUserModel.updateUser(voteUser);
      resolve(newUser);
    }catch(e) {
      reject({errCode:"201", mgs: "修改资料失败"});
      logger.info("updateUserService: ", e);
    }
  });
}

/**
 * 查询用户信息
 * @param param
 * @returns {Promise<any>}
 */
function findUser(param) {
  return new Promise(async (resolve, reject) => {
    try{
      let voteUser = new VoteUser();
      voteUser.id = param.id;
      voteUser.review = param.review;
      let user = await voteUserModel.findUserById(voteUser);
      resolve(user);
    }catch(e) {
      reject({errCode:"201", mgs:"查询用户信息失败"});
      logger.info("findUserService: ", e);
    }
  });
}

/**
 * 查询所有用户列表信息
 * @param param
 * @returns {Promise<any>}
 */
function findAllUserList(param) {
  return new Promise(async (resolve, reject) => {
    try{
      let voteUser = new VoteUser();
      if("0" !== param.review){
        voteUser.review = param.review;
      }
      voteUser.contact = param.contact;
      voteUser.userName = param.userName;
      voteUser.startDate = param.startDate;
      voteUser.endDate = param.endDate;
      voteUser.pageIndex = param.pageIndex;
      voteUser.pageSize = param.pageSize;
      let users = await voteUserModel.findAllUserList(voteUser,param.order,param.orderBy);
      resolve(users);
    }catch(e) {
      reject({errCode:"201", mgs:"查询用户列表信息失败"});
      logger.info("findAllUserListService: ", e);
    }
  });
}

/**
 * 查询所有用户信息总数
 * @returns {Promise<any>}
 */
function findUserCount(param) {
  return new Promise(async (resolve, reject) => {
    try{
      let voteUser = new VoteUser();
      if("0" !== param.review){
        voteUser.review = param.review;
      }
      voteUser.contact = param.contact;
      voteUser.userName = param.userName;
      voteUser.startDate = param.startDate;
      voteUser.endDate = param.endDate;
      let count = voteUserModel.findUserCount(voteUser);
      resolve(count);
    }catch(e) {
      reject({errCode:"201", mgs:"查询用户列表信息失败"});
      logger.info("findUserCountService: ", e);
    }
  });
}

/**
 * 删除用户
 * @param param
 * @returns {Promise<any>}
 */
function deleteUser(param) {
  return new Promise(async (resolve, reject) => {
    try{
      let voteUser = new VoteUser();
      voteUser.id = param.id;
      voteUser.deleteFlag = 1;
      let newUser = await voteUserModel.updateUser(voteUser);
      resolve(newUser);
    }catch(e) {
      reject({errCode:"201", mgs: "删除失败"});
      logger.info("deleteUserService: ", e);
    }
  });
}

module.exports = {
  findUser: findUser,
  findAllUserList: findAllUserList,
  updateUser: updateUser,
  findUserCount: findUserCount,
  deleteUser: deleteUser
};
