const db = require('../../resources/config/sequelize');
const Sequelize = require('sequelize');

/**
 * 定义IPAdress模型
 * @type {Model}
 */
const IPAdress = db.sequelize.define(
  'ipAdress',
  {
    id: {field: 'id',primaryKey: true, autoIncrement: true, type: Sequelize.INTEGER},
    ipAdress: {field: 'ipAdress', type: Sequelize.STRING},
    voteUserId: {field: 'voteUserId', type: Sequelize.INTEGER},
    createDate: {field: 'createDate', type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    deleteFlag: {field: 'deleteFlag', type: Sequelize.CHAR}
  },
  {
    tableName: 'vote_ipadress',
    timestamps: false,
    freezeTableName: true
  }
);

/**
 * 保存IP地址信息
 * @param param
 * @returns {Promise<any>}
 */
function saveIPAdress(param) {
  return new Promise((resolve, reject) => {
    IPAdress.create(param).then(ipAdress => {
      resolve(ipAdress)
    }).catch(function(err){
      reject("插入数据异常：" + err);
    });
  });

}

/**
 * 根据Ip查用户信息
 * @param param
 * @returns {Promise<any>}
 */
function findIpAdressByIp(param) {
  return new Promise((resolve, reject) => {
    IPAdress.findAll({
      where: {
        ipAdress: param.ipAdress
      }
    }).then(ipAdress => {
      resolve(ipAdress)
    }).catch(function(err){
      reject("查询数据异常：" + err);
    });
  });
}

module.exports = {
  IPAdress: IPAdress,
  saveIPAdress: saveIPAdress,
  findIpAdressByIp: findIpAdressByIp
};

