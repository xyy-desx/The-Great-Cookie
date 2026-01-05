
try:
    with open('.env', 'rb') as f:
        content = f.read()
    print(f"Content repr: {content!r}")
except Exception as e:
    print(e)
