const voteUserService = require('../../service/tryforlove/voteUserService');
const voteIpAdressService = require('../../service/tryforlove/voteIpAdressService');
const commonResult = require('../../common/commonResult');
const logger = require('../../../resources/logger/logConfig').logger;

/**
 * 用户投票
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function laudForUser(req, res) {
  try{
    let param = req.body;
    logger.info("requestParam:", param);
    //查询当前用户ip是否限制
    let ipAdress = await voteIpAdressService.findIpAdressByIp(req);
    //用户投票
    await voteUserService.laudForUser(param, ipAdress);
    //记录ip信息
    await voteIpAdressService.saveIpAdress(req);
    //返回用户信息
    let user = await voteUserService.findUserById(param.id);
    user[0].dataValues.status = 1;
    commonResult.returnSuccess(res,'投票成功', user);
  }catch(e) {
    commonResult.returnFailed(res, e);
  }
}

module.exports = {
  laudForUser: laudForUser
};
