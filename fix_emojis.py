import json
import re

with open('emojis.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

files_to_fix = [
    'src/views/AdminView.tsx',
    'src/views/FomoView.tsx',
    'src/views/GameView.tsx',
    'src/views/ScouterView.tsx',
    'src/views/ReverseTradeView.tsx',
    'src/views/BuybackTrackerView.tsx',
    'src/views/CompoundCalcView.tsx',
    'src/views/FeedbackView.tsx',
    'src/views/KoreLiveView.tsx',
    'src/views/InfoBoardView.tsx',
    'src/views/StockReportView.tsx',
    'src/views/AverageCalculatorView.tsx',
    'src/components/LoyalUserModal.tsx',
    'src/components/NoticePopup.tsx',
    'src/components/PPINoticePopup.tsx',
    'src/components/PushSubscriptionModal.tsx',
]

def add_import(content):
    if 'import { PixelIcon }' not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import '):
                lines.insert(i, "import { PixelIcon } from '../components/PixelIcon';")
                return '\n'.join(lines)
        return "import { PixelIcon } from '../components/PixelIcon';\n" + content
    return content

def add_import_components(content):
    if 'import { PixelIcon }' not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('import '):
                lines.insert(i, "import { PixelIcon } from './PixelIcon';")
                return '\n'.join(lines)
        return "import { PixelIcon } from './PixelIcon';\n" + content
    return content

for file_path in files_to_fix:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        continue
        
    original = content

    content = re.sub(r'alert\((.*?)\)', lambda m: "alert(" + re.sub(r'[\U00010000-\U0010ffff]', '', m.group(1)) + ")", content)

    emoji_map = {
        '🔥': '<PixelIcon name="fire" className="w-5 h-5 inline mr-1 text-red-500" />',
        '🚀': '<PixelIcon name="zap" className="w-5 h-5 inline mr-1 text-purple-500" />', 
        '🐳': '<PixelIcon name="target" className="w-5 h-5 inline mr-1 text-cyan-400" />',
        '📉': '<PixelIcon name="trending-down" className="w-5 h-5 inline mr-1 text-red-400" />',
        '📈': '<PixelIcon name="trending-up" className="w-5 h-5 inline mr-1 text-green-400" />',
        '🤖': '<PixelIcon name="robot" className="w-5 h-5 inline mr-1 text-gray-400" />',
        '💬': '<PixelIcon name="message-text" className="w-5 h-5 inline mr-1 text-blue-400" />',
        '🐉': '<PixelIcon name="bug" className="w-8 h-8 inline text-green-500" />', 
        '📭': '<PixelIcon name="mail" className="w-8 h-8 mx-auto text-gray-500" />',
        '🚨': '<PixelIcon name="alert" className="w-5 h-5 inline mr-1 text-red-500 animate-pulse" />',
        '🎯': '',
        '💥': '',
        '🧹 ': '<PixelIcon name="delete" className="w-4 h-4 inline mr-1" /> ',
        '🏠 ': '<PixelIcon name="home" className="w-4 h-4 inline mr-1" /> ',
        '📊 ': '<PixelIcon name="chart-bar" className="w-4 h-4 inline mr-1" /> ',
        '📋 ': '<PixelIcon name="script" className="w-4 h-4 inline mr-1" /> ',
        '📬 ': '<PixelIcon name="mail" className="w-4 h-4 inline mr-1" /> ',
        '🏆 ': '<PixelIcon name="trophy" className="w-5 h-5 inline mr-1 text-yellow-400" /> ',
        '🔔 ': '<PixelIcon name="notification" className="w-4 h-4 inline mr-1 text-green-400" /> ',
        '🔕 ': '<PixelIcon name="notification-off" className="w-4 h-4 inline mr-1 text-gray-400" /> ',
        '🔗 ': '<PixelIcon name="link" className="w-3 h-3 inline mr-1" /> ',
        '🫘 ': '<PixelIcon name="leaf" className="w-4 h-4 inline mr-1 text-green-400" /> ',
        '🔮 ': '<PixelIcon name="eye" className="w-4 h-4 inline mr-1 text-purple-400" /> ',
        '💸': '<PixelIcon name="coin" className="w-4 h-4 inline mr-1 text-yellow-400" />',
        '💡': '<PixelIcon name="lightbulb" className="w-4 h-4 inline mr-1 text-yellow-300" />',
        '👑': '<PixelIcon name="star" className="w-5 h-5 inline text-yellow-400" />', 
        '🎢 ': '<PixelIcon name="zap" className="w-4 h-4 inline mr-1 text-red-400" /> ', 
        '🌍 ': '<PixelIcon name="earth" className="w-4 h-4 inline mr-1 text-blue-400" /> ',
        '✨ ': '<PixelIcon name="sparkles" className="w-4 h-4 inline mr-1 text-yellow-300" /> ',
        '🤔 ': '<PixelIcon name="help" className="w-4 h-4 inline mr-1 text-gray-400" /> ',
        '📮': '<PixelIcon name="mail" className="w-8 h-8 text-red-400" />',
        '🤫': '<PixelIcon name="lock" className="w-5 h-5 text-purple-400" />',
        '🎉': '<PixelIcon name="star" className="w-5 h-5 text-yellow-400" />',
        '✈️': '',
        '🍹': '',
        '🏎️': '',
        '🚙': '',
        '🚗': '',
        '😭': '',
        '👜': '',
        '💳': '',
        '💻': '',
        '🏨': '',
        '💵': '',
        '🍣': '',
        '🥩': '',
        '🍗': '',
        '🍲': '',
        '🪙': '',
        '😑': '',
        '🍔': '',
        '😋': '',
        '😮‍💨': '',
        '🤮': '',
        '🥶': '',
        '😨': '',
        '🙇‍♂️': '',
        '👹': '',
        '🧻': '',
        '🕰️': '<PixelIcon name="clock" className="w-8 h-8 text-blue-400" />',
        '🦴': '<PixelIcon name="bone" className="w-4 h-4 text-gray-300" />', 
        '🌀 ': '<PixelIcon name="loader" className="w-5 h-5 inline mr-1 animate-spin" /> ',
        '🌧️': '<PixelIcon name="cloud" className="w-4 h-4 text-blue-300" />',
        '🤑': '<PixelIcon name="coin" className="w-8 h-8 text-yellow-400" />',
        '💀': '<PixelIcon name="skull" className="w-8 h-8 text-gray-400" />',
        '🎮': '<PixelIcon name="gamepad" className="w-5 h-5 text-purple-400" />',
        '🌪️ ': '',
        '🦇 ': '',
        '🎲': '<PixelIcon name="dice" className="w-8 h-8 text-purple-400" />',
        '🇰🇷': '',
        '🇺🇸': '',
        '💱': '',
        '🔄': '<PixelIcon name="refresh" className="w-4 h-4 inline mr-1" />',
        '🎬 ': '<PixelIcon name="video" className="w-4 h-4 inline mr-1 text-red-400" /> ',
        '🤷‍♂️ ': '<PixelIcon name="help" className="w-4 h-4 inline mr-1" /> ',
    }

    content = content.replace('🚀 수동 포스팅', '수동 포스팅')
    content = content.replace('🚀 무지성 불장 ON', '무지성 불장 ON')
    content = content.replace('🧊 찬물 샤워 (현실복귀)', '찬물 샤워 (현실복귀)')

    for emo, replace_with in emoji_map.items():
        content = content.replace(emo, replace_with)
        
    content = re.sub(r'[\U00010000-\U0010ffff]', '', content)

    if content != original:
        if file_path.startswith('src/components/'):
            content = add_import_components(content)
        else:
            content = add_import(content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed emojis across all files.")
