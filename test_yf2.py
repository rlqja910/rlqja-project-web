import yfinance as yf

tk = yf.Ticker('MU')
hd = tk.history(period='5d')
hl = tk.history(period='1d', interval='1m', prepost=True)
print("HD:\n", hd['Close'])
