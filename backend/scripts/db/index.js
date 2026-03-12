/**
 * 数据库表初始化索引文件
 * 集中管理所有表的初始化
 */
const logger = require('../../utils/logger');
const { createUsersTable } = require('./users');
const { createSigninRecordsTable } = require('./signin_records');
const { createSigninHistoryTable } = require('./signin_history');
const { createEmergencyContactsTable } = require('./emergency_contacts');
const { createUserLocationsTable } = require('./user_locations');

/**
 * 初始化所有数据库表
 * @param {mysql.Connection} connection - MySQL连接实例
 * @returns {Promise<boolean>} - 是否成功
 */
const initAllTables = async (connection) => {
  try {
    logger.info('开始初始化所有数据库表...');

    // 按照依赖关系顺序初始化表
    // users表没有外键依赖，最先创建
    await createUsersTable(connection);
    await createSigninRecordsTable(connection);
    await createSigninHistoryTable(connection);
    await createEmergencyContactsTable(connection);
    await createUserLocationsTable(connection);

    logger.info('所有数据库表初始化完成');
    return true;
  } catch (error) {
    logger.error(`数据库表初始化失败: ${error.message}`);
    return false;
  }
};

module.exports = {
  initAllTables
};
