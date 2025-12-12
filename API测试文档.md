# API测试文档

## 基础信息

- **基础URL**: `http://localhost:8000`
- **API前缀**: `/api`
- **认证方式**: JWT Bearer Token
- **内容类型**: `application/json`

## 目录

1. [用户认证API](#用户认证api)
2. [用户管理API](#用户管理api)
3. [知识图谱API](#知识图谱api)
4. [社区功能API](#社区功能api)
5. [聊天API](#聊天api)
6. [测验API](#测验api)
7. [通知API](#通知api)

---

## 用户认证API

### 1.1 用户注册

**接口**: `POST /api/users/register/`

**权限**: 公开访问

**请求体**:
```json
{
  "username": "testuser01",
  "password": "Test@123456",
  "password_confirm": "Test@123456",
  "email": "testuser01@example.com",
  "phone_number": "13800138000",
  "nickname": "测试用户"
}
```

**响应示例**:
```json
{
  "message": "User registered successfully"
}
```

### 1.2 JWT登录

**接口**: `POST /api/users/login/`

**权限**: 公开访问

**请求体**:
```json
{
  "username": "testuser01",
  "password": "Test@123456"
}
```

**响应示例**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "username": "testuser01",
    "email": "testuser01@example.com",
    "nickname": "测试用户",
    "avatar_url": "",
    "user_type": "regular"
  }
}
```

### 1.3 JWT登出

**接口**: `POST /api/users/logout/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**响应示例**:
```json
{
  "message": "成功登出"
}
```

### 1.4 刷新Token

**接口**: `POST /api/users/token/refresh/`

**权限**: 公开访问

**请求体**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**响应示例**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 1.5 验证Token

**接口**: `POST /api/users/token/verify/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "testuser01",
    "email": "testuser01@example.com",
    "nickname": "测试用户"
  }
}
```

### 1.6 密码验证

**接口**: `POST /api/users/password/validate/`

**权限**: 公开访问

**请求体**:
```json
{
  "password": "Test@123456"
}
```

**响应示例**:
```json
{
  "valid": true
}
```

---

## 用户管理API

### 2.1 获取当前用户信息

**接口**: `GET /api/users/me/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "id": 1,
  "username": "testuser01",
  "email": "testuser01@example.com",
  "phone_number": "13800138000",
  "nickname": "测试用户",
  "avatar_url": "https://example.com/avatar.jpg",
  "user_type": "regular",
  "date_joined": "2024-01-01T00:00:00Z",
  "profile_visibility": "public"
}
```

### 2.2 更新用户资料

**接口**: `PUT /api/users/profile/` 或 `PATCH /api/users/profile/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: multipart/form-data
```

**请求体** (form-data):
```
nickname: 新昵称
bio: 个人简介
avatar: [文件]
```

**响应示例**:
```json
{
  "id": 1,
  "username": "testuser01",
  "email": "testuser01@example.com",
  "nickname": "新昵称",
  "bio": "个人简介",
  "avatar_url": "https://example.com/new_avatar.jpg"
}
```

### 2.3 修改密码

**接口**: `PUT /api/users/change-password/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "old_password": "Test@123456",
  "new_password": "NewTest@123456"
}
```

**响应示例**:
```json
{
  "message": "Password updated successfully"
}
```

### 2.4 删除账户

**接口**: `DELETE /api/users/delete-account/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "message": "Account deleted successfully"
}
```

### 2.5 绑定邮箱

**接口**: `POST /api/users/bind-email/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "email": "newemail@example.com",
  "code": "123456"
}
```

**响应示例**:
```json
{
  "message": "Email bound successfully"
}
```

### 2.6 绑定手机号

**接口**: `POST /api/users/bind-phone/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "phone_number": "13900139000",
  "code": "123456"
}
```

**响应示例**:
```json
{
  "message": "Phone number bound successfully"
}
```

### 2.7 解绑邮箱

**接口**: `POST /api/users/unbind-email/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "message": "Email unbound"
}
```

### 2.8 解绑手机号

**接口**: `POST /api/users/unbind-phone/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "message": "Phone number unbound"
}
```

### 2.9 获取用户设置

**接口**: `GET /api/users/settings/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "profile_visibility": "public",
  "email_notifications": true,
  "push_notifications": true
}
```

### 2.10 更新用户设置

**接口**: `PUT /api/users/settings/` 或 `PATCH /api/users/settings/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "profile_visibility": "private",
  "email_notifications": false
}
```

**响应示例**:
```json
{
  "profile_visibility": "private",
  "email_notifications": false,
  "push_notifications": true
}
```

### 2.11 获取用户统计

**接口**: `GET /api/users/stats/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "quiz_attempts_count": 15,
  "average_score": 78.5,
  "best_score": 95,
  "last_attempt": {
    "score": 85,
    "level": "medium",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2.12 检查用户名可用性

**接口**: `POST /api/users/check-username/`

**权限**: 公开访问

**请求体**:
```json
{
  "username": "newuser01"
}
```

**响应示例**:
```json
{
  "available": true,
  "message": "用户名可用",
  "suggestions": []
}
```

**用户名已占用响应**:
```json
{
  "available": false,
  "message": "该用户名已被占用",
  "suggestions": ["newuser01234", "newuser01ab", "newuser01_456"]
}
```

### 2.13 用户引导流程

**接口**: `GET /api/users/onboarding/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "options": {
    "age_ranges": [
      {"value": "under_18", "label": "18岁以下"},
      {"value": "18_25", "label": "18-25岁"},
      {"value": "26_35", "label": "26-35岁"}
    ],
    "genders": [
      {"value": "male", "label": "男"},
      {"value": "female", "label": "女"}
    ],
    "occupations": [
      {"value": "student", "label": "学生"},
      {"value": "engineer", "label": "工程师"}
    ]
  },
  "user_completed": false
}
```

**接口**: `POST /api/users/onboarding/`

**请求体**:
```json
{
  "age_range": "26_35",
  "gender": "male",
  "occupation": "engineer"
}
```

**响应示例**:
```json
{
  "message": "引导流程完成",
  "user": {
    "id": 1,
    "username": "testuser01",
    "age_range": "26_35",
    "gender": "male",
    "occupation": "engineer",
    "onboarding_completed": true
  }
}
```

### 2.14 管理员 - 获取用户列表

**接口**: `GET /api/users/admin/users/`

**权限**: 需要管理员权限

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `search`: 搜索关键词
- `user_type`: 用户类型过滤

**响应示例**:
```json
[
  {
    "id": 1,
    "username": "testuser01",
    "email": "testuser01@example.com",
    "nickname": "测试用户",
    "user_type": "regular",
    "is_active": true,
    "date_joined": "2024-01-01T00:00:00Z"
  }
]
```

### 2.15 管理员 - 获取/更新/删除用户

**接口**: `GET /api/users/admin/users/{id}/`

**权限**: 需要管理员权限

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "id": 1,
  "username": "testuser01",
  "email": "testuser01@example.com",
  "nickname": "测试用户",
  "user_type": "regular",
  "is_active": true,
  "date_joined": "2024-01-01T00:00:00Z"
}
```

**更新用户**: `PUT /api/users/admin/users/{id}/` 或 `PATCH /api/users/admin/users/{id}/`

**删除用户**: `DELETE /api/users/admin/users/{id}/`


---

## 知识图谱API

### 3.1 获取初始图谱

**接口**: `GET /api/graph/initial/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `limit`: 返回节点数量限制 (默认: 50, 最大: 200)

**响应示例**:
```json
{
  "graph": {
    "nodes": [
      {
        "id": "node_001",
        "labels": ["Person", "Victim"],
        "name": "张三",
        "properties": {
          "age": 30,
          "phone": "138****0001"
        }
      }
    ],
    "links": [
      {
        "id": "rel_001",
        "source": "node_001",
        "target": "node_002",
        "type": "KNOWS",
        "properties": {
          "since": "2023-01-01"
        }
      }
    ],
    "counts": {
      "nodes": 50,
      "links": 75
    }
  },
  "meta": {
    "limit": 50,
    "returned_nodes": 50,
    "returned_links": 75
  }
}
```

### 3.2 过滤图谱

**接口**: `GET /api/graph/filtered/` 或 `POST /api/graph/filtered/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数/请求体**:
```json
{
  "node_types": ["Person", "Organization"],
  "relationship_types": ["WORKS_FOR", "KNOWS"],
  "search": "诈骗",
  "limit": 100
}
```

**响应示例**:
```json
{
  "graph": {
    "nodes": [...],
    "links": [...],
    "counts": {
      "nodes": 30,
      "links": 45
    }
  },
  "meta": {
    "limit": 100,
    "filters": {
      "node_types": ["Person", "Organization"],
      "relationship_types": ["WORKS_FOR", "KNOWS"],
      "search": "诈骗"
    },
    "returned_nodes": 30,
    "returned_links": 45
  }
}
```

### 3.3 获取图谱元数据

**接口**: `GET /api/graph/metadata/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `node_limit`: 返回高连接度节点数量 (默认: 10)
- `node_skip`: 跳过节点数量 (默认: 0)
- `relationship_limit`: 返回关系类型数量 (默认: 25)
- `label_limit`: 返回标签数量 (默认: 25)

**响应示例**:
```json
{
  "nodes": {
    "items": [
      {
        "id": "node_001",
        "elementId": "4:abc123",
        "labels": ["Person"],
        "name": "张三",
        "degree": 15,
        "properties": {...}
      }
    ],
    "pagination": {
      "skip": 0,
      "limit": 10,
      "hasMore": true
    }
  },
  "labels": [
    {"label": "Person", "count": 150},
    {"label": "Organization", "count": 45}
  ],
  "relationships": [
    {"type": "KNOWS", "count": 200},
    {"type": "WORKS_FOR", "count": 80}
  ]
}
```

### 3.4 搜索图谱

**接口**: `GET /api/graph/search/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `query`: 搜索关键词 (必需)
- `limit`: 返回数量 (默认: 50, 最大: 200)
- `scope`: 搜索范围 (可选: cases, people, organizations, devices)

**响应示例**:
```json
{
  "graph": {
    "nodes": [...],
    "links": [...]
  },
  "meta": {
    "query": "电信诈骗",
    "limit": 50,
    "labels": ["FraudCase"]
  }
}
```

### 3.5 全局搜索

**接口**: `GET /api/graph/search/universal/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `query`: 搜索关键词 (必需)
- `node_limit`: 节点数量限制 (默认: 25)
- `relationship_limit`: 关系数量限制 (默认: 25)

**响应示例**:
```json
{
  "query": "电信诈骗",
  "nodes": [
    {
      "id": "node_001",
      "elementId": "4:abc123",
      "labels": ["FraudCase"],
      "name": "电信诈骗案例001",
      "degree": 10,
      "properties": {...}
    }
  ],
  "relationships": [
    {
      "id": "rel_001",
      "type": "RELATED_TO",
      "source": "node_001",
      "target": "node_002",
      "properties": {}
    }
  ],
  "meta": {
    "node_limit": 25,
    "relationship_limit": 25,
    "returned_nodes": 5,
    "returned_relationships": 3
  }
}
```

### 3.6 获取节点详情

**接口**: `GET /api/graph/node/{node_id}/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `limit`: 邻居数量限制 (可选)

**响应示例**:
```json
{
  "node": {
    "id": "node_001",
    "labels": ["Person"],
    "name": "张三",
    "properties": {
      "age": 30,
      "phone": "138****0001"
    }
  },
  "neighbors": [
    {
      "id": "node_002",
      "labels": ["Person"],
      "name": "李四",
      "relationship_type": "KNOWS"
    }
  ],
  "graph": {
    "nodes": [...],
    "links": [...]
  }
}
```

### 3.7 扩展节点

**接口**: `GET /api/graph/node/{node_id}/expand/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `limit`: 返回邻居数量 (默认: 50, 最大: 200)

**响应示例**:
```json
{
  "graph": {
    "nodes": [...],
    "links": [...]
  },
  "meta": {
    "node_id": "node_001",
    "limit": 50,
    "returned_nodes": 35
  }
}
```

### 3.8 创建节点

**接口**: `POST /api/graph/nodes/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "label": "Person",
  "properties": {
    "name": "王五",
    "age": 25,
    "email": "wangwu@example.com"
  }
}
```

**响应示例**:
```json
{
  "message": "Node created successfully",
  "data": [
    {
      "id": "node_new_001",
      "labels": ["Person"],
      "properties": {
        "name": "王五",
        "age": 25,
        "email": "wangwu@example.com"
      }
    }
  ],
  "summary": {
    "nodes_created": 1
  }
}
```

### 3.9 获取节点

**接口**: `GET /api/graph/nodes/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `node_id`: 节点ID (可选)
- `label`: 节点标签 (可选)
- `property`: 属性名 (可选)
- `value`: 属性值 (可选)
- `limit`: 返回数量限制 (默认: 50)

**响应示例**:
```json
{
  "message": "Nodes retrieved successfully",
  "data": [
    {
      "id": "node_001",
      "labels": ["Person"],
      "properties": {...}
    }
  ],
  "count": 1
}
```

### 3.10 更新节点

**接口**: `PUT /api/graph/nodes/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "node_id": "node_001",
  "properties": {
    "age": 31,
    "city": "北京"
  }
}
```

**响应示例**:
```json
{
  "message": "Node updated successfully",
  "data": [...],
  "summary": {
    "properties_set": 2
  }
}
```

### 3.11 删除节点

**接口**: `DELETE /api/graph/nodes/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "node_id": "node_001"
}
```

**批量删除**:
```json
{
  "node_ids": ["node_001", "node_002", "node_003"]
}
```

**响应示例**:
```json
{
  "message": "Node deleted successfully",
  "summary": {
    "nodes_deleted": 1,
    "relationships_deleted": 5
  }
}
```

### 3.12 创建关系

**接口**: `POST /api/graph/relationships/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "from_node_id": "node_001",
  "to_node_id": "node_002",
  "relationship_type": "KNOWS",
  "properties": {
    "since": "2023-01-01",
    "weight": 0.8
  }
}
```

**响应示例**:
```json
{
  "message": "Relationship created successfully",
  "data": [
    {
      "id": "rel_new_001",
      "type": "KNOWS",
      "properties": {
        "since": "2023-01-01",
        "weight": 0.8
      }
    }
  ],
  "summary": {
    "relationships_created": 1
  }
}
```

### 3.13 获取关系

**接口**: `GET /api/graph/relationships/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `relationship_id`: 关系ID (可选)
- `from_node_id`: 起始节点ID (可选)
- `to_node_id`: 目标节点ID (可选)
- `relationship_type`: 关系类型 (可选)
- `limit`: 返回数量限制 (默认: 50)

**响应示例**:
```json
{
  "message": "Relationships retrieved successfully",
  "data": [
    {
      "id": "rel_001",
      "type": "KNOWS",
      "properties": {...}
    }
  ],
  "count": 1
}
```

### 3.14 更新关系

**接口**: `PUT /api/graph/relationships/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "relationship_id": "rel_001",
  "properties": {
    "weight": 0.9,
    "updated_at": "2024-01-01"
  }
}
```

**响应示例**:
```json
{
  "message": "Relationship updated successfully",
  "data": [...],
  "summary": {
    "properties_set": 2
  }
}
```

### 3.15 删除关系

**接口**: `DELETE /api/graph/relationships/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "relationship_id": "rel_001"
}
```

**响应示例**:
```json
{
  "message": "Relationship deleted successfully",
  "summary": {
    "relationships_deleted": 1
  }
}
```

### 3.16 图谱分析

**接口**: `POST /api/graph/analysis/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**最短路径分析**:
```json
{
  "analysis_type": "shortest_path",
  "parameters": {
    "source_node": "node_001",
    "target_node": "node_002",
    "max_depth": 5
  }
}
```

**响应示例**:
```json
{
  "analysis_type": "shortest_path",
  "graph": {
    "nodes": [...],
    "links": [...]
  },
  "meta": {
    "source": "node_001",
    "target": "node_002",
    "max_depth": 5,
    "steps_found": 3
  }
}
```

**K跳邻居分析**:
```json
{
  "analysis_type": "k_hop_neighbors",
  "parameters": {
    "node_id": "node_001",
    "hops": 2,
    "limit": 100
  }
}
```

**响应示例**:
```json
{
  "analysis_type": "k_hop_neighbors",
  "graph": {
    "nodes": [...],
    "links": [...]
  },
  "meta": {
    "node_id": "node_001",
    "hops": 2,
    "limit": 100,
    "returned_nodes": 85
  }
}
```

**中心性分析**:
```json
{
  "analysis_type": "centrality",
  "parameters": {
    "limit": 20
  }
}
```

**响应示例**:
```json
{
  "analysis_type": "centrality",
  "metrics": {
    "degree": [
      {
        "id": "node_001",
        "name": "张三",
        "degree": 25,
        "labels": ["Person"]
      }
    ]
  },
  "meta": {
    "limit": 20
  }
}
```

### 3.17 图谱统计

**接口**: `GET /api/graph/statistics/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `stat_type`: 统计类型 (可选: node_distribution, relationship_distribution, basic_stats, degree_distribution, components)

**响应示例**:
```json
{
  "stat_type": "basic_stats",
  "results": [
    {
      "total_nodes": 500,
      "total_relationships": 800,
      "node_labels": 10,
      "relationship_types": 15
    }
  ],
  "count": 1
}
```

### 3.18 复杂查询

**接口**: `POST /api/graph/query/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**组合过滤查询**:
```json
{
  "query_type": "composite",
  "parameters": {
    "node_labels": ["Person", "Organization"],
    "relationship_types": ["WORKS_FOR"],
    "search": "诈骗",
    "limit": 100
  }
}
```

**时间范围查询**:
```json
{
  "query_type": "time_range",
  "parameters": {
    "start_time": "2023-01-01",
    "end_time": "2024-01-01",
    "limit": 100
  }
}
```

**多跳查询**:
```json
{
  "query_type": "multi_hop",
  "parameters": {
    "node_id": "node_001",
    "hops": 3,
    "limit": 150
  }
}
```

**响应示例**:
```json
{
  "graph": {
    "nodes": [...],
    "links": [...]
  },
  "meta": {
    "query_type": "composite",
    "limit": 100,
    "filters": {...}
  }
}
```


---

## 社区功能API

### 4.1 获取社区列表

**接口**: `GET /api/community/communities/`

**权限**: 公开访问

**响应示例**:
```json
[
  {
    "id": 1,
    "name": "反诈骗交流社区",
    "slug": "anti-fraud",
    "description": "分享反诈骗经验和案例",
    "is_private": false,
    "member_count": 150,
    "post_count": 300,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### 4.2 获取社区详情

**接口**: `GET /api/community/communities/{slug}/`

**权限**: 公开访问

**响应示例**:
```json
{
  "id": 1,
  "name": "反诈骗交流社区",
  "slug": "anti-fraud",
  "description": "分享反诈骗经验和案例",
  "is_private": false,
  "member_count": 150,
  "post_count": 300,
  "created_by": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "user_role": "member"
}
```

### 4.3 创建社区

**接口**: `POST /api/community/communities/`

**权限**: 需要管理员权限

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "name": "新社区",
  "slug": "new-community",
  "description": "社区描述",
  "is_private": false
}
```

**响应示例**:
```json
{
  "id": 2,
  "name": "新社区",
  "slug": "new-community",
  "description": "社区描述",
  "is_private": false,
  "member_count": 1,
  "post_count": 0,
  "created_at": "2024-01-15T10:00:00Z"
}
```

### 4.4 加入社区

**接口**: `POST /api/community/communities/{slug}/join/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "role": "member"
}
```

### 4.5 退出社区

**接口**: `POST /api/community/communities/{slug}/leave/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应**: 204 No Content

### 4.6 获取社区成员

**接口**: `GET /api/community/communities/{slug}/members/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "testuser01",
      "nickname": "测试用户",
      "avatar_url": ""
    },
    "role": "admin",
    "joined_at": "2024-01-01T00:00:00Z"
  }
]
```

### 4.7 设置成员角色

**接口**: `POST /api/community/communities/{slug}/set_role/`

**权限**: 需要社区管理员权限

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "user_id": 2,
  "role": "moderator"
}
```

