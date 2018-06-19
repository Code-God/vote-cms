const logger = require('../../resources/logger/logConfig').logger;
/**
 * 定义公共返回实体
 * @constructor
 */
function CommonResult() {
  this.success;
  this.status;
  this.message;
  this.data;
}

/**
 * 返回失败
 * @param res
 * @param message
 */
exports.returnFailed = function (res, message) {
  let commonResult = new CommonResult();
  commonResult.success = false;
  commonResult.status = '201';
  commonResult.message = message;
  commonResult.data = null;
  res.send(commonResult);
  logger.info(JSON.stringify(commonResult));
};

/**
 * 返回成功
 * @param res
 * @param msg
 * @param data
 */
exports.returnSuccess = function (res, msg, data) {
  let commonResult = new CommonResult();
  commonResult.success = true;
  commonResult.status = '200';
  commonResult.message = msg;
  if (null != data && "" !== data) {
    commonResult.data = data;
  } else {
    commonResult.data = null;
  }
  res.send(commonResult);
  logger.info(JSON.stringify(commonResult));
};
