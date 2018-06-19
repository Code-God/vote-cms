const db = require('../../resources/config/sequelize');
const Sequelize = require('sequelize');
const photo = require('./votePhotoModel');
const Op = Sequelize.Op;

/**
 * 定义USER模型
 * @type {Model}
 */
const User = db.sequelize.define(
  'voteUser',
  {
    id: {field: 'id',primaryKey: true, autoIncrement: true, type: Sequelize.INTEGER},
    userName: {field: 'userName', type: Sequelize.STRING},
    contact: {field: 'contact', type: Sequelize.STRING},
    laud: {field: 'laud', type: Sequelize.INTEGER},
    createDate: {field: 'createDate', type: Sequelize.DATE},
    deleteFlag: {field: 'deleteFlag', type: Sequelize.CHAR},
    status: {field: 'status', type: Sequelize.CHAR},
    review: {field: 'review', type: Sequelize.CHAR}
  },
  {
    tableName: 'vote_user',
    timestamps: false,
    freezeTableName: true
  }
);
User.belongsTo(photo.Photo,{foreignKey:'id',targetKey: 'voteUserId'});

/**
 * 保存用户信息
 * @param param
 * @returns {Promise<any>}
 */
function saveUser(param) {
  return new Promise((resolve, reject) => {
    User.create(param).then(users => {
        resolve(users);
    }).catch(function(err){
      reject("插入数据异常：" + err);
    });
  });
}

/**
 * 查询已审核用户列表信息
 * @param review
 * @param pageIndex
 * @param pageSize
 * @param orderBy
 * @returns {Promise<any>}
 */
function findUserList(review, pageIndex, pageSize, orderBy) {
  return new Promise((resolve, reject) => {
    User.findAll({
      where:{
        review: review,
        deleteFlag: 0
      },
      include:{model:photo.Photo},
      offset: (pageIndex-1)*pageSize, limit: pageSize,
      order: [[orderBy, 'desc']]
    }
  ).then(users => {
      resolve(users);
    }).catch(function(err){
      reject("查询数据异常：" + err);
    });
  });
}

/**
 * 查询已审核用户列表总数
 * @param review
 * @returns {Promise<any>}
 */
function findUserListCount(review) {
  return new Promise((resolve, reject) => {
    User.count({
        where:{
          review: review,
          deleteFlag: 0
        },
        include:{model:photo.Photo},
    }).then(users => {
      resolve(users);
    }).catch(function(err){
      reject("查询数据异常：" + err);
    });
  });
}

/**
 * 根据id查询用户信息
 * @param voteUser
 * @returns {Promise<any>}
 */
function findUserById(voteUser) {
  return new Promise((resolve, reject) => {
    User.findAll({
        where:{
          id: voteUser.id,
          review: voteUser.review,
          deleteFlag: 0
        },
        include:{ model: photo.Photo }
    }).then(user => {
      resolve(user);
    }).catch(function(err){
      reject("查询数据异常：" + err);
    });
  });
}

/**
 * 根据用户名查询用户信息
 * @param voteUser
 * @returns {Promise<any>}
 */
function findUserByName(voteUser) {
  return new Promise((resolve, reject) => {
    User.findAll({
      where:{
        userName: {
          [Op.like]: '%'+voteUser.userName+'%',
        },
        review: voteUser.review,
        deleteFlag: 0
      },
      include:{ model: photo.Photo },
      order: [['laud', 'DESC']]
    }).then(users => {
      resolve(users)
    }).catch(function(err){
      reject("查询数据异常：" + err);
    });
  });
}

/**
 * 根据联系方式查询用户信息
 * @param voteUser
 * @returns {Promise<any>}
 */
function findUserByContact(voteUser) {
  return new Promise((resolve, reject) => {
    User.findAll({
      where:{
        contact: voteUser.contact,
        review: voteUser.review,
        deleteFlag: 0
      },
      include:{ model: photo.Photo }
    }).then(user => {
      resolve(user);
    }).catch(function(err){
      reject("查询数据异常：" + err);
    });
  });
}

/**
 * 修改用户信息
 * @param param
 * @returns {Promise<any>}
 */
