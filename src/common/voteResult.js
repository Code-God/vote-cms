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
 * @param code
 * @param message
 */
exports.returnFailed = function (res, code, message) {
  let commonResult = new CommonResult();
  commonResult.success = false;
  commonResult.status = code;
  commonResult.message = message;
  commonResult.data = null;
  res.send(commonResult);
  logger.info(JSON.stringify(commonResult));
};

/**
 * 返回成功
 * @param res
 * @param code
 * @param msg
 * @param data
 */
exports.returnSuccess = function (res, code, msg, data) {
  let commonResult = new CommonResult();
  commonResult.success = true;
  commonResult.status = code;
  commonResult.message = msg;
  if (null != data && "" !== data) {
    commonResult.data = data;
  } else {
    commonResult.data = null;
  }
  res.send(commonResult);
  logger.info(JSON.stringify(commonResult));
};
