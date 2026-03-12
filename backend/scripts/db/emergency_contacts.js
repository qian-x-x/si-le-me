/**
 * 紧急联系人表初始化
 * 用户的紧急联系人信息
 */
const logger = require('../../utils/logger');

/**
 * 创建紧急联系人表
 * @param {mysql.Connection} connection - MySQL连接实例
 * @returns {Promise<boolean>} - 是否成功
 */
const createEmergencyContactsTable = async (connection) => {
  try {
    logger.info('开始创建紧急联系人表...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS \`emergency_contacts\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
        \`user_id\` int(11) unsigned NOT NULL COMMENT '用户ID',
        \`name\` varchar(50) NOT NULL COMMENT '联系人姓名',
        \`phone\` varchar(20) NOT NULL COMMENT '联系人电话',
        \`email\` varchar(100) NOT NULL DEFAULT '' COMMENT '联系人邮箱',
        \`relation\` varchar(20) NOT NULL DEFAULT '' COMMENT '与用户关系',
        \`is_primary\` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否为主要联系人：0否 1是',
        \`create_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`update_time\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_phone\` (\`phone\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='紧急联系人表';
    `;

    await connection.query(createTableSQL);
    logger.info('紧急联系人表创建成功');
    return true;
  } catch (error) {
    logger.error(`紧急联系人表创建失败: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createEmergencyContactsTable
};
