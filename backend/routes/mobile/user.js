/**
 * 用户模块路由
 * 死了么小程序C端 - 用户相关接口
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { success, error } = require('../../utils/response');
const { query } = require('../../utils/db');
const { StatusCodes } = require('http-status-codes');

/**
 * 获取用户信息
 * GET /api/user/info
 */
router.get('/info', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;

    const users = await query('SELECT * FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return error(res, '用户不存在', StatusCodes.NOT_FOUND);
    }

    const user = users[0];

    success(res, {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      email: user.email,
      bio: user.bio,
      consecutiveDays: user.consecutive_days,
      totalDays: user.total_days,
      longestStreak: user.longest_streak,
      lastSigninTime: user.last_signin_time,
      registerTime: user.register_time
    });
  } catch (err) {
    console.error('获取用户信息错误:', err);
    error(res, '获取用户信息失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 更新用户资料
 * POST /api/user/profile
 */
router.post('/profile', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { nickname, avatar, bio } = req.body;

    // 构建更新语句
    const updateFields = [];
    const updateValues = [];

    if (nickname !== undefined) {
      updateFields.push('nickname = ?');
      updateValues.push(nickname);
    }
    if (avatar !== undefined) {
      updateFields.push('avatar = ?');
      updateValues.push(avatar);
    }
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }

    if (updateFields.length === 0) {
      return error(res, '没有需要更新的字段', StatusCodes.BAD_REQUEST);
    }

    updateValues.push(userId);

    await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    success(res, null, '更新成功');
  } catch (err) {
    console.error('更新用户资料错误:', err);
    error(res, '更新用户资料失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 绑定手机号
 * POST /api/user/bind-phone
 */
router.post('/bind-phone', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, code } = req.body;

    if (!phone) {
      return error(res, '请提供手机号', StatusCodes.BAD_REQUEST);
    }

    if (!code) {
      return error(res, '请提供短信验证码', StatusCodes.BAD_REQUEST);
    }

    // TODO: 验证短信验证码（实际项目中需要接入短信服务）

    // 检查手机号是否已被绑定
    const existingUsers = await query('SELECT id FROM users WHERE phone = ? AND id != ?', [phone, userId]);

    if (existingUsers.length > 0) {
      return error(res, '该手机号已被绑定', StatusCodes.CONFLICT);
    }

    // 更新用户手机号
    await query('UPDATE users SET phone = ? WHERE id = ?', [phone, userId]);

    success(res, null, '手机号绑定成功');
  } catch (err) {
    console.error('绑定手机号错误:', err);
    error(res, '绑定手机号失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
