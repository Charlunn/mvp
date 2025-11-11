# AntiFraud MVP

这是一个聚焦反欺诈知识平台核心流程的精简交付版本（MVP），整合了后端 Django、前端 Nuxt 以及 Neo4j 图数据库能力，便于团队快速演示与验证以下功能：

- **知识演练**：支持普通用户刷题、管理员维护题库。
- **AI 情景模拟与报告**：提供对话式演练，并自动生成训练评估报告。
- **知识图谱可视化**：采用 shadcn 风格组件实现黑白主题的交互界面。
- **基础用户体系**：注册、登录、个人中心与统计概览。

## 项目结构

```text
mvp/
├── backend/            # Django + DRF + Neo4j 适配层
├── frontend/           # Nuxt 3 + TypeScript + Pinia + Tailwind
├── docker-compose.yml  # 本地开发环境编排
├── docker-compose.prod.yml
└── README.md
```

### 后端（backend）
- 技术栈：**Django 5、Django REST Framework、SimpleJWT**。
- 保留子应用：`users`、`quiz`、`chatapi`、`graph_api`、`utils`。
- 数据库：默认 PostgreSQL（Docker），本地可回退至 SQLite。
- 内置 Neo4j 驱动，用于图谱与 AI 风险分析接口。
- `.env.example` 位于 `backend/`，复制为 `.env` 后再启动服务。

### 前端（frontend）
- 技术栈：**Nuxt 3、TypeScript、Pinia、Tailwind CSS**。
- UI：重用 shadcn-vue 原子组件，并统一黑白配色。
- 页面：`/login`、`/`（仪表盘）、`/quiz`、`/simulation`、`/graph`、`/profile`。
- `plugins/api.ts` 中的 Axios 封装负责附加授权头及 401 清理逻辑。

## 使用 Docker Compose 运行

1. **准备环境变量**
   ```bash
   cd mvp/backend
   cp .env.example .env
   # 根据需要更新 DASHSCOPE_API_KEY、数据库密码等敏感信息
   ```

2. **启动全部服务**
   ```bash
   cd mvp
   docker compose up --build
   ```
   - 后端接口：http://localhost:8000
   - 前端页面：http://localhost:3100（浏览器直接访问后端时命中 http://localhost:8000/api，容器内 SSR 则通过 http://backend:8000/api）
   - Neo4j Browser：http://localhost:7474

3. **执行迁移并创建超级用户**（在后端容器中执行一次）
   ```bash
   docker compose exec backend python manage.py migrate
   docker compose exec backend python manage.py createsuperuser
   ```

4. **初始化 Neo4j 示例数据**
   ```bash
   cd mvp
   python init_neo4j.py
   # 如需覆盖默认连接信息，可附加参数：
   # python init_neo4j.py --uri bolt://localhost:7687 --user neo4j --password mypass
   ```
   该脚本会自动读取根目录 `.env` 中的 `NEO4J_*` 配置，并执行 `backend/neo4j/seed.cypher`，一次性写入三类主体（投资机构 / 风险事件 / 感知信号）及其关联，随后即可在 `/graph` 页面查看可视化效果。

5. **导入测验题目**
   ```bash
   cd mvp/backend
   python scripts/seed_quiz_questions.py           # 导入示例题目
   python scripts/seed_quiz_questions.py --reset  # 先清空后重新导入
   ```
   脚本会通过 `update_or_create` 重复导入，方便在本地或测试环境快速填充题库。

## 生产部署

`docker-compose.prod.yml` 提供了可落地的生产级编排，包含 Postgres、Neo4j、Django（Gunicorn）、Nuxt（SSR）与 Nginx 反向代理。启动方式如下：

```bash
cd mvp
docker compose -f docker-compose.prod.yml up -d --build
```

- Postgres / Neo4j 使用持久化卷，首次启动时自动创建。
- backend 容器会在启动后自动执行 `migrate`、`collectstatic`，导入题库、确保默认管理员 Charlun 存在，并在 Neo4j 准备就绪后导入 `backend/neo4j/seed.cypher`（legacy + Cypher 双数据源）。
- frontend 容器运行 Nuxt Node 服务，Nginx 监听 `:80`，将 `/api/*` 代理至 Django，其余请求转发给 Nuxt，浏览器访问 `http://<服务器 IP>/` 即可。

## 关键 API

| 模块 | Endpoint | 说明 |
| ---- | -------- | ---- |
| Auth | `POST /api/users/login/` | 用户名 / 邮箱 / 手机号登录，返回 JWT |
| Users | `GET/PUT /api/users/profile/` | 用户基本资料及头像地址 |
| Quiz | `GET /api/quiz/questions/` | 支持难度、数量筛选 |
| Quiz 管理 | `POST /api/quiz/admin/questions/` | 管理员（`user_type == 'admin'`）维护题库 |
| Simulation | `POST /api/chat/` | 会话式 AI 情景模拟，返回评分与对话内容 |
| Simulation | `POST /api/chat/generate-report/` | 根据对话生成文字分析报告 |
| Graph | `GET /api/graph/initial/` | 获取初始图谱数据，用于前端 ECharts 可视化 |

## 前端路由速览

| 路由 | 作用 |
| ---- | ---- |
| `/login` | 极简登录页（黑白主题 shadcn 卡片） |
| `/` | 仪表盘：统计卡片 + 快捷入口 |
| `/quiz` | 测验执行与题库管理界面 |
| `/simulation` | AI 反欺诈对话与报告生成 |
| `/graph` | 力导向图谱视图 + 搜索 |
| `/profile` | 个人资料与通知设置 |

## 开发建议

- **后端**：在 `mvp/backend` 中执行 `python manage.py runserver` 可快速调试（默认使用 SQLite）。
- **前端**：进入 `mvp/frontend` 执行 `npm install && npm run dev`（端口 3100，代理 `/api`）。
- **管理员与测验**：任意 `createsuperuser` 或 `is_staff` 账号自动拥有测验管理权限，可按需将 `user_type` 设置为 `admin`；`python backend/scripts/seed_quiz_questions.py` 可重复导入预置题目。

## 后续可选迭代

- 替换临时的 `window.alert` 为正式的通知组件。
- 前端加入刷新 Token 的流程（目前 401 时仅清理 Cookie）。
- 在图谱侧边栏补充更多筛选条件，例如主体类型、地区等。
