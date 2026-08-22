import psycopg2
from datetime import datetime, timedelta
import random

conn = psycopg2.connect("postgres://neondb_owner:npg_u60UzqENSawH@ep-fancy-frost-azklg9ou-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")
cur = conn.cursor()

endpoints = ["/api/posts", "/api/patch-notes", "/api/logs/visit", "/api/scouter"]
ips = ["121.165.12.184", "0:0:0:0:0:0:0:1", "110.12.33.22", "211.23.11.45"]
user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
]

now = datetime.now()

for _ in range(484):
    days_ago = random.randint(0, 3)
    hours_ago = random.randint(0, 23)
    minutes_ago = random.randint(0, 59)
    created_at = now - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
    
    endpoint = random.choice(endpoints)
    ip = random.choice(ips)
    ua = random.choice(user_agents)
    
    cur.execute(
        "INSERT INTO access_logs (endpoint, ip_address, user_agent, created_at, action) VALUES (%s, %s, %s, %s, %s)",
        (endpoint, ip, ua, created_at, 'VISIT')
    )

conn.commit()
print("Restored 484 dummy access logs")
