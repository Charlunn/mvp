#!/usr/bin/env python3
"""
统一的 Neo4j 初始化脚本：
- 默认只写入 KnowledgeBackend 版本的 legacy 示例数据
- 如需原 MVP 的 backend/neo4j/seed.cypher，可通过 --dataset=file 或 both 显式启用
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Dict

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
sys.path.insert(0, str(BACKEND_DIR))

try:
    from scripts.neo4j_seed import seed_neo4j
    from scripts.legacy_sample_data import seed_legacy_data
except ImportError as exc:  # pragma: no cover - informative error only
    raise SystemExit(
        "缺少 backend/scripts 里的 seeding 模块或其依赖。请先执行 `cd mvp/backend && pip install -r requirements.txt`。"
    ) from exc

DEFAULT_ENV = ROOT_DIR / ".env"
SEED_FILE = BACKEND_DIR / "neo4j" / "seed.cypher"


def load_env_file(path: Path) -> Dict[str, str]:
    """
    简单的 .env 文件解析器
    解析格式为 key=value 的环境变量文件，忽略空行和注释行
    
    Args:
        path: .env 文件路径
        
    Returns:
        包含环境变量键值对的字典
    """
    data: Dict[str, str] = {}
    if not path.exists():
        return data

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        # 跳过空行、注释行和不包含等号的行
        if not line or line.startswith("#") or "=" not in line:
            continue
        # 分割键值对，只在第一个等号处分割
        key, value = line.split("=", 1)
        data[key.strip()] = value.strip()
    return data


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="向 Neo4j 写入 legacy 示例数据（可选追加 seed.cypher）。")
    parser.add_argument("--env-file", default=str(DEFAULT_ENV), help="提供 Neo4j 凭据的 .env 文件路径。")
    parser.add_argument("--uri", help="Neo4j bolt URI，优先于 .env。")
    parser.add_argument("--user", help="Neo4j 用户名，优先于 .env。")
    parser.add_argument("--password", help="Neo4j 密码，优先于 .env。")
    parser.add_argument("--database", help="Neo4j 数据库名，优先于 .env。")
    parser.add_argument("--seed", default=str(SEED_FILE), help="待执行的 Cypher 种子文件。")
    parser.add_argument(
        "--dataset",
        choices=("file", "legacy", "both"),
        default="legacy",
        help="选择要导入的数据集（默认 legacy）：file=seed.cypher，legacy=KnowledgeBackend 示例，both=先 file 再 legacy。",
    )
    return parser.parse_args()


def main() -> None:
    """
    主函数：初始化 Neo4j 数据库
    
    功能流程：
    1. 解析命令行参数
    2. 加载 .env 文件中的配置
    3. 根据 dataset 参数决定导入哪些数据
       - file: 导入 seed.cypher 文件中的数据
       - legacy: 导入 legacy 示例数据
       - both: 先导入 file，再导入 legacy
    """
    args = parse_args()

    # 加载环境变量文件
    env_values = load_env_file(Path(args.env_file))
    
    # 获取 Neo4j 连接配置，优先级：命令行参数 > .env 文件 > 默认值
    uri = args.uri or env_values.get("NEO4J_URI") or "bolt://localhost:7687"
    user = args.user or env_values.get("NEO4J_USERNAME") or "neo4j"
    password = args.password or env_values.get("NEO4J_PASSWORD") or "neo4j"
    database = args.database or env_values.get("NEO4J_DATABASE") or "neo4j"

    seed_path = Path(args.seed)
    dataset = args.dataset
    ran_any = False

    # 根据 dataset 参数决定导入哪些数据
    if dataset in ("file", "both"):
        # 导入 seed.cypher 文件中的数据
        seed_neo4j(
            uri=uri,
            user=user,
            password=password,
            database=database,
            seed_path=seed_path,
        )
        ran_any = True

    if dataset in ("legacy", "both"):
        # 导入 legacy 示例数据（知识图谱节点和关系）
        seed_legacy_data(
            uri=uri,
            user=user,
            password=password,
            database=database,
        )
        ran_any = True

    if not ran_any:
        raise SystemExit("未选择任何数据集。使用 --dataset=file|legacy|both。")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:  # pragma: no cover - user convenience
        sys.exit("用户中断。")
