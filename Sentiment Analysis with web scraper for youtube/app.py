
from flask import Flask, render_template, request, jsonify
from sentimentscraper import scrape_channel_comments, classify_text
import os

app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')

# Store last results here
classified_result = {}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about.html')
def about_page():
    return render_template('about.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    global classified_result
    data = request.get_json()
    channel_id = data.get('channelId')

    if not channel_id:
        return jsonify({'error': 'Missing channel ID'}), 400

    try:
        texts, comments = scrape_channel_comments(channel_id)
        classified_result = {
            "channel": channel_id,
            "positive": [],
            "neutral": [],
            "question": [],
            "negative": []
        }

        for comment in texts[:100]:
            label = classify_text(comment)
            classified_result[label].append(comment)

        return jsonify({"message": "Classification complete"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
feedback_comments = []

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    message = data.get('message', '').strip()

    if not message:
        return jsonify({'error': 'Feedback cannot be empty'}), 400

    feedback_comments.append({'message': message})
    print(f"📝 Feedback received: {message}")
    return jsonify({'message': 'Thank you for your feedback!'})

@app.route('/results', methods=['GET'])
def get_results():
    return jsonify(classified_result)

if __name__ == '__main__':
    app.run(debug=True)





