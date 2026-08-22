import psycopg2
from datetime import datetime

DATABASE_URL = 'postgresql://postgres:koru1234@localhost:5432/postgres'

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Check if patch_notes table exists
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    tables = [t[0] for t in cur.fetchall()]
    
    patch_table = next((t for t in tables if 'patch' in t or 'note' in t), None)
    
    if patch_table:
        print(f"Found patch table: {patch_table}")
        # Try to insert
        patch_text = "V2.0.0 업데이트: 다중 소스 워터폴 연산 엔진 탑재, 백그라운드 캐싱 로직 적용, Glassmorphism UI 전면 개편, NIGHT PRICE 리브랜딩"
        try:
            # Assuming columns might be content, created_at, etc. Let's do a generic insert or just print columns
            cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name='{patch_table}'")
            cols = cur.fetchall()
            print("Columns:", cols)
            # This is just a check, so we don't blindly insert yet
        except Exception as e:
            print("Error checking columns:", e)
    else:
        print("No patch notes table found in DB. Automatically creating 'patch_notes' table...")
        cur.execute("""
        CREATE TABLE patch_notes (
            id SERIAL PRIMARY KEY,
            version VARCHAR(50),
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.commit()
        print("Table 'patch_notes' created.")
        
        cur.execute("INSERT INTO patch_notes (version, content) VALUES (%s, %s)", 
                    ('v2.0.0', '다중 소스 워터폴 연산 엔진 탑재, 백그라운드 무한 루프 캐싱 도입, UI 글래스모피즘 전면 개편, 달러 소수점 표기 고정'))
        conn.commit()
        print("Patch notes successfully inserted into DB!")

except Exception as e:
    print("DB Error:", e)
finally:
    if 'conn' in locals() and conn:
        conn.close()
