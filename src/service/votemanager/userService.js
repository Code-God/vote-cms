const logger = require('../../../resources/logger/logConfig').logger;
const devConfig = require('../../../resources/config/devConfig');
const User = require('../../entity/User');
const userModel = require('../../model/userModel');
const jwt = require("jsonwebtoken");

/**
 * 登陆
 * @param param
 * @param password
 * @returns {Promise<any>}
 */
function findUser(param, password) {
  return new Promise(async (resolve, reject) => {
    try{
      let user = new User();
      user.userName = param.username;
      let users = await userModel.findUserByUserName(user);
      if(null === users || users.length === 0) {
        reject({errCode:'302',msg: "用户名错误"});
      }else if (users[0].dataValues.password !== password){
        reject({errCode:'303',msg: "密码错误"});
      }else {
        //生成 token
        let payload = users[0].toJSON();
        let token = jwt.sign(payload, devConfig.secretOrPrivateKey.secret, {
          'expiresIn': 60 * 60 * 24 * 3 // 设置过期时间3天
        });
        logger.info("生成token: ", token);
        resolve({voteToken: token});
      }
    }catch(e) {
      reject("查询用户信息失败");
      logger.info("findUserService: ", e);
    }
  });
}

module.exports = {
  findUser: findUser
};
