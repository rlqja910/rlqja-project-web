import requests
import re
import json
res=requests.get('https://maplestoryworlds.nexon.com/ko/community/4402/5006', headers={'User-Agent':'Mozilla/5.0'})
match = re.search(r'__NUXT__=(.*?);</script>', res.text, re.DOTALL)
if match:
    # Just grab all "title":"something" and "threadId":"something" using regex
    titles = re.findall(r'"title":"([^"]+)"', match.group(1))
    thread_ids = re.findall(r'"threadId":"([^"]+)"', match.group(1))
    print("Titles:", titles[:5])
    print("Thread IDs:", thread_ids[:5])
else:
    print("No NUXT found")
