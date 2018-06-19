const VoteIPAdress = require('../../entity/voteIPAdress');
const logger = require('../../../resources/logger/logConfig').logger;
const voteIPAdressModel = require('../../model/voteIPAdressModel');
const voteUserService = require('./voteUserService');

/**
 * 当前ip对应的用户信息
 * @param req
 * @returns {Promise<any>}
 */
function findIpAdressByIp(req) {
  return new Promise(async (resolve, reject) => {
    try{
      let voteIpAdress = new VoteIPAdress();
      let ip = await voteUserService.getClientIp(req);
      voteIpAdress.ipAdress = ip;
      let ipAdress = await voteIPAdressModel.findIpAdressByIp(voteIpAdress);
      resolve(ipAdress);
    }catch(e) {
      reject("查询当前ip对应的用户信息失败");
      logger.info("findIpAdressByIpService: ", e);
    }
  });
}

/**
 *  保存iP信息
 * @param req
 * @returns {Promise<any>}
 */
function saveIpAdress(req) {
  return new Promise(async (resolve, reject) => {
    try{
      //定义voteIPAdress实例
      const voteIPAdress = new VoteIPAdress();
      let ip = await voteUserService.getClientIp(req);
      voteIPAdress.ipAdress = ip;
      voteIPAdress.voteUserId = req.body.id;
      voteIPAdress.deleteFlag = 0;
      let ipAdress = await voteIPAdressModel.saveIPAdress(voteIPAdress);
      resolve(ipAdress);
    }catch(e) {
      reject("保存ip信息失败");
      logger.info("saveIpAdressService: ", e);
    }
  });
}


module.exports = {
  findIpAdressByIp: findIpAdressByIp,
  saveIpAdress: saveIpAdress
};

