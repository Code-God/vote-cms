const VotePhoto = require('../../entity/votePhoto');
const logger = require('../../../resources/logger/logConfig').logger;
const votePhotoModel = require('../../model/votePhotoModel');

/**
 * 保存图片信息
 * @param param
 * @param user
 * @returns {Promise<any>}
 */
function savePhoto(param, user) {
  return new Promise(async (resolve, reject) => {
    try{
      //定义votePhoto实例
      let votePhoto = new VotePhoto();
      votePhoto.voteUserId = user.dataValues.id;
      votePhoto.photoUrl = param.photoUrl;
      votePhoto.photoFrame = param.photoFrame;
      votePhoto.deleteFlag = 0;
      let photo = await votePhotoModel.savePhoto(votePhoto);
      resolve(photo);
    }catch(e) {
      reject("保存图片失败");
      logger.info("savePhotoService: ", e);
    }
  });
}

module.exports = {
  savePhoto: savePhoto
};

