import urllib.request
import json
import time

API_URL = "http://13.124.135.106:8080/api/buybacks"
ADMIN_URL = "http://13.124.135.106:8080/api/admin/buybacks"

KOSDAQ_COMPANIES = ["클래시스", "리노공업", "JYP Ent.", "에코프로비엠"]

def fix_kosdaq_market_type():
    try:
        req = urllib.request.Request(API_URL)
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            buybacks = json.loads(data)
            
        for bb in buybacks:
            if bb["companyName"] in KOSDAQ_COMPANIES:
                print(f"Updating {bb['companyName']} to KOSDAQ...")
                bb["marketType"] = "KOSDAQ"
            else:
                print(f"Updating {bb['companyName']} to KOSPI...")
                bb["marketType"] = "KOSPI"

            put_data = json.dumps(bb).encode('utf-8')
            put_req = urllib.request.Request(f"{ADMIN_URL}/{bb['id']}", data=put_data, method="PUT", headers={"Content-Type": "application/json"})
            
            with urllib.request.urlopen(put_req) as put_res:
                if put_res.status == 200:
                    print(f"Success: {bb['companyName']}")
                else:
                    print(f"Failed to update {bb['companyName']}: {put_res.status}")
            time.sleep(0.1)
        print("Done fixing market types.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_kosdaq_market_type()
