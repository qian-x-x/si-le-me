/**
 * 签到记录表初始化
 * 用于防止重复签到
 */
const logger = require('../../utils/logger');

/**
 * 创建签到记录表
 * @param {mysql.Connection} connection - MySQL连接实例
 * @returns {Promise<boolean>} - 是否成功
 */
const createSigninRecordsTable = async (connection) => {
  try {
    logger.info('开始创建签到记录表...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS \`signin_records\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
        \`user_id\` int(11) unsigned NOT NULL COMMENT '用户ID',
        \`signin_date\` date NOT NULL COMMENT '签到日期',
        \`signin_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '签到时间',
        \`consecutive_days\` int(11) NOT NULL DEFAULT 1 COMMENT '签到后的连续天数',
        \`total_days\` int(11) NOT NULL DEFAULT 1 COMMENT '签到后的总天数',
        \`ip\` varchar(45) NOT NULL DEFAULT '' COMMENT 'IP地址',
        \`device_info\` varchar(255) NOT NULL DEFAULT '' COMMENT '设备信息',
        \`status\` tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态：0失败 1成功',
        \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_user_date\` (\`user_id\`, \`signin_date\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_signin_date\` (\`signin_date\`),
        KEY \`idx_signin_time\` (\`signin_time\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到记录表';
    `;

    await connection.query(createTableSQL);
    logger.info('签到记录表创建成功');
    return true;
  } catch (error) {
    logger.error(`签到记录表创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createSigninRecordsTable
};