**响应示例**:
```json
{
  "role": "moderator"
}
```

### 4.8 获取帖子列表

**接口**: `GET /api/community/posts/`

**权限**: 公开访问

**查询参数**:
- `community`: 社区slug或ID
- `author`: 作者用户名

**响应示例**:
```json
[
  {
    "id": 1,
    "title": "警惕电信诈骗新手法",
    "content": "最近发现一种新的电信诈骗手法...",
    "author": {
      "id": 1,
      "username": "testuser01",
      "nickname": "测试用户",
      "avatar_url": ""
    },
    "community": {
      "id": 1,
      "name": "反诈骗交流社区",
      "slug": "anti-fraud"
    },
    "images": [
      {
        "id": 1,
        "image": "http://localhost:8000/media/posts/image1.jpg",
        "order": 0
      }
    ],
    "like_count": 15,
    "comment_count": 8,
    "is_pinned": false,
    "user_liked": false,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

### 4.9 获取帖子详情

**接口**: `GET /api/community/posts/{id}/`

**权限**: 公开访问

**响应示例**:
```json
{
  "id": 1,
  "title": "警惕电信诈骗新手法",
  "content": "最近发现一种新的电信诈骗手法...",
  "author": {...},
  "community": {...},
  "images": [...],
  "comments": [
    {
      "id": 1,
      "content": "感谢分享！",
      "author": {...},
      "like_count": 3,
      "reply_count": 1,
      "user_liked": false,
      "created_at": "2024-01-15T11:00:00Z"
    }
  ],
  "like_count": 15,
  "comment_count": 8,
  "is_pinned": false,
  "user_liked": false,
  "created_at": "2024-01-15T10:00:00Z"
}
```

### 4.10 创建帖子

**接口**: `POST /api/community/posts/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: multipart/form-data
```

**请求体** (form-data):
```
title: 帖子标题
content: 帖子内容
community: 1
images: [文件1, 文件2]
```

**响应示例**:
```json
{
  "id": 2,
  "title": "帖子标题",
  "content": "帖子内容",
  "author": {...},
  "community": {...},
  "images": [...],
  "like_count": 0,
  "comment_count": 0,
  "created_at": "2024-01-16T10:00:00Z"
}
```

### 4.11 更新帖子

**接口**: `PUT /api/community/posts/{id}/` 或 `PATCH /api/community/posts/{id}/`

**权限**: 需要认证（作者或版主）

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

**响应示例**:
```json
{
  "id": 2,
  "title": "更新后的标题",
  "content": "更新后的内容",
  ...
}
```

### 4.12 删除帖子

**接口**: `DELETE /api/community/posts/{id}/`

**权限**: 需要认证（作者或版主）

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应**: 204 No Content

### 4.13 点赞/取消点赞帖子

**接口**: `POST /api/community/posts/{id}/like/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "liked": true,
  "like_count": 16
}
```

### 4.14 获取评论列表

**接口**: `GET /api/community/comments/`

**权限**: 公开访问

**查询参数**:
- `post`: 帖子ID
- `parent`: 父评论ID

**响应示例**:
```json
[
  {
    "id": 1,
    "content": "感谢分享！",
    "author": {
      "id": 2,
      "username": "user02",
      "nickname": "用户02",
      "avatar_url": ""
    },
    "post": 1,
    "parent": null,
    "like_count": 3,
    "reply_count": 1,
    "user_liked": false,
    "created_at": "2024-01-15T11:00:00Z"
  }
]
```

### 4.15 创建评论

**接口**: `POST /api/community/comments/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "post": 1,
  "content": "这是一条评论",
  "parent": null
}
```

**回复评论**:
```json
{
  "post": 1,
  "content": "这是一条回复",
  "parent": 1
}
```

**响应示例**:
```json
{
  "id": 2,
  "content": "这是一条评论",
  "author": {...},
  "post": 1,
  "parent": null,
  "like_count": 0,
  "reply_count": 0,
  "created_at": "2024-01-16T12:00:00Z"
}
```

### 4.16 删除评论

**接口**: `DELETE /api/community/comments/{id}/`

**权限**: 需要认证（作者或版主）

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应**: 204 No Content

### 4.17 点赞/取消点赞评论

**接口**: `POST /api/community/comments/{id}/like/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "liked": true,
  "like_count": 4
}
```

### 4.18 获取用户帖子

**接口**: `GET /api/community/users/{username}/posts/`

**权限**: 公开访问

**响应示例**:
```json
[
  {
    "id": 1,
    "title": "警惕电信诈骗新手法",
    "content": "...",
    ...
  }
]
```

### 4.19 获取用户公开资料

**接口**: `GET /api/community/users/{username}/`

**权限**: 公开访问

**响应示例**:
```json
{
  "id": 1,
  "username": "testuser01",
  "nickname": "测试用户",
  "bio": "个人简介",
  "avatar_url": "https://example.com/avatar.jpg",
  "date_joined": "2024-01-01T00:00:00Z",
  "post_count": 15,
  "profile_visibility": "public"
}
```

---

## 聊天API

### 5.1 场景对话（有状态）

**接口**: `POST /api/chat/scenario/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "message": "你好",
  "scenario_type": "telecom_fraud",
  "difficulty": "medium",
  "mode": "training",
  "session_id": "session_12345"
}
```

**响应示例**:
```json
{
  "response": "你好，我是XX银行客服，您的账户存在异常...",
  "score": 85,
  "session_id": "session_12345",
  "turn_count": 5,
  "session_ended": false,
  "end_reason": null,
  "feedback": "表现良好，继续保持警惕"
}
```

### 5.2 场景对话（无状态）

**接口**: `POST /api/chat/scenario/stateless/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "message": "你好",
  "scenario_type": "telecom_fraud",
  "difficulty": "hard",
  "history": [
    {"role": "user", "content": "什么事？"},
    {"role": "assistant", "content": "你好，我是XX银行客服..."}
  ]
}
```

**响应示例**:
```json
{
  "response": "请提供您的银行卡号以便核实",
  "analysis": {
    "risk_level": "high",
    "warning": "正在诱导提供敏感信息"
  }
}
```

### 5.3 获取对话历史

**接口**: `GET /api/chat/history/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `session_id`: 会话ID (可选)
- `limit`: 返回数量 (可选)

