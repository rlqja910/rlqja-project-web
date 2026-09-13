import urllib.request
import re
html = urllib.request.urlopen('https://unpkg.com/pixelarticons@1.8.1/svg/').read().decode('utf-8')
icons = re.findall(r'href="([^"]+\.svg)"', html)
icons = [i.replace('.svg', '') for i in icons]

missing = []
for test in ['target', 'trending-up', 'chart-bar', 'sparkles', 'robot', 'zap', 'lightbulb', 'calculator', 'zoom-in', 'clock', 'text-format', 'text-wrap', 'scan-barcode', 'leaf', 'gamepad', 'pin', 'message-text', 'wallet', 'sliders', 'radio']:
    if test not in icons:
        missing.append(test)
print("Missing:", missing)
