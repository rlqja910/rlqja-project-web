import requests
import time

API_URL = "http://13.124.135.106:8080/api/buybacks"
ADMIN_URL = "http://13.124.135.106:8080/api/admin/buybacks"

KOSDAQ_COMPANIES = ["클래시스", "리노공업", "JYP Ent.", "에코프로비엠"]

def fix_kosdaq_market_type():
    try:
        # Fetch all
        res = requests.get(API_URL)
        if res.status_code != 200:
            print("Failed to fetch buybacks")
            return
        
        buybacks = res.json()
        for bb in buybacks:
            if bb["companyName"] in KOSDAQ_COMPANIES:
                print(f"Updating {bb['companyName']} to KOSDAQ...")
                
                # Ensure we pass the updated marketType
                bb["marketType"] = "KOSDAQ"
                
                # Update via PUT
                put_res = requests.put(f"{ADMIN_URL}/{bb['id']}", json=bb)
                if put_res.status_code == 200:
                    print(f"Success: {bb['companyName']}")
                else:
                    print(f"Failed to update {bb['companyName']}: {put_res.status_code}")
                time.sleep(0.1)
        print("Done fixing KOSDAQ market types.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_kosdaq_market_type()
