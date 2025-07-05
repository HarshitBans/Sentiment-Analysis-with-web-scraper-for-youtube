
from googleapiclient.discovery import build
import time
import csv
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from scipy.special import softmax

# Replace with your actual API key
API_KEY = "AIzaSyAWH0TD32Zyhy0r2zUUu3QqEBhKiV20qwg"
CHANNEL_ID = 'UCiH9iH9laRsXAFAdAYZIKqA'

youtube = build('youtube', 'v3', developerKey=API_KEY)

# Get playlist of all uploaded videos
def get_upload_playlist_id(channel_id):
    response = youtube.channels().list(
        part='contentDetails',
        id=channel_id
    ).execute()
    return response['items'][0]['contentDetails']['relatedPlaylists']['uploads']

# Get all video IDs
def get_video_ids(playlist_id, max_videos=50):
    video_ids = []
    next_page_token = None
    while True:
        response = youtube.playlistItems().list(
            part='contentDetails',
            playlistId=playlist_id,
            maxResults=50,
            pageToken=next_page_token
        ).execute()
        for item in response['items']:
            video_ids.append(item['contentDetails']['videoId'])
            if len(video_ids) >= max_videos:
                return video_ids
        next_page_token = response.get('nextPageToken')
        if not next_page_token:
            break
    return video_ids

# Get comments from a video
def get_comments(video_id):
    comments = []
    next_page_token = None
    while True:
        try:
            response = youtube.commentThreads().list(
                part='snippet',
                videoId=video_id,
                maxResults=100,
                textFormat='plainText',
                pageToken=next_page_token
            ).execute()
            for item in response['items']:
                comment = item['snippet']['topLevelComment']['snippet']
                comments.append({
                    'video_id': video_id,
                    'author': comment['authorDisplayName'],
                    'text': comment['textDisplay'],
                    'like_count': comment['likeCount'],
                    'published_at': comment['publishedAt']
                })
            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break
        except Exception as e:
            print(f"Error fetching comments for video {video_id}: {e}")
            break
    return comments

# Scrape all comments and return text list + metadata
def scrape_channel_comments(channel_id, output_csv='channel_comments.csv'):
    playlist_id = get_upload_playlist_id(channel_id)
    video_ids = get_video_ids(playlist_id)

    all_comments = []
    all_texts = []

    for video_id in video_ids:
        print(f"Scraping comments for video: {video_id}")
        comments = get_comments(video_id)
        all_comments.extend(comments)
        all_texts.extend([comment['text'] for comment in comments])
        time.sleep(1)

    # Save to CSV
    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['video_id', 'author', 'text', 'like_count', 'published_at'])
        writer.writeheader()
        writer.writerows(all_comments)

    print(f"Scraped {len(all_comments)} comments from {len(video_ids)} videos.")
    return all_texts, all_comments

# 🔍 Load 3-class sentiment model (positive, neutral, negative)
MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)
labels_map = ['negative', 'neutral', 'positive']

# 🧠 Heuristic-based question detection
def is_question(text):
    text = text.lower()
    return (
        text.strip().endswith('?') or
        any(word in text for word in ['what', 'how', 'why', 'can you', 'could', 'is it', 'are you', 'where', 'when'])
    )

# 🔍 Final sentiment classification with question detection
def classify_text(text):
    if is_question(text):
        return 'question'
    else:
        inputs = tokenizer(text, return_tensors="pt", truncation=True)
        outputs = model(**inputs)
        scores = softmax(outputs.logits.detach().numpy()[0])
        predicted_label = labels_map[scores.argmax()]
        return predicted_label

# Main run
if __name__ == "__main__":
    texts, metadata = scrape_channel_comments(CHANNEL_ID)

    results = []
    for text in texts[:100]:  # Limit for demo (you can remove [:100] to run all)
        label = classify_text(text)
        results.append((text, label))
        print(f"\nComment: {text}\n→ Classification: {label.upper()}")

    # (Optional) Save classification results
    with open("classified_comments.csv", "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Comment", "Label"])
        writer.writerows(results)

    print("\nClassification completed and saved to 'classified_comments.csv'.")
