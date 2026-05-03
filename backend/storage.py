"""
Módulo que configura o Redis.
"""

import os

import redis

REDIS_URL = os.getenv("REDIS_URL")

redis_client = None

if REDIS_URL:
    try:
        redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        redis_client.ping()  # testa conexão
        print("Redis conectado")
    except Exception as e:
        print("Erro ao conectar no Redis:", e)
        redis_client = None
else:
    print("REDIS_URL não definida")
