import google.generativeai as genai
genai.configure(api_key='AQ.Ab8RN6KFeQIj-DGm0B7rhsUv0-RMebrXdf6pEPeX_R_4HCS_jw')
model = genai.GenerativeModel('gemini-flash-lite-latest')
ticker_prompt = "'삼성전자' 주식/코인의 정확한 티커 심볼(예: 삼성전자는 005930.KS, 비트코인은 BTC-USD, 애플은 AAPL)과 실제 이름을 추출해주세요. JSON 형식으로 {\"ticker\": \"...\", \"real_stock_name\": \"...\"} 만 반환하세요."
try:
    res = model.generate_content(ticker_prompt)
    print('SUCCESS:', res.text)
except Exception as e:
    print('ERROR:', e)
