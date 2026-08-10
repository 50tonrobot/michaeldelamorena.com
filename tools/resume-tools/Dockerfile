FROM python:3.12-slim

# pikepdf pulls libqpdf; slim base needs no extra apt packages for the wheel.
RUN pip install --no-cache-dir "pikepdf~=9.0"

COPY patch_pdf.py /usr/local/bin/patch_pdf.py
RUN chmod 0755 /usr/local/bin/patch_pdf.py

USER 1001:1001
ENTRYPOINT ["sleep", "infinity"]
