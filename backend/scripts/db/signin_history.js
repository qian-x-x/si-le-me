/**
 * 签到历史表初始化
 * 记录用户签到的历史
 */
const logger = require('../../utils/logger');

/**
 * 创建签到历史表
 * @param {mysql.Connection} connection - MySQL连接实例
 * @returns {Promise<boolean>} - 是否成功
 */
const createSigninHistoryTable = async (connection) => {
  try {
    logger.info('开始创建签到历史表...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS \`signin_history\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
        \`user_id\` int(11) unsigned NOT NULL COMMENT '用户ID',
        \`signin_time\` datetime NOT NULL COMMENT '签到时间',
        \`consecutive_days\` int(11) NOT NULL COMMENT '当时的连续天数',
        \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        PRIMARY KEY (\`id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_signin_time\` (\`signin_time\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到历史表';
    `;

    await connection.query(createTableSQL);
    logger.info('签到历史表创建成功');
    return true;
  } catch (error) {
    logger.error(`签到历史表创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createSigninHistoryTable
};
