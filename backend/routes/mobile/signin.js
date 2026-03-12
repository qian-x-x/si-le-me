/**
 * 签到模块路由
 * 死了么小程序C端 - 签到相关接口
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { success, error, paginate } = require('../../utils/response');
const { query, pool } = require('../../utils/db');
const { StatusCodes } = require('http-status-codes');

/**
 * 每日签到
 * POST /api/signin/daily
 */
router.post('/daily', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  let connection;
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const now = new Date();

    // 获取用户当前信息
    const users = await query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return error(res, '用户不存在', StatusCodes.NOT_FOUND);
    }
    const user = users[0];

    // 检查今天是否已签到
    const todayRecords = await query(
      'SELECT * FROM signin_records WHERE user_id = ? AND signin_date = ?',
      [userId, today]
    );

    if (todayRecords.length > 0) {
      return error(res, '今日已签到', StatusCodes.CONFLICT);
    }

    // 计算连续签到天数
    let consecutiveDays = 1;
    if (user.last_signin_date) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (user.last_signin_date === yesterdayStr) {
        // 昨天已签到，连续签到
        consecutiveDays = user.consecutive_days + 1;
      }
    }

    const totalDays = user.total_days + 1;
    const longestStreak = Math.max(user.longest_streak, consecutiveDays);

    // 开启事务
    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 更新用户签到信息
      await connection.query(
        `UPDATE users SET
          consecutive_days = ?,
          total_days = ?,
          longest_streak = ?,
          last_signin_time = ?,
          last_signin_date = ?
        WHERE id = ?`,
        [consecutiveDays, totalDays, longestStreak, now, today, userId]
      );

      // 插入签到记录
      await connection.query(
        `INSERT INTO signin_records
          (user_id, signin_date, signin_time, consecutive_days, total_days, ip, device_info, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [userId, today, now, consecutiveDays, totalDays, req.ip, JSON.stringify(req.headers['user-agent'])]
      );

      // 插入签到历史
      await connection.query(
        `INSERT INTO signin_history (user_id, signin_time, consecutive_days)
        VALUES (?, ?, ?)`,
        [userId, now, consecutiveDays]
      );

      await connection.commit();
    } catch (transError) {
      await connection.rollback();
      throw transError;
    } finally {
      connection.release();
    }

    success(res, {
      success: true,
      consecutiveDays,
      totalDays,
      longestStreak,
      signinTime: now
    }, '签到成功');
  } catch (err) {
    console.error('签到错误:', err);
    error(res, '签到失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 获取签到状态
 * GET /api/signin/status
 */
router.get('/status', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    // 获取用户信息
    const users = await query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return error(res, '用户不存在', StatusCodes.NOT_FOUND);
    }
    const user = users[0];

    // 检查今天是否已签到
    const todayRecords = await query(
      'SELECT * FROM signin_records WHERE user_id = ? AND signin_date = ?',
      [userId, today]
    );

    const isSignedToday = todayRecords.length > 0;

    // 获取最近签到历史（最近7天）
    const history = await query(
      `SELECT signin_time, consecutive_days
      FROM signin_records
      WHERE user_id = ?
      ORDER BY signin_time DESC
      LIMIT 7`,
      [userId]
    );

    const signInHistory = history.map(item => ({
      time: item.signin_time,
      consecutiveDays: item.consecutive_days
    }));

    success(res, {
      isSignedToday,
      canSignIn: !isSignedToday,
      consecutiveDays: user.consecutive_days,
      totalDays: user.total_days,
      longestStreak: user.longest_streak,
      lastSignInTime: user.last_signin_time,
      signInHistory
    });
  } catch (err) {
    console.error('获取签到状态错误:', err);
    error(res, '获取签到状态失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 获取签到历史
 * GET /api/signin/history
 */
router.get('/history', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 30;
    const offset = (page - 1) * pageSize;

    // 获取总数
    const countResult = await query(
      'SELECT COUNT(*) as total FROM signin_records WHERE user_id = ?',
      [userId]
    );
    const total = countResult[0].total;

    // 获取历史记录
    const history = await query(
      `SELECT signin_time, consecutive_days
      FROM signin_records
      WHERE user_id = ?
      ORDER BY signin_time DESC
      LIMIT ? OFFSET ?`,
      [userId, pageSize, offset]
    );

    const list = history.map(item => ({
      time: item.signin_time,
      consecutiveDays: item.consecutive_days
    }));

    paginate(res, list, total, page, pageSize);
  } catch (err) {
    console.error('获取签到历史错误:', err);
    error(res, '获取签到历史失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
