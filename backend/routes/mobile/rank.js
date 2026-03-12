/**
 * 排行榜模块路由
 * 死了么小程序C端 - 排行榜相关接口
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { success, error, paginate } = require('../../utils/response');
const { query } = require('../../utils/db');
const { StatusCodes } = require('http-status-codes');

/**
 * 获取排行榜
 * GET /api/rank/list
 */
router.get('/list', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const type = req.query.type || 'consecutive'; // consecutive: 连续签到榜, total: 总天数榜
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    // 获取今日签到总数
    const today = new Date().toISOString().slice(0, 10);
    const todaySignInCountResult = await query(
      'SELECT COUNT(*) as count FROM signin_records WHERE signin_date = ? AND status = 1',
      [today]
    );
    const todaySignInCount = todaySignInCountResult[0].count;

    // 排序字段
    const orderBy = type === 'total' ? 'total_days DESC' : 'consecutive_days DESC';

    // 获取排行榜列表
    const list = await query(
      `SELECT id, nickname, avatar, consecutive_days, total_days
      FROM users
      WHERE status = 1
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    // 获取用户在排行榜中的排名
    const rankResult = await query(
      `SELECT COUNT(*) + 1 as rank
      FROM users
      WHERE status = 1 AND (
        (${type === 'total' ? 'total_days' : 'consecutive_days'}) >
        (SELECT ${type === 'total' ? 'total_days' : 'consecutive_days'} FROM users WHERE id = ?)
      )`,
      [userId]
    );
    const currentUserRank = rankResult[0].rank;

    // 格式化返回数据
    const rankList = list.map((item, index) => ({
      rank: offset + index + 1,
      userId: item.id,
      nickname: item.nickname,
      avatar: item.avatar,
      consecutiveDays: item.consecutive_days,
      totalDays: item.total_days
    }));

    success(res, {
      list: rankList,
      todaySignInCount,
      currentUserRank
    });
  } catch (err) {
    console.error('获取排行榜错误:', err);
    error(res, '获取排行榜失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
