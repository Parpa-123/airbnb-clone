import requests
from celery import shared_task

@shared_task
def ping_health():
    try:
        response = requests.get('http://localhost:8000/health/')
        print(f"Health ping status: {response.status_code}")
    except Exception as e:
        print(f"Health ping failed: {str(e)}")
