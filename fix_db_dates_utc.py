import psycopg2

conn = psycopg2.connect('postgres://neondb_owner:npg_u60UzqENSawH@ep-fancy-frost-azklg9ou-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require')
cur = conn.cursor()

tables = ['posts', 'push_log', 'push_subscription', 'access_logs', 'patch_notes', 'scout_cache']

# 2026-08-21 07:30 ~ 07:55 사이에 UTC로 박힌 시간들을 다시 +9시간 해서 복구
for table in tables:
    try:
        cur.execute(f"UPDATE {table} SET created_at = created_at + interval '9 hours' WHERE created_at >= '2026-08-21 07:30:00' AND created_at <= '2026-08-21 08:00:00';")
        print(f"Updated {cur.rowcount} rows in {table}")
    except Exception as e:
        print(f"Error updating {table}: {e}")
        conn.rollback()

conn.commit()
cur.close()
conn.close()
print("All done!")
