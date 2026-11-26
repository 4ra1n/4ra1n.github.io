#!/usr/bin/env python3
"""Render SECURITY.md as a standalone HTML page."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

try:
    import markdown
except ImportError:
    raise SystemExit(
        "Missing dependency: Markdown\n"
        "Install it with: python3 -m pip install -r requirements.txt"
    )


ROOT = Path(__file__).resolve().parent
DEFAULT_SOURCE = ROOT / "SECURITY.md"
DEFAULT_OUTPUT = ROOT / "security.html"

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="4ra1n - SECURITY">
<link rel="icon" href="./favicon.ico" sizes="any">
<title>SECURITY</title>
<style>
  :root {
    color-scheme: light dark;
    --text: #1f2328;
    --muted: #656d76;
    --line: #d0d7de;
    --bg: #ffffff;
    --card: #f6f8fa;
    --accent: #0969da;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --text: #e6edf3;
      --muted: #8b949e;
      --line: #30363d;
      --bg: #0d1117;
      --card: #161b22;
      --accent: #58a6ff;
    }
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    padding: 2rem 1.25rem 4rem;
    background: var(--bg);
    color: var(--text);
    font: 16px/1.7 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
          "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  }
  .page { width: min(100%, 960px); margin: 0 auto; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .markdown-body h2 {
    margin: 2.8rem 0 1rem;
    padding-bottom: 0.45rem;
    border-bottom: 1px solid var(--line);
    font-size: 1.35rem;
  }
  .markdown-body h3 { margin: 2rem 0 0.8rem; font-size: 1.1rem; }
  .markdown-body p { margin: 0.75rem 0 1rem; }
  .markdown-body ul, .markdown-body ol { padding-left: 1.5rem; }
  .markdown-body li { margin: 0.25rem 0; }
  .markdown-body strong { font-weight: 650; }
  .markdown-body code {
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    background: var(--card);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
  }
  .table-scroll {
    margin: 1rem 0 1.5rem;
    overflow-x: auto;
    border: 1px solid var(--line);
    border-radius: 8px;
  }
  .markdown-body table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
    font-size: 0.9375rem;
  }
  .markdown-body th, .markdown-body td {
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid var(--line);
    text-align: left;
    white-space: nowrap;
  }
  .markdown-body th { background: var(--card); font-weight: 600; }
  .markdown-body tr:last-child td { border-bottom: 0; }
  @media (max-width: 600px) {
    body { padding: 1.25rem 1rem 3rem; }
  }
</style>
</head>
<body>
<div class="page">
  <main class="markdown-body">
@@CONTENT@@
  </main>
</div>
</body>
</html>
"""


def render_markdown(source: Path) -> str:
    text = source.read_text(encoding="utf-8")
    content = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "sane_lists"],
        output_format="html5",
    )
    return re.sub(
        r"(<table>.*?</table>)",
        r'<div class="table-scroll">\1</div>',
        content,
        flags=re.DOTALL,
    )


def build_page(source: Path) -> str:
    content = render_markdown(source)
    return PAGE_TEMPLATE.replace("@@CONTENT@@", content)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate security.html from a Markdown security policy."
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE,
        help=f"Markdown source (default: {DEFAULT_SOURCE.name})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"HTML output (default: {DEFAULT_OUTPUT.name})",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.source.is_file():
        raise SystemExit(f"Source file not found: {args.source}")

    output = build_page(args.source)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(output, encoding="utf-8")
    print(f"Generated {args.output} from {args.source}")


if __name__ == "__main__":
    main()
