#!/usr/bin/env python3
"""Bagi total frame sebuah komposisi Remotion jadi N chunk yang sama besar.

Dipakai dari workflow GitHub Actions (render-parallel.yml):
    python3 scripts/chunk_frames.py --total 2025 --chunks 10 --index 3

Menulis `start` dan `end` (inklusif) ke $GITHUB_OUTPUT, contoh:
    start=609
    end=811
"""
import argparse
import os


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--total", type=int, required=True, help="total frame komposisi")
    parser.add_argument("--chunks", type=int, default=10, help="jumlah chunk paralel")
    parser.add_argument("--index", type=int, required=True, help="index chunk ini (0-based)")
    args = parser.parse_args()

    per = (args.total + args.chunks - 1) // args.chunks  # ceil
    start = args.index * per
    end = min(start + per - 1, args.total - 1)

    output_path = os.environ.get("GITHUB_OUTPUT")
    lines = f"start={start}\nend={end}\n"
    if output_path:
        with open(output_path, "a") as f:
            f.write(lines)
    print(lines, end="")


if __name__ == "__main__":
    main()
