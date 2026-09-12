import requests

def deduplicate():
    print("Fetching buybacks...")
    res = requests.get("http://13.124.135.106:8080/api/buybacks")
    buybacks = res.json()
    
    seen_tickers = {}
    duplicates = []
    
    # Sort by ID to keep the newest (assuming higher ID = newer)
    buybacks.sort(key=lambda x: x['id'], reverse=True)
    
    for bb in buybacks:
        ticker = bb['ticker']
        if ticker in seen_tickers:
            duplicates.append(bb['id'])
            print(f"Found duplicate for {bb['companyName']} (ID: {bb['id']})")
        else:
            seen_tickers[ticker] = bb['id']
            
    print(f"Deleting {len(duplicates)} duplicates...")
    for dup_id in duplicates:
        res = requests.delete(f"http://13.124.135.106:8080/api/admin/buybacks/{dup_id}")
        if res.status_code == 200:
            print(f"Deleted {dup_id}")
        else:
            print(f"Failed to delete {dup_id} - Status: {res.status_code}")

if __name__ == "__main__":
    deduplicate()
