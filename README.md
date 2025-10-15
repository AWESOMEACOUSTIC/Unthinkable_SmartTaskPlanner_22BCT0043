# Smart Task Planner

A smart task management application powered by AI using Node.js, Express, MongoDB, EJS, and Gemini AI API.

## Features

- ✅ Create, read, update, and delete tasks
- 🤖 AI-powered task suggestions using Gemini API
- 📊 Smart priority recommendations
- 📅 Task scheduling with due dates
- 🏷️ Task categorization and tagging
- 📈 Task status tracking (pending, in-progress, completed)

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Frontend
- **EJS** - Template engine
- **CSS** - Styling
- **JavaScript** - Client-side logic

### AI Integration
- **Flask** - Python API server
- **Gemini API** - Google's AI model

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Python 3.8 or higher
- Gemini API key (get from Google AI Studio)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Unthinkable_Backend_Project
```

### 2. Install Node.js dependencies
```bash
npm install
```

### 3. Set up Flask API
```bash
cd flask_api
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Configure environment variables

**Root .env file:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart-task-planner
FLASK_API_URL=http://localhost:5000
SESSION_SECRET=your-secret-key-here
```

**flask_api/.env file:**
```env
FLASK_PORT=5000
GEMINI_API_KEY=your-gemini-api-key-here
```

### 5. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `flask_api/.env`

## Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system.

### 2. Start Flask API (Terminal 1)
```bash
cd flask_api
# Activate virtual environment if not already activated
python app.py
```

### 3. Start Node.js Server (Terminal 2)
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

### 4. Access the application
Open your browser and navigate to: `http://localhost:3000`

## Project Structure

```
Unthinkable_Backend_Project/
├── models/
│   └── Task.js              # Task schema
├── routes/
│   ├── index.js             # Home routes
│   ├── tasks.js             # Task CRUD routes
│   └── ai.js                # AI integration routes
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── tasks/
│   │   ├── index.ejs        # All tasks view
│   │   ├── new.ejs          # Create task form
│   │   ├── show.ejs         # Single task view
│   │   └── edit.ejs         # Edit task form
│   ├── index.ejs            # Home page
│   ├── 404.ejs              # 404 page
│   └── error.ejs            # Error page
├── public/
│   ├── css/
│   │   └── style.css        # Styles
│   └── js/
│       ├── main.js          # Main JS
│       └── ai-suggestions.js # AI functionality
├── flask_api/
│   ├── app.py               # Flask server
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Flask environment variables
├── server.js                # Express server
├── package.json             # Node dependencies
├── .env                     # Node environment variables
└── README.md                # This file
```

## API Endpoints

### Node.js API
- `GET /` - Home page
- `GET /tasks` - List all tasks
- `GET /tasks/new` - Create task form
- `POST /tasks` - Create new task
- `GET /tasks/:id` - View single task
- `GET /tasks/:id/edit` - Edit task form
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Flask AI API
- `POST /api/suggest` - Get AI suggestions for a task
- `POST /api/priority` - Get AI priority recommendation
- `GET /health` - Health check

## Usage

1. **Create a Task**: Click "New Task" and fill in the details
2. **Get AI Suggestions**: Click "Get AI Suggestions" on the task form
3. **View Tasks**: See all your tasks on the tasks page
4. **Update Status**: Edit tasks to change priority, status, or other details
5. **Delete Tasks**: Remove completed or unwanted tasks

## Development

For development with auto-reload:
```bash
npm run dev
```

## Troubleshooting

- **MongoDB connection error**: Ensure MongoDB is running
- **Flask API not responding**: Check if Flask server is running on port 5000
- **Gemini API errors**: Verify your API key is correct and has proper permissions
- **Port already in use**: Change the PORT in .env file

## License

ISC

## Author

Your Name
