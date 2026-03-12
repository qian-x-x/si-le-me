# API设计.md

"死了么"小程序C端API接口设计。

---

## 响应格式规范

### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 1,
  "message": "错误信息",
  "data": {}
}
```

---

## 一、用户相关

### 1.1 获取用户信息
- **接口路径**: `/api/user/info`
- **请求方式**: GET
- **请求参数**: 无（通过openid获取）
- **响应示例**:
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "nickname": "用户甲",
    "avatar": "https://xxx.com/avatar.jpg",
    "phone": "13800138000",
    "email": "user@example.com",
    "bio": "编程两年半",
    "consecutiveDays": 30,
    "totalDays": 100,
    "longestStreak": 60,
    "lastSigninTime": "2024-01-15 09:00:00",
    "registerTime": "2023-06-01 10:00:00"
  }
}
```

### 1.2 更新用户资料
- **接口路径**: `/api/user/profile`
- **请求方式**: POST
- **请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | string | 否 | 昵称 |
| avatar | string | 否 | 头像URL |
| bio | string | 否 | 个性签名 |

### 1.3 绑定手机号
- **接口路径**: `/api/user/bind-phone`
- **请求方式**: POST
- **请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号 |
| code | string | 是 | 短信验证码 |

---

## 二、签到相关

### 2.1 每日签到
- **接口路径**: `/api/signin/daily`
- **请求方式**: POST
- **请求参数**: 无（通过openid获取用户）
- **响应示例**:
```json
{
  "code": 0,
  "data": {
    "success": true,
    "consecutiveDays": 31,
    "totalDays": 101,
    "longestStreak": 60,
    "signinTime": "2024-01-15 09:00:00"
  }
}
```

### 2.2 获取签到状态
- **接口路径**: `/api/signin/status`
- **请求方式**: GET
- **响应示例**:
```json
{
  "code": 0,
  "data": {
    "isSignedToday": true,
    "canSignIn": false,
    "consecutiveDays": 30,
    "totalDays": 100,
    "longestStreak": 60,
    "lastSignInTime": "2024-01-15 09:00:00",
    "signInHistory": [
      {"time": "2024-01-15 09:00:00", "consecutiveDays": 30},
      {"time": "2024-01-14 08:30:00", "consecutiveDays": 29}
    ]
  }
}
```

### 2.3 获取签到历史
- **接口路径**: `/api/signin/history`
- **请求方式**: GET
- **请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认30 |

---

## 三、排行榜相关

### 3.1 获取排行榜
- **接口路径**: `/api/rank/list`
- **请求方式**: GET
- **请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 排行榜类型：consecutive/total，默认consecutive |
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认10 |
- **响应示例**:
```json
{
  "code": 0,
  "data": {
    "list": [
      {"rank": 1, "userId": 1, "nickname": "用户甲", "avatar": "url", "consecutiveDays": 365, "totalDays": 500},
      {"rank": 2, "userId": 2, "nickname": "用户乙", "avatar": "url", "consecutiveDays": 180, "totalDays": 300}
    ],
    "todaySignInCount": 128,
    "currentUserRank": 5
  }
}
```

---

## 四、地图/位置相关

### 4.1 上报位置
- **接口路径**: `/api/location/report`
- **请求方式**: POST
- **请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| latitude | decimal | 是 | 纬度 |
| longitude | decimal | 是 | 经度 |
| accuracy | float | 否 | 定位精度 |

### 4.2 获取附近用户
- **接口路径**: `/api/location/nearby`
- **请求方式**: GET
- **请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| latitude | decimal | 是 | 纬度 |
| longitude | decimal | 是 | 经度 |
| radius | int | 否 | 半径（米），默认5000 |
- **响应示例**:
```json
{
  "code": 0,
  "data": {
    "nearbyCount": 25,
    "signedCount": 18,
    "unsignedCount": 7,
    "users": [
      {"id": 1, "name": "用户A", "latitude": 39.9042, "longitude": 116.4074, "signedInToday": true}
    ]
  }
}
```

---

## 五、紧急联系人相关

### 5.1 获取紧急联系人
- **接口路径**: `/api/emergency/get`
- **请求方式**: GET
- **响应示例**:
```json
{
  "code": 0,
  "data": {
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com"
  }
}
```

### 5.2 保存紧急联系人
- **接口路径**: `/api/emergency/save`
- **请求方式**: POST
- **请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 联系人姓名 |
| phone | string | 是 | 联系人电话 |
| email | string | 否 | 联系人邮箱 |

---

## 六、其他

### 6.1 微信登录
- **接口路径**: `/api/auth/login`
- **请求方式**: POST
- **请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| code | string | 是 | 微信登录code |
- **响应示例**:
```json
{
  "code": 0,
  "data": {
    "token": "xxx",
    "userId": 1,
    "isNewUser": false
  }
}
```
