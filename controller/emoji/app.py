from flask import Flask, request, jsonify
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import pandas as pd

app = Flask(__name__)


csv_file_path = "emoji_df.csv"
df = pd.read_csv(csv_file_path)

# Load pre-trained GPT-2 model and tokenizer
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

def generate_text(emoji):
    emoji_row = df[df["emoji"] == emoji]
    if not emoji_row.empty:
        text = emoji_row["name"].iloc[0]
        sub_group = emoji_row["sub_group"].iloc[0]  # Updated to 'sub_group'
        group = emoji_row["group"].iloc[0]
        codepoints = emoji_row["codepoints"].iloc[0]
        return text, sub_group, group, codepoints
    else:
        return "No text found for this emoji.", None, None

def generate_text_with_transformer(text):
    inputs = tokenizer.encode(text, return_tensors="pt", max_length=100, truncation=True)
    outputs = model.generate(inputs, max_length=100, num_return_sequences=1, do_sample=True)
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_text

@app.route('/generate-text', methods=['POST'])
def generate_text_route():
    request_data = request.get_json()
    emoji = request_data['emoji']
    generated_text, sub_group, group, codepoints = generate_text(emoji)
    random_text = generate_text_with_transformer(generated_text)
    return jsonify({'generated_text': generated_text, 'sub_group': sub_group, 'group': group, 'codepoints': codepoints, 'random_text': random_text})

if __name__ == '__main__':
    app.run(debug=True)
