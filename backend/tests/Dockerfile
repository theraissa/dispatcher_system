FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .
COPY tests/requirements.txt ./test-requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install -r test-requirements.txt

CMD ["pytest"]
