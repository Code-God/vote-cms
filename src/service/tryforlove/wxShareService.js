const wxConfig = require('../../../resources/config/wxConfig');
const NodeCache = require('node-cache');
const request = require('request');
const sha1 = require('sha1');
const fs = require('fs');
const cache = new NodeCache({stdTTL: 3600, checkperiod: 3600});
const logger = require('../../../resources/logger/logConfig').logger;

/**
 * 获取微信签名
 * @param param
 * @returns {Promise<any>}
 */
async function getWxConfig(param) {
  return new Promise(async (resolve, reject) => {
    try {
      // 缓存token
      let access_token = await cache.get('access_token');
      if (!access_token) {
        const url = wxConfig.tokenUrl + wxConfig.appid + '&secret=' + wxConfig.secret;
        logger.info("请求微信服务器-acces_token: ", url);
        access_token = await getAccessToken(url);
      }
      // 缓存ticket
      let ticket = await cache.get('ticket');
      if (!ticket) {
        const url = wxConfig.ticketUrl + access_token + '&type=jsapi';
        logger.info("请求微信服务器-titcket: ", url);
        ticket = await getTicket(url);
      }
      //签名算法
      const nonce_str = wxConfig.nonce_str; // 密钥，字符串任意，可以随机生成
      let timestamp = parseInt(new Date().getTime() / 1000); //时间戳
      const url = param.url; // 使用接口的url链接，不包含#后的内容
      // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
      const str = 'jsapi_ticket=' + ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + url;
      // 加密
      const signature = sha1(str);
      let result = {
          appId: wxConfig.appid,
          timestamp: timestamp,
          nonceStr: nonce_str,
          signature: signature,
      };
      resolve(result);
    }catch(e) {
      reject(e);
      logger.info("getWxConfigService: ", e);
    }
  });
}

/**
 * 获取access_token
 * @param url
 * @returns {Promise<any>}
 */
function getAccessToken(url) {
  return new Promise(async (resolve, reject) => {
    request(url,async (err, res, body) => {
        if (!err && res.statusCode === 200) {
          access_token = JSON.parse(body).access_token;
          await cache.set('access_token',access_token);
          resolve(access_token);
          logger.info('获取access_token成功',access_token);
        }else {
          reject("获取access_token失败");
          logger.info('获取access_token失败', err);
        }
      }
    );
  });
}

/**
 * 获取ticket
 * @param url
 * @returns {Promise<any>}
 */
function getTicket(url) {
  return new Promise(async (resolve, reject) => {
    request(url, async (err, res, body) => {
      if (!err && res.statusCode === 200) {
        ticket =  JSON.parse(body).ticket;
        console.log(JSON.parse(body));
        await cache.set('ticket',ticket);
        resolve(ticket);
        logger.info('获取ticket成功', ticket);
      }else {
        reject("获取ticket失败");
        logger.info('获取ticket失败', err);
      }
    })
  });
}

/**
 * 读取微信域名校验文件
 * @returns {Promise<any>}
 */
function getMpVerify() {
  return new Promise(async (resolve, reject) => {
    fs.readFile(wxConfig.filePath, function(err, data) {
      // 读取文件失败/错误
      if (err) {
        reject(err);
      }
      logger.info("微信校验文件: ", data.toString());
      // 读取文件成功
      resolve(data.toString());
    });
  })
}

module.exports = {
  getWxConfig: getWxConfig,
  getMpVerify: getMpVerify
};
