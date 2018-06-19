const db = require('../../resources/config/sequelize');
const Sequelize = require('sequelize');

/**
 * 定义IPAdress模型
 * @type {Model}
 */
const User = db.sequelize.define(
  'user',
  {
    id: {field: 'id',primaryKey: true, autoIncrement: true, type: Sequelize.INTEGER},
    userName: {field: 'userName', type: Sequelize.STRING},
    password: {field: 'password', type: Sequelize.INTEGER},
    createDate: {field: 'createDate', type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    status: {field: 'status', type: Sequelize.CHAR}
  },
  {
    tableName: 't_user',
    timestamps: false,
    freezeTableName: true
  }
);

/**
 * 查询用户信息
 * @param param
 * @returns {Promise<any>}
 */
function saveUser(param) {
  return new Promise((resolve, reject) => {
    User.create(param).then(user => {
      resolve(user)
    }).catch(function(err){
      reject("插入数据异常：" + err);
    });
  });

}

/**
 * 查用户信息
 * @param param
 * @returns {Promise<any>}
 */
function findUserByUserName(param) {
  return new Promise((resolve, reject) => {
    User.findAll({
      where: {
        userName: param.userName
      }
    }).then(user => {
      resolve(user)
    }).catch(function(err){
      reject("查询数据异常：" + err);
    });
  });
}

module.exports = {
  saveUser: saveUser,
  findUserByUserName: findUserByUserName
};

