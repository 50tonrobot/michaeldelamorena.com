import subprocess
import sys
from pathlib import Path

import pikepdf

HERE = Path(__file__).parent
LANG = "en-US"
TITLE = "Michael de la Morena — Resume"


def _make_sample(path: Path) -> None:
    pdf = pikepdf.new()
    pdf.add_blank_page(page_size=(612, 792))
    pdf.save(str(path))


def test_patch_sets_lang_and_title(tmp_path):
    src = tmp_path / "in.pdf"
    dst = tmp_path / "out.pdf"
    _make_sample(src)

    subprocess.check_call(
        [sys.executable, str(HERE / "patch_pdf.py"), str(src), str(dst)]
    )

    with pikepdf.open(str(dst)) as pdf:
        assert str(pdf.Root.Lang) == LANG
        assert str(pdf.docinfo["/Title"]) == TITLE


def test_rejects_bad_args(tmp_path):
    result = subprocess.run(
        [sys.executable, str(HERE / "patch_pdf.py")],
        capture_output=True,
    )
    assert result.returncode != 0
