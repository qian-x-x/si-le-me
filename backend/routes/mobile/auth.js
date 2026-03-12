/**
 * 移动端认证路由
 * 死了么小程序C端 - 微信登录
 */
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateToken, USER_TYPES } = require('../../utils/jwt');
const { success, error } = require('../../utils/response');
const { query } = require('../../utils/db');
const config = require('../../config');
const { StatusCodes } = require('http-status-codes');

/**
 * 微信登录
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return error(res, '请提供微信登录code', StatusCodes.BAD_REQUEST);
    }

    // 调用微信接口获取openid
    const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.wechat.appId}&secret=${config.wechat.appSecret}&js_code=${code}&grant_type=authorization_code`;

    let wxData;
    try {
      const wxResponse = await axios.get(wxUrl);
      wxData = wxResponse.data;
    } catch (wxError) {
      console.error('微信接口调用失败:', wxError.message);
      return error(res, '微信登录失败', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (wxData.errcode) {
      console.error('微信接口返回错误:', wxData);
      return error(res, wxData.errmsg || '微信登录失败', StatusCodes.UNAUTHORIZED);
    }

    const { openid, session_key } = wxData;

    // 查询用户是否已存在
    const users = await query('SELECT * FROM users WHERE openid = ?', [openid]);

    let user;
    let isNewUser = false;

    if (users.length > 0) {
      // 用户已存在
      user = users[0];
    } else {
      // 新用户，创建用户记录
      isNewUser = true;
      const result = await query(
        'INSERT INTO users (openid, nickname, register_time) VALUES (?, ?, NOW())',
        [openid, '新用户']
      );
      user = {
        id: result.insertId,
        openid,
        nickname: '新用户',
        avatar: '',
        phone: '',
        email: '',
        bio: '',
        consecutive_days: 0,
        total_days: 0,
        longest_streak: 0,
        status: 1
      };
    }

    // 生成JWT令牌
    const token = generateToken({
      id: user.id,
      openid: user.openid,
      nickname: user.nickname
    }, USER_TYPES.MOBILE);

    // 返回结果
    success(res, {
      token,
      userId: user.id,
      isNewUser
    }, '登录成功');
  } catch (err) {
    console.error('登录错误:', err);
    error(res, '登录失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
