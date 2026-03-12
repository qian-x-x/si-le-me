#!/bin/bash

# 死了么小程序后端部署脚本

echo "开始部署后端服务..."

# 1. 进入项目目录（根据实际情况修改）
cd /root/node-backend-master

# 2. 安装依赖
echo "安装依赖..."
npm install

# 3. 初始化数据库（如需重新初始化）
echo "初始化数据库..."
node scripts/initDB.js

# 4. 启动服务（后台运行）
echo "启动服务..."
nohup node server.js > server.log 2>&1 &

# 5. 检查服务状态
sleep 2
if curl -s http://localhost:3000/health > /dev/null; then
    echo "服务启动成功！"
    echo "API地址: http://你的服务器IP:3000"
else
    echo "服务启动失败，请检查日志: server.log"
fi
