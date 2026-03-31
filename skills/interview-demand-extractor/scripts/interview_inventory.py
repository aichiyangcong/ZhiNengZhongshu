#!/usr/bin/env python3
"""
Build a lightweight inventory for interview source files.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable

TEXT_EXTENSIONS = {".md", ".txt", ".markdown"}


@dataclass
class InterviewFile:
    path: str
    extension: str
    bytes: int
    lines: int | None
    mtime: str
    sha1_12: str
    text_readable: bool


def sha1_12(raw: bytes) -> str:
    return hashlib.sha1(raw).hexdigest()[:12]


def count_lines_if_text(path: Path, ext: str) -> tuple[bool, int | None]:
    if ext not in TEXT_EXTENSIONS:
        return False, None
    try:
        content = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return False, None
    return True, content.count("\n") + (0 if not content else 1)


def iter_files(root: Path) -> Iterable[Path]:
    for p in sorted(root.rglob("*")):
        if p.is_file() and not p.name.startswith("."):
            yield p


def build_inventory(root: Path) -> list[InterviewFile]:
    rows: list[InterviewFile] = []
    for p in iter_files(root):
        ext = p.suffix.lower()
        raw = p.read_bytes()
        text_ok, lines = count_lines_if_text(p, ext)
        rows.append(
            InterviewFile(
                path=str(p).replace("\\", "/"),
                extension=ext or "<none>",
                bytes=len(raw),
                lines=lines,
                mtime=datetime.fromtimestamp(p.stat().st_mtime).isoformat(timespec="seconds"),
                sha1_12=sha1_12(raw),
                text_readable=text_ok,
            )
        )
    return rows


def to_markdown(rows: list[InterviewFile], root: Path) -> str:
    md_lines = []
    md_lines.append(f"# Interview Inventory")
    md_lines.append("")
    md_lines.append(f"- Root: `{root}`")
    md_lines.append(f"- GeneratedAt: `{datetime.now().isoformat(timespec='seconds')}`")
    md_lines.append(f"- FileCount: `{len(rows)}`")
    md_lines.append("")
    md_lines.append("| path | ext | bytes | lines | mtime | sha1_12 | text_readable |")
    md_lines.append("|---|---:|---:|---:|---|---|---:|")
    for r in rows:
        lines_str = "" if r.lines is None else str(r.lines)
        md_lines.append(
            f"| `{r.path}` | `{r.extension}` | {r.bytes} | {lines_str} | `{r.mtime}` | `{r.sha1_12}` | {str(r.text_readable).lower()} |"
        )
    return "\n".join(md_lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Build inventory for interview source files.")
    parser.add_argument(
        "--interview-dir",
        default="docs/interview",
        help="Directory containing interview files (default: docs/interview)",
    )
    parser.add_argument(
        "--format",
        choices=("markdown", "json"),
        default="markdown",
        help="Output format (default: markdown)",
    )
    parser.add_argument(
        "--write",
        default="",
        help="Optional output file path. If omitted, print to stdout.",
    )
    args = parser.parse_args()

    root = Path(args.interview_dir)
    if not root.exists() or not root.is_dir():
        raise SystemExit(f"Interview directory not found: {root}")

    rows = build_inventory(root)
    if args.format == "json":
        output = json.dumps([asdict(r) for r in rows], ensure_ascii=False, indent=2)
    else:
        output = to_markdown(rows, root)

    if args.write:
        Path(args.write).write_text(output + ("" if output.endswith("\n") else "\n"), encoding="utf-8")
    else:
        print(output, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
