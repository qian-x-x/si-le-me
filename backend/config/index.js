const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

module.exports = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'si-le-me',
    password: process.env.DB_PASSWORD || 'rYxE3d3SpYdfDERN',
    database: process.env.DB_NAME || 'si-le-me',
  },

  // Redis配置
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'rYxE3d3SpYdfDERN',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    mobileSecret: process.env.JWT_MOBILE_SECRET || 'rYxE3d3SpYdfDERN_mobile',
    adminSecret: process.env.JWT_ADMIN_SECRET || 'rYxE3d3SpYdfDERN_admin',
  },

  // 微信小程序配置
  wechat: {
    appId: process.env.WX_APPID || 'wxd1ef86798c72d2dc',
    appSecret: process.env.WX_APPSECRET || 'a15200aaeedfa55b161aada61cbffc0f',
  },

  // 七牛云配置
  qiniu: {
    accessKey: process.env.QINIU_ACCESS_KEY || '',
    secretKey: process.env.QINIU_SECRET_KEY || '',
    bucket: process.env.QINIU_BUCKET || '',
    domain: process.env.QINIU_DOMAIN || '',
  },
}; 