const db = require('../../resources/config/sequelize');
const Sequelize = require('sequelize');

/**
 * 定义Photo模型
 * @type {Model}
 */
const Photo = db.sequelize.define(
  'votePhoto',
  {
    id: {field: 'id',primaryKey: true, autoIncrement: true, type: Sequelize.INTEGER},
    voteUserId: {field: 'voteUserId', type: Sequelize.INTEGER},
    photoUrl: {field: 'photoUrl', type: Sequelize.STRING},
    photoFrame: {field: 'photoFrame', type: Sequelize.STRING},
    createDate: {field: 'createDate', type: Sequelize.DATE, defaultValue: Sequelize.NOW},
    deleteFlag: {field: 'deleteFlag', type: Sequelize.CHAR}
  },
  {
    tableName: 'vote_photo',
    timestamps: false,
    freezeTableName: true
  }
);

/**
 * 保存图片信息
 * @param param
 * @returns {Promise<any>}
 */
function savePhoto(param) {
  return new Promise((resolve, reject) => {
    Photo.create(param).then(photos => {
      resolve(photos)
    }).catch(function(err){
      reject("插入数据异常：" + err);
    });
  });

}

module.exports = {
  Photo: Photo,
  savePhoto: savePhoto
};