**响应示例**:
```json
{
  "history": [
    {
      "session_id": "session_12345",
      "scenario_type": "telecom_fraud",
      "messages": [
        {"role": "user", "content": "你好"},
        {"role": "assistant", "content": "你好，我是XX银行客服..."}
      ],
      "final_score": 85,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "count": 1
}
```

### 5.4 获取会话列表

**接口**: `GET /api/chat/sessions/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "sessions": [
    {
      "session_id": "session_12345",
      "scenario_type": "telecom_fraud",
      "difficulty": "medium",
      "turn_count": 12,
      "final_score": 85,
      "ended": true,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### 5.5 生成演练报告

**接口**: `POST /api/chat/generate-report/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "session_id": "session_12345",
  "scenario_type": "telecom_fraud",
  "difficulty": "medium",
  "mode": "training",
  "final_score": 85,
  "conversation_rounds": 12,
  "end_reason": "score_high"
}
```

**响应示例**:
```json
{
  "report": {
    "performance_analysis": "你在本轮"电信诈骗"演练中的表现较为稳健，最终得分 85 分...",
    "suggestions": "继续保持质疑意识，并多练习识别不同渠道的骗术...",
    "capability_profile": {
      "risk_discernment": 85,
      "info_protection": 81,
      "response_speed": 78,
      "emotional_control": 80,
      "verification_skill": 83
    }
  }
}
```

### 5.6 获取最新演练结果

**接口**: `GET /api/chat/latest-result/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "session_id": "session_12345",
  "scenario_type": "telecom_fraud",
  "difficulty": "medium",
  "mode": "training",
  "final_score": 85,
  "conversation_rounds": 12,
  "end_reason": "score_high",
  "report": {...},
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 5.7 风险分析

