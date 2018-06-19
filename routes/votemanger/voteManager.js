const express = require('express');
const router = express.Router();
const voteManager = require('../../src/controller/votemanager/voteManagerController');


/**
 * 修改用户信息
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.post('/loginOut', function(req, res) {
  voteManager.loginOut(req,res);
});

/**
 * 登录
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.post('/login', function(req, res) {
  voteManager.login(req,res);
});

/**
 * 获取用户信息列表
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.get('/userList', function(req, res) {
  voteManager.findAllUserList(req,res);
});

/**
 * 获取用户信息
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.get('/user', function(req, res) {
  voteManager.findUser(req,res);
});

/**
 * 修改用户信息
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.put('/user', function(req, res) {
  voteManager.updateUser(req,res);
});

/**
 * 删除用户信息
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.delete('/user', function(req, res) {
  voteManager.deleteUser(req,res);
});

/**
 * 上传图片
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.post('/upload', function(req, res) {
  voteManager.upload(req,res);
});


module.exports = router;
