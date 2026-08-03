import requests

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
try:
    res = requests.get(url, verify=False, proxies={"http": None, "https": None})
    print("Status:", res.status_code)
except Exception as e:
    print("Error:", e)