**接口**: `POST /api/chat/knowledge/risk-analysis/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "message": "有人让我提供银行卡号和密码",
  "context": {
    "channel": "phone",
    "claimed_identity": "bank_staff"
  }
}
```

**响应示例**:
```json
{
  "risk_level": "high",
  "fraud_type": "telecom_fraud",
  "confidence": 0.95,
  "warning": "高风险！对方正在诱导您提供敏感信息",
  "suggestions": [
    "不要提供任何银行卡信息",
    "立即挂断电话",
    "通过官方渠道联系银行核实"
  ],
  "related_cases": [...]
}
```

### 5.8 获取诈骗类型信息

**接口**: `GET /api/chat/knowledge/fraud-type/{fraud_type_name}/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "name": "电信诈骗",
  "description": "通过电话、短信等方式实施的诈骗",
  "common_tactics": [
    "冒充银行客服",
    "冒充公检法",
    "虚假中奖信息"
  ],
  "prevention_tips": [
    "不轻信陌生电话",
    "不向陌生人透露个人信息",
    "及时核实身份"
  ],
  "case_count": 150
}
```

### 5.9 知识搜索

**接口**: `GET /api/chat/knowledge/search/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `query`: 搜索关键词 (必需)
- `limit`: 返回数量 (可选)

**响应示例**:
```json
{
  "query": "电信诈骗",
  "results": [
    {
      "type": "fraud_type",
      "name": "电信诈骗",
      "description": "...",
      "relevance": 0.95
    },
    {
      "type": "case",
      "title": "电信诈骗案例001",
      "summary": "...",
      "relevance": 0.88
    }
  ],
  "count": 2
}
```

### 5.10 获取防范建议

**接口**: `GET /api/chat/knowledge/prevention-suggestions/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `scenario`: 场景类型 (可选)

