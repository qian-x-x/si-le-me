/**
 * 用户表初始化
 * 死了么小程序用户表
 */
const logger = require('../../utils/logger');

/**
 * 创建用户表
 * @param {mysql.Connection} connection - MySQL连接实例
 * @returns {Promise<boolean>} - 是否成功
 */
const createUsersTable = async (connection) => {
  try {
    logger.info('开始创建用户表...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
        \`openid\` varchar(64) NOT NULL DEFAULT '' COMMENT '微信openid',
        \`nickname\` varchar(50) NOT NULL DEFAULT '' COMMENT '用户昵称',
        \`avatar\` varchar(255) NOT NULL DEFAULT '' COMMENT '头像URL',
        \`phone\` varchar(20) NOT NULL DEFAULT '' COMMENT '手机号',
        \`email\` varchar(100) NOT NULL DEFAULT '' COMMENT '邮箱',
        \`bio\` varchar(200) NOT NULL DEFAULT '' COMMENT '个性签名',
        \`consecutive_days\` int(11) NOT NULL DEFAULT 0 COMMENT '连续签到天数',
        \`total_days\` int(11) NOT NULL DEFAULT 0 COMMENT '总签到天数',
        \`longest_streak\` int(11) NOT NULL DEFAULT 0 COMMENT '最长连续签到',
        \`last_signin_time\` datetime DEFAULT NULL COMMENT '最后签到时间',
        \`last_signin_date\` date DEFAULT NULL COMMENT '最后签到日期',
        \`status\` tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
        \`register_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
        \`update_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_openid\` (\`openid\`),
        KEY \`idx_phone\` (\`phone\`),
        KEY \`idx_consecutive_days\` (\`consecutive_days\`),
        KEY \`idx_last_signin_date\` (\`last_signin_date\`),
        KEY \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
    `;

    await connection.query(createTableSQL);
    logger.info('用户表创建成功');
    return true;
  } catch (error) {
    logger.error(`用户表创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createUsersTable
};
