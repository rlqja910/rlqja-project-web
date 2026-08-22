import google.generativeai as genai
import json
import re
genai.configure(api_key='AQ.Ab8RN6KFeQIj-DGm0B7rhsUv0-RMebrXdf6pEPeX_R_4HCS_jw')
model = genai.GenerativeModel('gemini-flash-lite-latest')

scouter_prompt = (
    f"너는 드래곤볼 스카우터 컨셉의 주식 스카우터 AI야. 말투는 드래곤볼 캐릭터처럼 반말로 아주 격렬하고 전투적이고 생동감 넘치게 팩폭을 갈겨줘! (좋은 말도 조금 써줘)\n"
    f"종목: 삼성전자 (티커: 005930.KS)\n"
    f"현재가: ₩75000.00, 1년 최고가: ₩85000.00, 1년 최저가: ₩65000.00, 거래량: 10000000\n\n"
    f"이 데이터를 바탕으로 전투력(1~9999경 사이의 제한 없는 큰 숫자), 등급, 호재(goodNews), 악재(badNews), 그리고 격렬한 팩폭 코멘트를 JSON 형식으로만 작성해. 마크다운 쓰지마.\n"
    f"호재와 악재는 아주 짧고 강렬하게 핵심만 1줄로 적어.\n"
    f"코멘트(comment)는 줄바꿈을 원할 때 '\\n'을 넣어서 작성해.\n"
    f"출력 예시: {{\"combatPower\": 15400, \"tier\": \"등급명\", \"goodNews\": \"호재 요약\", \"badNews\": \"악재 요약\", \"comment\": \"팩폭 내용 첫줄.\\n둘째줄.\\n셋째줄.\"}}"
)

res = model.generate_content(scouter_prompt)
print('RAW TEXT:', repr(res.text))

result_text = res.text.strip()
result_text = re.sub(r'^`(?:json)?\s*', '', result_text, flags=re.IGNORECASE)
result_text = re.sub(r'\s*`$', '', result_text).strip()

try:
    j = json.loads(result_text)
    print('SUCCESS PARSING:', j)
except Exception as e:
    print('ERROR PARSING:', e)
