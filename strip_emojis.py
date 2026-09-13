import re

files_to_fix = [
    'src/views/FomoView.tsx',
    'src/views/InfoBoardView.tsx',
    'src/views/KoreLiveView.tsx',
]

emoji_pattern = re.compile('[\U00010000-\U0010ffff]', flags=re.UNICODE)

for file_path in files_to_fix:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Just strip all emojis completely from these files
    content = emoji_pattern.sub('', content)
    
    # Fix any specific remaining text fragments from emojis if needed
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Stripped emojis from restored files.")
