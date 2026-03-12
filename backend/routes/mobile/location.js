/**
 * 位置模块路由
 * 死了么小程序C端 - 位置相关接口
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { success, error } = require('../../utils/response');
const { query } = require('../../utils/db');
const { StatusCodes } = require('http-status-codes');

/**
 * 上报位置
 * POST /api/location/report
 */
router.post('/report', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude, accuracy } = req.body;

    if (!latitude || !longitude) {
      return error(res, '请提供经纬度信息', StatusCodes.BAD_REQUEST);
    }

    // 检查今天是否已签到
    const today = new Date().toISOString().slice(0, 10);
    const todaySignIn = await query(
      'SELECT id FROM signin_records WHERE user_id = ? AND signin_date = ?',
      [userId, today]
    );
    const signedToday = todaySignIn.length > 0 ? 1 : 0;

    // 检查是否已有位置记录
    const existingLocation = await query(
      'SELECT id FROM user_locations WHERE user_id = ?',
      [userId]
    );

    if (existingLocation.length > 0) {
      // 更新位置
      await query(
        `UPDATE user_locations SET
          latitude = ?,
          longitude = ?,
          accuracy = ?,
          signed_today = ?,
          last_update_time = NOW()
        WHERE user_id = ?`,
        [latitude, longitude, accuracy || 0, signedToday, userId]
      );
    } else {
      // 插入位置
      await query(
        `INSERT INTO user_locations
          (user_id, latitude, longitude, accuracy, signed_today, create_time)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [userId, latitude, longitude, accuracy || 0, signedToday]
      );
    }

    success(res, null, '位置上报成功');
  } catch (err) {
    console.error('上报位置错误:', err);
    error(res, '位置上报失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 获取附近用户
 * GET /api/location/nearby
 */
router.get('/nearby', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return error(res, '请提供经纬度信息', StatusCodes.BAD_REQUEST);
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseInt(radius) / 111000; // 转换为度数（约111km = 1度）

    // 查询附近用户（使用简单的矩形范围过滤，实际项目可使用更精确的地理空间查询）
    const nearbyUsers = await query(
      `SELECT
        ul.user_id,
        u.nickname,
        ul.latitude,
        ul.longitude,
        ul.signed_today
      FROM user_locations ul
      INNER JOIN users u ON ul.user_id = u.id
      WHERE u.status = 1
        AND ul.latitude BETWEEN ? AND ?
        AND ul.longitude BETWEEN ? AND ?`,
      [lat - rad, lat + rad, lng - rad, lng + rad]
    );

    // 计算实际距离并过滤
    const users = nearbyUsers.map(item => {
      // 简化的距离计算（实际项目可使用Haversine公式）
      const distance = Math.sqrt(
        Math.pow((item.latitude - lat) * 111000, 2) +
        Math.pow((item.longitude - lng) * 111000 * Math.cos(lat * Math.PI / 180), 2)
      );

      return {
        id: item.user_id,
        name: item.nickname,
        latitude: item.latitude,
        longitude: item.longitude,
        signedInToday: item.signed_today === 1,
        distance: Math.round(distance)
      };
    }).filter(item => item.distance <= parseInt(radius));

    // 统计
    const signedCount = users.filter(u => u.signedInToday).length;

    success(res, {
      nearbyCount: users.length,
      signedCount,
      unsignedCount: users.length - signedCount,
      users
    });
  } catch (err) {
    console.error('获取附近用户错误:', err);
    error(res, '获取附近用户失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
