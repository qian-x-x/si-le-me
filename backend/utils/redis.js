const { createClient } = require('redis');
const config = require('../config');
const logger = require('./logger');

// 创建Redis客户端配置
const redisConfig = {
  socket: {
    host: config.redis.host,
    port: config.redis.port,
    reconnectStrategy: false, // 禁用自动重连
  }
};

// 只有当密码存在且不为空时才添加密码配置
if (config.redis.password && config.redis.password.trim() !== '') {
  redisConfig.password = config.redis.password;
}

// 创建Redis客户端
const redisClient = createClient(redisConfig);

// 连接Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis连接成功');
    return true;
  } catch (error) {
    logger.warn(`Redis连接失败: ${error.message}，将使用内存存储`);
    return false;
  }
};

// 断开连接
const disconnectRedis = async () => {
  try {
    await redisClient.disconnect();
    logger.info('Redis断开连接');
  } catch (error) {
    logger.error(`Redis断开连接失败: ${error.message}`);
  }
};

// 错误处理 - 不输出日志避免刷屏
redisClient.on('error', (err) => {
  // 静默处理错误，不记录日志
});

module.exports = {
  redisClient,
  connectRedis,
  disconnectRedis
};
