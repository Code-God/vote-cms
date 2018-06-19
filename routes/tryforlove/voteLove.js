const express = require('express');
const router = express.Router();
const voteUsers = require('../../src/controller/tryforlove/voteUserController');
const voteLuad = require('../../src/controller/tryforlove/voteLaudController');

/**
 * 获取用户信息列表
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.get('/userList', function(req, res) {
  voteUsers.findUserList(req,res);
});

/**
 * 获取用户信息
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.get('/user', function(req, res) {
  voteUsers.findUser(req,res);
});

/**
 * 保存用户信息和图片信息
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.post('/user', function(req, res) {
  voteUsers.saveUser(req,res);
});

/**
 * 点赞
 */
router.post('/laud', function(req, res) {
  voteLuad.laudForUser(req,res);
});

/**
 * 上传图片
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @return {[type]}        [description]
 */
router.post('/upload', function(req, res) {
  voteUsers.upload(req,res);
});

/**
 * 分享
 */
router.get('/wxshare', function(req, res) {
  voteUsers.wxShare(req,res);
});

module.exports = router;