**响应示例**:
```json
{
  "suggestions": [
    {
      "category": "个人信息保护",
      "tips": [
        "不向陌生人透露银行卡号、密码等信息",
        "定期更换重要账户密码"
      ]
    },
    {
      "category": "识别技巧",
      "tips": [
        "核实来电者身份",
        "警惕要求转账的电话"
      ]
    }
  ]
}
```

### 5.11 获取诈骗类型列表

**接口**: `GET /api/chat/knowledge/fraud-types/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "fraud_types": [
    {
      "name": "电信诈骗",
      "case_count": 150,
      "risk_level": "high"
    },
    {
      "name": "网络诈骗",
      "case_count": 200,
      "risk_level": "high"
    }
  ],
  "count": 2
}
```

### 5.12 获取知识图谱统计

**接口**: `GET /api/chat/knowledge/stats/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "total_fraud_types": 10,
  "total_cases": 500,
  "total_entities": 1500,
  "high_risk_types": 3,
  "updated_at": "2024-01-15T00:00:00Z"
}
```


---

## 测验API

### 6.1 获取题目列表

**接口**: `GET /api/quiz/questions/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `level`: 难度级别 (可选: easy, medium, hard)
- `limit`: 返回数量 (默认: 10)

**响应示例**:
```json
[
  {
    "id": 1,
    "question_text": "以下哪种情况最可能是电信诈骗？",
    "choice_a": "银行通过官方渠道通知",
    "choice_b": "陌生电话要求提供银行卡信息",
    "choice_c": "银行柜台办理业务",
    "choice_d": "官方APP操作",
    "level": "easy",
    "category": "telecom_fraud"
  }
]
```

### 6.2 开始测验会话

**接口**: `POST /api/quiz/start/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "level": "medium",
  "limit": 5
}
```

**响应示例**:
```json
{
  "session_id": 12345,
  "level": "medium",
  "total_questions": 5,
  "questions": [
    {
      "id": 1,
      "question_text": "以下哪种情况最可能是电信诈骗？",
      "choice_a": "银行通过官方渠道通知",
      "choice_b": "陌生电话要求提供银行卡信息",
      "choice_c": "银行柜台办理业务",
      "choice_d": "官方APP操作",
      "level": "medium",
      "category": "telecom_fraud"
    }
  ]
}
```

### 6.3 提交答题

**接口**: `POST /api/quiz/submit/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "session_id": 12345,
  "level": "medium",
  "answers": {
    "1": "B",
    "2": "C",
    "3": "A",
    "4": "B",
    "5": "D"
  }
}
```

**响应示例**:
```json
{
  "attempt_id": 100,
  "session_id": 12345,
  "score": 80,
  "correct_answers": 4,
  "total_questions": 5,
  "accuracy": 80.0,
  "question_results": [
    {
      "question_id": 1,
      "user_answer": "B",
      "correct_answer": "B",
      "is_correct": true
    },
    {
      "question_id": 2,
      "user_answer": "C",
      "correct_answer": "C",
      "is_correct": true
    },
    {
      "question_id": 3,
      "user_answer": "A",
      "correct_answer": "B",
      "is_correct": false
    },
    {
      "question_id": 4,
      "user_answer": "B",
      "correct_answer": "B",
      "is_correct": true
    },
    {
      "question_id": 5,
      "user_answer": "D",
      "correct_answer": "D",
      "is_correct": true
    }
  ]
}
```

### 6.4 获取答题历史

**接口**: `GET /api/quiz/history/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
[
  {
    "id": 100,
    "level": "medium",
    "score": 80,
    "total_questions": 5,
    "correct_answers": 4,
    "accuracy": 80.0,
    "created_at": "2024-01-15T10:00:00Z"
  },
  {
    "id": 99,
    "level": "easy",
    "score": 100,
    "total_questions": 5,
    "correct_answers": 5,
    "accuracy": 100.0,
    "created_at": "2024-01-14T15:00:00Z"
  }
]
```

### 6.5 获取测验统计

**接口**: `GET /api/quiz/stats/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "total_attempts": 25,
  "average_score": 78.5,
  "best_score": 100,
  "recent_attempts": [
    {
      "id": 100,
      "level": "medium",
      "score": 80,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "level_stats": {
    "easy": {
      "attempts": 10,
      "average_score": 92.0,
      "best_score": 100
    },
    "medium": {
      "attempts": 10,
      "average_score": 75.0,
      "best_score": 90
    },
    "hard": {
      "attempts": 5,
      "average_score": 60.0,
      "best_score": 70
    }
  }
}
```

### 6.6 管理员 - 获取题目列表

**接口**: `GET /api/quiz/admin/questions/`

**权限**: 需要管理员权限

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**查询参数**:
- `level`: 难度过滤 (可选)
- `category`: 类别过滤 (可选)

**响应示例**:
```json
[
  {
    "id": 1,
    "question_text": "以下哪种情况最可能是电信诈骗？",
    "choice_a": "银行通过官方渠道通知",
    "choice_b": "陌生电话要求提供银行卡信息",
    "choice_c": "银行柜台办理业务",
    "choice_d": "官方APP操作",
    "correct_answer": "B",
    "level": "easy",
    "category": "telecom_fraud",
    "explanation": "陌生电话要求提供敏感信息是典型的诈骗手法",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### 6.7 管理员 - 创建题目

**接口**: `POST /api/quiz/admin/questions/`

**权限**: 需要管理员权限

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**请求体**:
```json
{
  "question_text": "新题目内容",
  "choice_a": "选项A",
  "choice_b": "选项B",
  "choice_c": "选项C",
  "choice_d": "选项D",
  "correct_answer": "B",
  "level": "medium",
  "category": "online_fraud",
  "explanation": "解释说明",
  "is_active": true
}
```

**响应示例**:
```json
{
  "id": 51,
  "question_text": "新题目内容",
  "choice_a": "选项A",
  "choice_b": "选项B",
  "choice_c": "选项C",
  "choice_d": "选项D",
  "correct_answer": "B",
  "level": "medium",
  "category": "online_fraud",
  "explanation": "解释说明",
  "is_active": true,
  "created_at": "2024-01-16T10:00:00Z"
}
```

### 6.8 管理员 - 获取/更新/删除题目

**接口**: `GET /api/quiz/admin/questions/{id}/`

**权限**: 需要管理员权限

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**更新题目**: `PUT /api/quiz/admin/questions/{id}/` 或 `PATCH /api/quiz/admin/questions/{id}/`

**删除题目**: `DELETE /api/quiz/admin/questions/{id}/`

### 6.9 管理员 - 获取测验统计

**接口**: `GET /api/quiz/admin/stats/`

**权限**: 需要管理员权限

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "total_questions": 50,
  "total_attempts": 500,
  "total_users": 100,
  "average_score": 75.5,
  "level_distribution": {
    "easy": 20,
    "medium": 20,
    "hard": 10
  },
  "category_distribution": {
    "telecom_fraud": 15,
    "online_fraud": 20,
    "investment_fraud": 15
  },
  "recent_attempts": [...]
}
```

---

## 通知API

### 7.1 获取通知列表

**接口**: `GET /api/notifications/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
[
  {
    "id": 1,
    "notification_type": "new_reply",
    "sender": {
      "id": 2,
      "username": "user02",
      "nickname": "用户02",
      "avatar_url": ""
    },
    "post": {
      "id": 1,
      "title": "警惕电信诈骗新手法"
    },
    "comment": {
      "id": 5,
      "content": "感谢分享！"
    },
    "message": "用户02 回复了你的帖子",
    "is_read": false,
    "created_at": "2024-01-16T10:00:00Z"
  },
  {
    "id": 2,
    "notification_type": "new_like",
    "sender": {
      "id": 3,
      "username": "user03",
      "nickname": "用户03",
      "avatar_url": ""
    },
    "post": {
      "id": 1,
      "title": "警惕电信诈骗新手法"
    },
    "comment": null,
    "message": "用户03 点赞了你的帖子",
    "is_read": false,
    "created_at": "2024-01-16T09:00:00Z"
  }
]
```

### 7.2 获取通知详情

**接口**: `GET /api/notifications/{id}/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "id": 1,
  "notification_type": "new_reply",
  "sender": {
    "id": 2,
    "username": "user02",
    "nickname": "用户02",
    "avatar_url": ""
  },
  "post": {
    "id": 1,
    "title": "警惕电信诈骗新手法",
    "content": "..."
  },
  "comment": {
    "id": 5,
    "content": "感谢分享！",
    "author": {...}
  },
  "message": "用户02 回复了你的帖子",
  "is_read": false,
  "created_at": "2024-01-16T10:00:00Z"
}
```

### 7.3 获取未读通知数量

**接口**: `GET /api/notifications/unread-count/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应示例**:
```json
{
  "unread_count": 5
}
```

### 7.4 标记单个通知为已读

**接口**: `POST /api/notifications/{id}/mark-as-read/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应**: 204 No Content

### 7.5 标记所有通知为已读

**接口**: `POST /api/notifications/mark-all-as-read/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应**: 204 No Content

### 7.6 删除所有通知

**接口**: `DELETE /api/notifications/delete-all/`

**权限**: 需要认证

**请求头**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**响应**: 204 No Content

---

## 附录

### 通用错误响应

#### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "details": "Missing required field: username"
}
```

#### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

#### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

#### 404 Not Found
```json
{
  "detail": "Not found."
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred"
}
```

### 通知类型说明

| 类型 | 说明 |
|------|------|
| `new_reply` | 新回复 |
| `new_like` | 新点赞 |
| `new_comment` | 新评论 |
| `mention` | 被提及 |
| `system` | 系统通知 |

### 用户类型说明

| 类型 | 说明 |
|------|------|
| `regular` | 普通用户 |
| `admin` | 管理员 |
| `moderator` | 版主 |

### 测验难度级别

| 级别 | 说明 |
|------|------|
| `easy` | 简单 |
| `medium` | 中等 |
| `hard` | 困难 |

### 场景类型

| 类型 | 说明 |
|------|------|
| `telecom_fraud` | 电信诈骗 |
| `online_fraud` | 网络诈骗 |
| `investment_fraud` | 投资诈骗 |
| `impersonation_fraud` | 冒充诈骗 |

### 测试建议

1. **认证测试**：首先测试用户注册、登录功能，获取有效的JWT Token
2. **权限测试**：测试需要认证的接口是否正确验证Token
3. **CRUD测试**：测试创建、读取、更新、删除操作的完整流程
4. **边界测试**：测试参数的边界值，如limit的最大最小值
5. **错误处理**：测试各种错误情况的响应是否符合预期
6. **并发测试**：测试多用户同时操作的情况
7. **性能测试**：测试接口响应时间和吞吐量

### 测试工具推荐

- **Postman**: 可视化API测试工具
- **curl**: 命令行HTTP客户端
- **HTTPie**: 更友好的命令行HTTP客户端
- **pytest**: Python自动化测试框架
- **JMeter**: 性能和负载测试工具

### 示例curl命令

**登录获取Token**:
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser01",
    "password": "Test@123456"
  }'
```

**使用Token访问API**:
```bash
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**创建帖子**:
```bash
curl -X POST http://localhost:8000/api/community/posts/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: multipart/form-data" \
  -F "title=测试帖子" \
  -F "content=这是测试内容" \
  -F "community=1" \
  -F "images=@/path/to/image.jpg"
```

---

**文档版本**: v1.0  
**最后更新**: 2024-01-16  
**维护者**: MVP后端团队

