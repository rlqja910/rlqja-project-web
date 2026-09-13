import glob

files = glob.glob('src/**/*.tsx', recursive=True)
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    orig = content
    content = content.replace('name="alert"', 'name="warning-diamond"')
    content = content.replace('name="notification"', 'name="bell"')
    content = content.replace('name="notification-off"', 'name="bell-off"')
    
    if orig != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
print('Done!')
