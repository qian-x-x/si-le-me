/**
 * 移动端路由索引文件
 * 死了么小程序C端API路由
 */
const express = require('express');
const router = express.Router();

// 导入各模块路由
const authRoutes = require('./auth');
const userRoutes = require('./user');
const signinRoutes = require('./signin');
const rankRoutes = require('./rank');
const locationRoutes = require('./location');
const emergencyRoutes = require('./emergency');

// 注册子路由模块
// 认证相关路由
router.use('/auth', authRoutes);

// 用户信息路由
router.use('/user', userRoutes);

// 签到相关路由
router.use('/signin', signinRoutes);

// 排行榜相关路由
router.use('/rank', rankRoutes);

// 位置相关路由
router.use('/location', locationRoutes);

// 紧急联系人路由
router.use('/emergency', emergencyRoutes);

module.exports = router;
