# 🎯 YouTube Comment Classification Web App

This project is a full-stack web application that classifies YouTube video comments using machine learning. It provides a clean interface to fetch, analyze, and visualize comments for content creators and community managers.


## 🔍 Features

- 🎥 **YouTube Comment Scraper**: Fetches comments using YouTube Data API based on Channel ID.
- 🧠 **ML Model Integration**: Classifies comments into categories like Positive, Negative, Neutral, and Questions.
- 🌗 **Dark/Light Mode**: Toggle-friendly interface with theme persistence.
- 📈 **Analysis Dashboard**: View categorized comments and data insights on a dedicated page.
- ✍️ **Visitor Feedback System**: Allows users to submit comments/feedback that are dynamically rendered on the page.
- 📱 **Responsive Design**: Fully mobile-optimized with animated transitions and collapsible menus.
- 🔄 **Dynamic Image Display**: Rotating images in the About section for visual enhancement.

## 📁 Project Structure

project/
│
├── app.py # Flask backend logic
├── sentimentscraper.py # YouTube scraper + comment classifier
├── requirements.txt # Python dependencies
│
├── templates/
│ ├── index.html # Homepage with input form and feedback section
│ └── about.html # View analysis & dynamic comment section
│
├── static/
│ ├── style.css # Global styling
│ ├── script1.js # JS logic (theme toggle, API calls, feedback system)
│ └── images/, videos/ # Visual assets

## 🧠 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Font Awesome
- **Backend**: Python 3, Flask
- **APIs & Libraries**:
  - YouTube Data API
  - Custom ML classification logic (`classify_text()`)
  - `google-api-python-client`
  - `flask`, `requests`, etc.


## 💡 Use Cases

- 📊 Analyze audience sentiment on YouTube
- 👮‍♂️ Flag potential spam or hate comments
- 💬 Collect and showcase community feedback
- 👨‍🏫 Demonstrate full-stack ML web integration


## 🛠 How It Works

1. User enters a valid YouTube **Channel ID**.
2. App fetches recent video comments using the YouTube API.
3. Each comment is run through a machine learning classifier.
4. Results are sorted into categories and displayed visually.
5. Users can also leave feedback, which appears dynamically.

## 📬 Feedback Handling

- All feedback is submitted via a form on the homepage.
- Submitted messages are stored (temporarily or permanently depending on backend setup).
- New feedback is dynamically added to the community section.

## 🧑‍💻 Author

Made with ❤️ by [Harshit Bansal](https://github.com/HarshitBans)

