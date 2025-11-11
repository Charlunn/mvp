from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import List, Optional, Tuple

from neo4j import GraphDatabase  # type: ignore


BASE_DIR = Path(__file__).resolve().parents[1]
SEED_FILE = BASE_DIR / "neo4j" / "seed.cypher"
SCHEMA_PREFIXES = (
    "CREATE CONSTRAINT",
    "DROP CONSTRAINT",
    "CREATE INDEX",
    "DROP INDEX",
)


def _statement_lead(statement: str) -> str:
    """
    Return the first meaningful (non-comment) line of a Cypher statement.
    """
    for line in statement.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("//"):
            continue
        return stripped
    return ""


def _is_schema_statement(statement: str) -> bool:
    lead = _statement_lead(statement)
    if not lead:
        return False
    return lead.upper().startswith(SCHEMA_PREFIXES)


def _split_cypher_statements(script: str) -> List[str]:
    """
    Split a Cypher script into executable statements by ';' while respecting string literals.
    """
    text = script.replace("\r\n", "\n").replace("\r", "\n")
    statements: List[str] = []
    buffer: List[str] = []
    in_single = False
    in_double = False
    prev_char = ""

    for char in text:
        if char == "'" and not in_double and prev_char != "\\":
            in_single = not in_single
        elif char == '"' and not in_single and prev_char != "\\":
            in_double = not in_double

        if char == ";" and not in_single and not in_double:
            statement = "".join(buffer).strip()
            if statement:
                statements.append(statement)
            buffer = []
        else:
            buffer.append(char)

        prev_char = char

    tail = "".join(buffer).strip()
    if tail:
        statements.append(tail)

    return statements


def seed_neo4j(
    uri: Optional[str] = None,
    user: Optional[str] = None,
    password: Optional[str] = None,
    database: Optional[str] = None,
    seed_path: Optional[Path] = None,
) -> None:
    """
    Execute the Cypher statements in `seed_path` against the given Neo4j database.
    If parameters are omitted they fall back to environment variables / sensible defaults.
    """
    uri = uri or os.getenv("NEO4J_URI", "bolt://neo4j:7687")
    user = user or os.getenv("NEO4J_USERNAME", "neo4j")
    password = password or os.getenv("NEO4J_PASSWORD", "neo4j")
    database = database or os.getenv("NEO4J_DATABASE", "neo4j")
    seed_path = seed_path or SEED_FILE

    if not seed_path.exists():
        raise FileNotFoundError(f"Seed file not found: {seed_path}")

    cypher = seed_path.read_text(encoding="utf-8")
    if not cypher.strip():
        raise ValueError(f"Seed file {seed_path} is empty.")

    statements = _split_cypher_statements(cypher)
    indexed_statements: List[Tuple[int, str]] = []
    for idx, statement in enumerate(statements, start=1):
        if _statement_lead(statement):
            indexed_statements.append((idx, statement))

    if not indexed_statements:
        raise ValueError(f"Seed file {seed_path} does not contain executable statements.")

    schema_total = sum(1 for _, stmt in indexed_statements if _is_schema_statement(stmt))
    data_total = len(indexed_statements) - schema_total

    seed_display = seed_path.as_posix()
    print(
        f"[neo4j-seed] Applying {len(indexed_statements)} statements "
        f"(schema: {schema_total}, data: {data_total}) from {seed_display} -> {uri} ({database})"
    )

    driver = GraphDatabase.driver(uri, auth=(user, password))

    try:
        with driver.session(database=database) as session:
            pending_data: List[Tuple[int, str]] = []

            def flush_data_block() -> None:
                if not pending_data:
                    return

                block = list(pending_data)
                pending_data.clear()

                def _run_block(tx):
                    for stmt_idx, stmt in block:
                        try:
                            tx.run(stmt)
                        except Exception as exc:  # pragma: no cover - driver errors
                            raise RuntimeError(
                                f"Failed while running data statement #{stmt_idx}:\n{stmt}"
                            ) from exc

                session.execute_write(_run_block)

            for stmt_idx, statement in indexed_statements:
                if _is_schema_statement(statement):
                    flush_data_block()
                    try:
                        session.run(statement).consume()
                    except Exception as exc:  # pragma: no cover - driver errors
                        raise RuntimeError(
                            f"Failed while running schema statement #{stmt_idx}:\n{statement}"
                        ) from exc
                else:
                    pending_data.append((stmt_idx, statement))

            flush_data_block()

    finally:
        driver.close()

    print("[neo4j-seed] Done.")


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed the Neo4j database with predefined data.")
    parser.add_argument("--uri", help="Neo4j bolt URI")
    parser.add_argument("--user", help="Neo4j username")
    parser.add_argument("--password", help="Neo4j password")
    parser.add_argument("--database", help="Neo4j database name")
    parser.add_argument("--seed", type=Path, help="Path to the Cypher seed file")
    return parser.parse_args()


def main() -> None:
    args = _parse_args()
    seed_neo4j(
        uri=args.uri,
        user=args.user,
        password=args.password,
        database=args.database,
        seed_path=args.seed,
    )


if __name__ == "__main__":
    main()
