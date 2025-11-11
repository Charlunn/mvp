# AntiFraud MVP

A stripped-down delivery of the anti-fraud knowledge platform focused on the four features requested for the MVP release:

- **鐭ヨ瘑娴嬮獙**锛氱敤鎴风粌涔犮€佺鐞嗗憳鎵╁厖棰樺簱
- **AI 鍙嶈瘓楠楀満鏅ā鎷?*锛氫細璇濆紡璁粌 + 鑷姩鍖栨姤鍛?- **鐭ヨ瘑鍥捐氨鍙鍖?*锛氶粦鐧?shadcn 椋庢牸鐨勫彲瑙嗗寲鐣岄潰
- **鍩虹鐢ㄦ埛鍔熻兘**锛氭敞鍐?/ 鐧诲綍 / 涓汉涓婚〉 / 缁熻

## Project layout

```
mvp/
鈹溾攢鈹€ backend/        # Django + DRF + Neo4j adapters (trimmed from the main repo)
鈹溾攢鈹€ frontend/       # Nuxt 3 + shadcn-vue rebuild (black & white theme)
鈹溾攢鈹€ docker-compose.yml
鈹斺攢鈹€ README.md
```

### Backend
- Framework: **Django 5 + DRF + SimpleJWT**
- Apps kept from the main system: `users`, `quiz`, `chatapi`, `graph_api`, `utils`
- Database: PostgreSQL (default via Docker) with SQLite fallback for local development
- Neo4j driver embedded for graph + AI risk analysis endpoints
- `.env.example` lives under `backend/`; copy it to `.env` before booting

### Frontend
- Framework: **Nuxt 3 + TypeScript + Pinia + Tailwind**
- UI kit: shadcn-vue primitives (button/card/input/etc.) reused from the main project and rethemed to monochrome
- Pages delivered: `/login`, `/` (dashboard), `/quiz`, `/simulation`, `/graph`, `/profile`
- Axios wrapper (`plugins/api.ts`) handles auth headers & 401 cleanup

## Running with Docker Compose

1. **Env config**
   ```bash
   cd mvp/backend
   cp .env.example .env
   # update secrets/API keys (DASHSCOPE_API_KEY, DB password, etc.)
   ```

2. **Boot all services**
   ```bash
   cd mvp
   docker compose up --build
   ```
   - Backend -> http://localhost:8000
   - Frontend -> http://localhost:3100（浏览器直接命中 http://localhost:8000/api，容器内 SSR 通过 http://backend:8000/api）
   - Neo4j browser -> http://localhost:7474

3. **Django migrations / superuser** (run once inside the backend container)
   ```bash
   docker compose exec backend python manage.py migrate
   docker compose exec backend python manage.py createsuperuser
   ```

4. **Neo4j seed data**
   ```bash
   cd mvp
   python init_neo4j.py
   # 鍙€氳繃鍙傛暟瑕嗙洊榛樿杩炴帴淇℃伅锛屼緥濡傦細
   # python init_neo4j.py --uri bolt://localhost:7687 --user neo4j --password mypass
   ```
   鑴氭湰浼氳嚜鍔ㄨ鍙?`backend/.env` 涓殑 `NEO4J_*` 閰嶇疆锛屽苟鎵ц `backend/neo4j/seed.cypher`锛屼竴娆℃€у啓鍏ヤ笁绫诲吀鍨嬮獥妗堬紙鎶曡祫鐞嗚储 / 鍏娉曞啋鍏?/ 鎯呮劅闄亰锛夊強鍏剁浉鍏冲疄浣擄紙璇堥獥鑰呫€佸彈瀹宠€呫€佸績鐞嗗急鐐广€佽处鎴枫€佹笭閬撱€佷氦鏄撶瓑锛夛紝闅忓悗鍗冲彲鍦?`/graph` 椤甸潰楠岃瘉鍙鍖栨晥鏋溿€?

5. **Quiz seed data**
   ```bash
   cd mvp/backend
   python scripts/seed_quiz_questions.py           # ??/??????
   python scripts/seed_quiz_questions.py --reset  # ?????????
   ```
   ?????????/??/?????????????????????????? update_or_create????????

## Production deployment

涓€涓弬鑰冪殑鐢熶骇绾х紪鎺掍綅浜?`docker-compose.prod.yml`锛屽寘鍚?Postgres銆丯eo4j銆丏jango/Gunicorn銆丯uxt锛圫SR锛夊拰 Nginx 鍙嶅悜浠ｇ悊銆傚惎鍔ㄦ柟寮忥細

```bash
cd mvp
docker compose -f docker-compose.prod.yml up -d --build
```

- Postgres/Neo4j 浣跨敤鎸佷箙鍖栧嵎锛屼細鍦?compose 绗竴娆″惎鍔ㄦ椂鍒涘缓瀹瑰櫒銆?- backend 瀹瑰櫒鐨勫叆鍙ｈ剼鏈細鑷姩鎵ц `migrate` / `collectstatic`锛屽苟鍦?Neo4j 灏辩华鍚庡皾璇曞鍏?`backend/neo4j/seed.cypher`銆?- frontend 瀹瑰櫒杩愯 Nuxt 鐨?Node 鏈嶅姟鍣紝Nginx 鏆撮湶鍦?`:80`锛屽悓鏃跺皢 `/api/*` 浠ｇ悊鍒?Django锛屽叾浠栬姹傝浆鍙戝埌 Nuxt锛屾祻瑙堝櫒璁块棶 `http://<鏈嶅姟鍣↖P>/` 鍗冲彲銆?
## Key API slices

| Area | Endpoint | Notes |
| ---- | -------- | ----- |
| Auth | `POST /api/users/login/` | JWT login (username / email / phone) |
| Users | `GET/PUT /api/users/profile/` | Basic profile + avatar URL |
| Quiz | `GET /api/quiz/questions/` | Level + limit filters |
| Quiz admin | `POST /api/quiz/admin/questions/` | Admin only (`user_type == 'admin'`) |
| Simulation | `POST /api/chat/` | Session-based AI scenario, returns score/messages |
| Simulation | `POST /api/chat/generate-report/` | Generates textual analysis |
| Graph | `GET /api/graph/initial/` | Entry graph payload for the ECharts view |

## Frontend routes

| Route | Purpose |
| ----- | ------- |
| `/login` | Minimal login screen (black/white shadcn card) |
| `/` | Dashboard: stats cards + quick actions |
| `/quiz` | Quiz runner + admin question pane |
| `/simulation` | AI anti-fraud chat surface + report generation |
| `/graph` | Force-directed graph view + search |
| `/profile` | Profile editor & notification toggles |

## Development hints

- **Backend**: `python manage.py runserver` inside `mvp/backend` still works for quick hacking (defaults to SQLite).
- **Frontend**: `npm install && npm run dev` under `mvp/frontend` (port 3100, API proxied via `/api`).
- **Admin seed**: 任意 `createsuperuser` 或 `is_staff` 账号都会自动拥有测验管理权限（仍可按需手动把 `user_type` 设为 `admin`）。
- **Quiz seed**: `python backend/scripts/seed_quiz_questions.py` 可重复导入预置题目，便于本地/测试环境快速填充题库。

## Next steps (optional)
- Add proper toast/snackbar component instead of the temporary `window.alert` helper.
- Wire up refresh-token flow on the frontend (interceptor currently just clears cookies on 401).
- Expand the graph sidebar with metadata filters (types/regions) if needed.


