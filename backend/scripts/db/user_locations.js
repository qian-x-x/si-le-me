/**
 * 用户位置表初始化
 * 记录用户的位置信息
 */
const logger = require('../../utils/logger');

/**
 * 创建用户位置表
 * @param {mysql.Connection} connection - MySQL连接实例
 * @returns {Promise<boolean>} - 是否成功
 */
const createUserLocationsTable = async (connection) => {
  try {
    logger.info('开始创建用户位置表...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS \`user_locations\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
        \`user_id\` int(11) unsigned NOT NULL COMMENT '用户ID',
        \`latitude\` decimal(10,7) NOT NULL COMMENT '纬度',
        \`longitude\` decimal(10,7) NOT NULL COMMENT '经度',
        \`accuracy\` float NOT NULL DEFAULT 0 COMMENT '定位精度',
        \`signed_today\` tinyint(1) NOT NULL DEFAULT 0 COMMENT '今日是否签到：0否 1是',
        \`last_update_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
        \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_user_id\` (\`user_id\`),
        KEY \`idx_last_update_time\` (\`last_update_time\`),
        KEY \`idx_signed_today\` (\`signed_today\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户位置表';
    `;

    await connection.query(createTableSQL);
    logger.info('用户位置表创建成功');
    return true;
  } catch (error) {
    logger.error(`用户位置表创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createUserLocationsTable
};
