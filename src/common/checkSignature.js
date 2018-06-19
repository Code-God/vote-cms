module.exports = {
  checkSignature: async function checkSignature(params,token) {
    const key = [token, params.timestamp, params.nonce].sort().join('');
    //将token （自己设置的） 、timestamp（时间戳）、nonce（随机数）三个参数进行字典排序
    const sha1 = require("crypto").createHash('sha1');
    //将上面三个字符串拼接成一个字符串再进行sha1加密
    sha1.update(key);
    return sha1.digest("hex") === params.signature;
    //将加密后的字符串与signature进行对比，若成功，返回echostr
  }
};