function updateUser(param) {
  return new Promise((resolve, reject) => {
    User.update(param, {
      where: {
        id: param.id
      }
    }).then(users => {
      resolve(users);
    }).catch(function(err){
      reject("修改数据异常：" + err);
    });
  })
}

/**
 * 查询所有用户列表信息
 * @param voteUser
 * @param oderParam
 * @param sign
 * @returns {Promise<any>}
 */
function findAllUserList(voteUser,oderParam,sign) {
  return new Promise( async (resolve, reject) => {
    let sql = 'SELECT vu.id,vu.userName,vu.contact,vu.laud,vu.createDate,vu.review,vu.deleteFlag,' +
      'vp.photoUrl,vp.photoFrame FROM vote_user vu left join vote_photo vp on vu.id=vp.voteUserId where 1=1';
    if(voteUser.review !== undefined) {
      sql += ' AND vu.review = ' + voteUser.review;
    }
    if(voteUser.contact !== undefined) {
      sql += ' AND vu.contact = ' + "'" + voteUser.contact + "'";
    }
    if(voteUser.userName !== undefined) {
      sql += ' AND vu.userName LIKE ' + "'%" + voteUser.userName + "%'";
    }
    if(voteUser.startDate !== undefined) {
      sql += ' AND vu.createDate > ' + "'" + voteUser.startDate + "'";
    }
    if(voteUser.endDate !== undefined) {
      sql += ' AND vu.createDate < ' + "'" + voteUser.endDate + "'";
    }
    sql += ' AND vu.deleteFlag = 0 ';
    sql = await oderBy(sql,oderParam,sign);

    if(voteUser.pageIndex !== undefined && voteUser.pageSize !== undefined) {
      sql += ' limit ' + (voteUser.pageIndex-1)*voteUser.pageSize + ',' + voteUser.pageSize;
    }
    db.sequelize.query(sql).then(userList => {
      resolve(userList[0]);
    }).catch(function(err){
      reject("查询数据异常：" + err);
    });
  });
}

function oderBy(sql,oderParam,sign) {
  return new Promise((resolve, reject) => {
    if(oderParam === 'id' ) {
      sql += ' ORDER BY vu.id ' + sign;
    }
    if(oderParam === 'userName') {
      sql += ' ORDER BY vu.userName ' + sign;
    }
    if(oderParam === 'createDate') {
      sql += ' ORDER BY vu.createDate ' + sign;
    }
    if(oderParam === 'laud') {
      sql += ' ORDER BY vu.laud ' + sign;
    }
    if(oderParam === undefined) {
      sql += ' ORDER BY vu.createDate desc ';
    }
    resolve(sql)
  });
}
/**
 * 查询所有用户列表总数
 * @returns {Promise<any>}
 */
function findUserCount(voteUser) {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT count(vu.id) as count , SUM(laud) as laudSum FROM vote_user vu left join vote_photo vp on vu.id=vp.voteUserId where 1=1';
    if(voteUser.review !== undefined) {
      sql += ' AND vu.review = ' + voteUser.review;
    }
    if(voteUser.contact !== undefined) {
      sql += ' AND vu.contact = ' + "'" + voteUser.contact + "'";
    }
    if(voteUser.userName !== undefined) {
      sql += ' AND vu.userName LIKE ' + "'%" + voteUser.userName + "%'";
    }
    if(voteUser.startDate !== undefined) {
      sql += ' AND vu.createDate > ' + "'" + voteUser.startDate + "'";
    }
    if(voteUser.endDate !== undefined) {
      sql += ' AND vu.createDate < ' + "'" + voteUser.endDate + "'";
    }
    sql += ' AND vu.deleteFlag = 0 ';
    db.sequelize.query(sql).then(count => {
      if(count.length > 0 && count[0].length > 0){
        resolve(count[0][0]);
      }else {
        resolve(0);
      }
    }).catch(function(err){
      reject("查询数据异常：" + err);
    });
  });
}

module.exports = {
  saveUser: saveUser,
  findUserList: findUserList,
  updateUser:updateUser,
  findUserById: findUserById,
  findUserByName: findUserByName,
  findAllUserList:　findAllUserList,
  findUserListCount: findUserListCount,
  findUserByContact: findUserByContact,
  findUserCount: findUserCount
};

