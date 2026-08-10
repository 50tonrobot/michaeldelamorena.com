#!/usr/bin/env python3
"""Normalize a resume PDF for WCAG 2.2 AA.

Sets the document language (/Lang, WCAG 3.1.1) and a descriptive title
(/Title, WCAG 2.4.2) without touching content streams, tags, or reading order.

Usage: patch_pdf.py <input.pdf> <output.pdf>
"""
from __future__ import annotations

import sys

import pikepdf

LANG = "en-US"
TITLE = "Michael de la Morena — Resume"


def patch(src: str, dst: str) -> None:
    with pikepdf.open(src) as pdf:
        pdf.Root.Lang = pikepdf.String(LANG)
        pdf.docinfo["/Title"] = TITLE
        with pdf.open_metadata(set_pikepdf_as_editor=False) as meta:
            meta["dc:title"] = TITLE
        pdf.save(dst)


def validate(path: str) -> None:
    with pikepdf.open(path) as pdf:
        assert str(pdf.Root.get("/Lang", "")) == LANG, "/Lang not set"
        assert str(pdf.docinfo.get("/Title", "")) == TITLE, "/Title not set"


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: patch_pdf.py <input.pdf> <output.pdf>", file=sys.stderr)
        return 2
    patch(argv[1], argv[2])
    validate(argv[2])
    print(f"patched: Lang={LANG} Title={TITLE!r}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
