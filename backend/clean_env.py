
try:
    with open('.env', 'rb') as f:
        content = f.read()
    cleaned = content.replace(b'\x00', b'')
    print(f"Cleaned repr: {cleaned!r}")
    with open('.env', 'wb') as f:
        f.write(cleaned)
    print("Overwrote .env with cleaned content")
except Exception as e:
    print(e)
