import json

input_file = "oxford_source.txt"
output_file = "words.json"

data = []

with open(input_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f, start=1):
        word = line.strip()
        if word:  # ข้ามบรรทัดว่าง
            data.append({
                "id": i,
                "word": word
            })

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Done! Saved to oxford.json")