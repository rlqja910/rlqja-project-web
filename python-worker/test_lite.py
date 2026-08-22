import google.generativeai as genai
genai.configure(api_key='AQ.Ab8RN6KFeQIj-DGm0B7rhsUv0-RMebrXdf6pEPeX_R_4HCS_jw')
model = genai.GenerativeModel('gemini-flash-lite-latest')
try:
    print('Calling...')
    res = model.generate_content('test')
    print('SUCCESS:', res.text[:20])
except Exception as e:
    print('ERROR:', type(e), e)
