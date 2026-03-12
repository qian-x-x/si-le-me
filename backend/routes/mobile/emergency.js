/**
 * 紧急联系人模块路由
 * 死了么小程序C端 - 紧急联系人相关接口
 */
const express = require('express');
const router = express.Router();
const { authMiddleware, USER_TYPES } = require('../../utils/jwt');
const { success, error } = require('../../utils/response');
const { query } = require('../../utils/db');
const { StatusCodes } = require('http-status-codes');

/**
 * 获取紧急联系人
 * GET /api/emergency/get
 */
router.get('/get', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取主要联系人
    const contacts = await query(
      `SELECT name, phone, email, is_primary
      FROM emergency_contacts
      WHERE user_id = ?
      ORDER BY is_primary DESC, id ASC
      LIMIT 1`,
      [userId]
    );

    if (contacts.length === 0) {
      return success(res, {
        name: '',
        phone: '',
        email: ''
      });
    }

    const contact = contacts[0];
    success(res, {
      name: contact.name,
      phone: contact.phone,
      email: contact.email
    });
  } catch (err) {
    console.error('获取紧急联系人错误:', err);
    error(res, '获取紧急联系人失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 保存紧急联系人
 * POST /api/emergency/save
 */
router.post('/save', authMiddleware(USER_TYPES.MOBILE), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, email, relation } = req.body;

    if (!name) {
      return error(res, '请提供联系人姓名', StatusCodes.BAD_REQUEST);
    }

    if (!phone) {
      return error(res, '请提供联系人电话', StatusCodes.BAD_REQUEST);
    }

    // 检查是否已有紧急联系人
    const existingContacts = await query(
      'SELECT id FROM emergency_contacts WHERE user_id = ?',
      [userId]
    );

    if (existingContacts.length > 0) {
      // 更新主要联系人
      await query(
        `UPDATE emergency_contacts SET
          name = ?,
          phone = ?,
          email = ?,
          relation = ?,
          is_primary = 1,
          update_time = NOW()
        WHERE user_id = ?`,
        [name, phone, email || '', relation || '', userId]
      );
    } else {
      // 新增紧急联系人
      await query(
        `INSERT INTO emergency_contacts
          (user_id, name, phone, email, relation, is_primary, create_time)
        VALUES (?, ?, ?, ?, ?, 1, NOW())`,
        [userId, name, phone, email || '', relation || '']
      );
    }

    success(res, null, '紧急联系人保存成功');
  } catch (err) {
    console.error('保存紧急联系人错误:', err);
    error(res, '保存紧急联系人失败', StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
