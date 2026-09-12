import yfinance as yf

tk = yf.Ticker('MU')
hd = tk.history(period='5d')
hl = tk.history(period='1d', interval='1m', prepost=True)

print("HD length:", len(hd))
if len(hd) > 0:
    print("HD last index:", hd.index[-1].date())

print("HL length:", len(hl))
if len(hl) > 0:
    print("HL last index:", hl.index[-1].date())
    print("HL last time:", hl.index[-1].time())
    
print("---")
if len(hd) >= 2:
    live_date = hl.index[-1].date()
    last_daily_date = hd.index[-1].date()
    print("live_date > last_daily_date:", live_date > last_daily_date)
    if live_date > last_daily_date:
        prev = float(hd['Close'].iloc[-1])
    else:
        prev = float(hd['Close'].iloc[-2])
    curr = float(hl['Close'].iloc[-1])
    print(f"prev: {prev}, curr: {curr}, change: {(curr-prev)/prev}")
