import time
import sys
import io
import urllib.parse
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import urllib.parse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

def get_driver():
    print("🤖 크롬 드라이버를 준비하는 중...")
    options = webdriver.ChromeOptions()
    # 봇 전용 프로필 폴더를 생성하여 로그인 정보를 유지합니다.
    options.add_argument("--user-data-dir=C:\\Temp\\YoutubeBotProfile")
    # 봇 탐지 우회 옵션
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    # 봇 탐지 스크립트 무력화
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": """
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
        """
    })
    return driver

def write_comment(driver, video_url, comment_text):
    print(f"\n📺 타겟 영상 접속 중: {video_url}")
    driver.get(video_url)
    
    try:
        # 1. 댓글창이 로딩될 때까지 살짝 스크롤 내리기
        print("⏬ 댓글창 로딩을 위해 스크롤을 내립니다...")
        driver.execute_script("window.scrollBy(0, 500);")
        time.sleep(3)
        driver.execute_script("window.scrollBy(0, 500);")
        time.sleep(2)

        # 2. 댓글 입력창(placeholder-area) 찾기 및 클릭
        print("🔍 댓글 입력창 찾는 중...")
        wait = WebDriverWait(driver, 10)
        comment_box = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#simple-box")))
        comment_box.click()
        time.sleep(1)

        # 3. 실제 텍스트 입력창(#contenteditable-root)에 텍스트 입력
        print("✍️ 댓글 작성 중...")
        input_area = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#contenteditable-root")))
        input_area.send_keys(comment_text)
        time.sleep(2)

        # 4. 등록 버튼(#submit-button) 클릭
        print("🚀 등록 버튼 누르는 중...")
        submit_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#submit-button")))
        submit_btn.click()
        print("✅ 댓글 등록 완료!")
        time.sleep(3)

    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        print("⚠️ 주의: 로그인이 안 되어 있거나, 유튜브 UI가 변경되었을 수 있습니다.")

def search_videos(driver, keyword, max_videos=5):
    print(f"\n🔍 '{keyword}' 키워드로 최신 떡상 영상(이번 주 기준)을 찾는 중...")
    # URL 인코딩 (띄어쓰기나 특수문자 처리)
    encoded_keyword = urllib.parse.quote(keyword)
    # sp=EgIIAw%3D%3D 는 유튜브 검색 필터 '이번 주' 조건입니다.
    search_url = f"https://www.youtube.com/results?search_query={encoded_keyword}&sp=EgIIAw%253D%253D"
    driver.get(search_url)
    
    video_links = []
    try:
        # 검색 결과가 렌더링될 때까지 대기
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "ytd-video-renderer")))
        
        # 영상 로딩을 위해 스크롤을 여러 번 내립니다.
        for _ in range(3):
            driver.execute_script("window.scrollBy(0, 1000);")
            time.sleep(2)
            
        elements = driver.find_elements(By.CSS_SELECTOR, "a#video-title")
        for el in elements:
            href = el.get_attribute("href")
            # Shorts 영상이나 광고는 제외하고 일반 시청 영상만 수집
            if href and "/watch?v=" in href:
                # 중복 수집 방지
                if href not in video_links:
                    video_links.append(href)
                if len(video_links) >= max_videos:
                    break
    except Exception as e:
        print(f"❌ 검색 중 오류 발생 (결과를 못 찾았을 수 있습니다): {e}")
        
    print(f"🎯 총 {len(video_links)}개의 타겟 영상을 좌표 찍었습니다!")
    return video_links

if __name__ == "__main__":
    print("=======================================")
    print("🔥 유튜브 자동 댓글 폭격기 (위험도: 💀💀💀)")
    print("=======================================\n")
    
    driver = get_driver()
    
    print("\n🚨 [필독] 처음 실행 시 켜지는 크롬 창에서 유튜브에 '구글 로그인'을 먼저 해주세요!")
    print("로그인을 한 번 해두면 다음부터는 자동 로그인됩니다.")
    input("👉 로그인을 완료하셨다면 이 콘솔 창에서 Enter 키를 눌러주세요...")

    print("\n[ 모드 선택 ]")
    print("1. 수동 저격 모드 (URL 직접 입력)")
    print("2. 자동 폭격 모드 (키워드 검색 후 알아서 도배)")
    choice = input("👉 원하는 모드를 선택하세요 (1 또는 2): ")

    if choice == '2':
        keyword = input("\n🔎 타겟 키워드를 입력하세요 (예: 삼성전자 주가, 테슬라 떡상): ")
        comment_text = input("💬 남길 어그로 댓글 내용을 입력하세요: ")
        max_v = int(input("🎯 몇 개의 영상에 폭격할까요? (숫자만 입력, 예: 5): "))
        
        urls = search_videos(driver, keyword, max_v)
        for idx, url in enumerate(urls):
            print(f"\n=======================================")
            print(f"💥 [{idx+1}/{len(urls)}] 번째 타겟 타격 시작")
            write_comment(driver, url, comment_text)
            
            if idx < len(urls) - 1:
                print("\n⏳ 섀도우밴(차단) 방지를 위해 30초 대기합니다...")
                time.sleep(30)
    else:
        while True:
            video_url = input("\n🎥 떡상 영상 URL을 입력하세요 (종료하려면 q): ")
            if video_url.lower() == 'q':
                break
                
            comment_text = input("💬 남길 댓글 내용을 입력하세요: ")
            
            write_comment(driver, video_url, comment_text)
            
            print("\n⏳ 섀도우밴 방지를 위해 10초 대기...")
            time.sleep(10)

    print("\n👋 모든 작전이 종료되었습니다. 봇을 철수합니다!")
    driver.quit()
