const OSS = require('ali-oss');
/**
 * [mysql description]
 * @type {Object}
 */
const mysql = {
  host: '47.98.140.45',
  user: 'test',
  password: 'jsure@123',
  database: 'vote',
  port: '3306',
  dialect: 'mysql'
};
/**
 * OSS配置
 * @type {Client}
 */
const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAIaKFH8NmOXqEK',
  accessKeySecret: 'YNBFMG1uvtghcMnXzIR40ySYZIMYHZ'
});
const ali_oss = {
  bucket: 'jsure-vote',
  endPoint: 'oss-cn-hangzhou.aliyuncs.com',
};

const fileConfig = {
  filePath: '/data/wwwroot/520/images/',
  fileFrame: '/data/wwwroot/520/vote-web/'
};

const secretOrPrivateKey = {
  secret: '3d161fe6166da38626bdau3jjfknskqey2886d7821a6b1d78'
};
exports.mysql = mysql;
exports.client = client;
exports.ali_oss = ali_oss;
exports.fileConfig = fileConfig;
exports.secretOrPrivateKey = secretOrPrivateKey;
