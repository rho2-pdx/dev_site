FROM python:3.10-slim

COPY . /app
WORKDIR /app

RUN apt-get update -y && apt-get install -y python3-pip python3-venv \
    && python3 -m venv /env && /env/bin/pip install --no-cache-dir -r requirements.txt \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV PATH="/env/bin:$PATH"

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--threads", "8", "app:app"]
