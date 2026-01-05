
content = """DATABASE_URL=postgresql://postgres:Newpassword@localhost:5432/greatcookie
DISCORD_BOT_TOKEN=MTQ1NzY1NzI4NTYyNjE2NzM2M.BvhmI4kiD.JHaBQJ2INUe2ijifKy98mZd0ijLdWw2DaB
SMTP_USER=thegreatcookiebyalex@gmail.com
SMTP_PORT=587
# SMTP_PASSWORD=
"""
with open('.env', 'w') as f:
    f.write(content)
print("Updated .env")
