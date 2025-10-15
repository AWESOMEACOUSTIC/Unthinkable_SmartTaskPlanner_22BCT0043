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

## Problems Faced & Solutions

During development, we encountered several challenges that were successfully resolved:

### 1. ❌ Gemini API Model Compatibility Issue

**Problem:**
- Initial implementation used `gemini-pro` model
- Error: `404 models/gemini-pro is not found for API version v1beta`
- AI suggestions completely failed with 500 errors

**Root Cause:**
The `gemini-pro` model name was deprecated for the v1beta API version. The API evolved and older model names were no longer supported.

**Solution:**
```python
# Added dynamic model detection in flask_api/app.py
# List all available models and try them in order of preference
model_names = [
    'gemini-2.0-flash',      # Latest stable model
    'gemini-flash-latest',
    'gemini-pro-latest',
    'gemini-2.5-flash'
]

# Successfully initialized with: gemini-2.0-flash
```

**Impact:** AI suggestions now work reliably with the latest Gemini models.

---

### 2. ❌ MongoDB Deprecation Warnings

**Problem:**
```
Warning: useNewUrlParser is a deprecated option
Warning: useUnifiedTopology is a deprecated option
```

**Root Cause:**
Mongoose driver version 4.0.0+ no longer requires these options as they are now default behavior.

**Solution:**
```javascript
// Before:
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// After:
mongoose.connect(process.env.MONGODB_URI)
```

**Impact:** Clean console output without deprecation warnings.

---

### 3. ❌ EJS Template Error - Undefined 'page' Variable

**Problem:**
```
ReferenceError: page is not defined
at eval ("header.ejs":12:26)
```

**Root Cause:**
Error handlers (404 and 500) were not passing the `page` variable to templates, causing runtime errors.

**Solution:**
```javascript
// Updated all route handlers to include page variable
app.use((req, res) => {
  res.status(404).render('404', { 
    title: 'Page Not Found',
    page: '404'  // Added this
  });
});

// Also made header.ejs more defensive
<a href="/" class="nav-link <%= typeof page !== 'undefined' && page === 'home' ? 'active' : '' %>">
```

**Impact:** No more template errors; graceful handling of missing variables.

---

### 4. ❌ Flask Virtual Environment Path Issues

**Problem:**
- Virtual environment packages not found
- `ModuleNotFoundError: No module named 'flask'`

**Root Cause:**
Multiple virtual environments created in different locations causing confusion in the Python path.

**Solution:**
```bash
# Created dedicated .venv in project root
python -m venv .venv

# Installed packages in correct environment
.venv\Scripts\python.exe -m pip install Flask flask-cors python-dotenv google-generativeai
```

**Impact:** Consistent Python environment across development sessions.

---

### 5. ❌ AI Suggestions Not Saving with Tasks

**Problem:**
Users could generate AI suggestions but they weren't saved to the database when creating tasks.

**Root Cause:**
No hidden input field to capture and submit AI suggestions with the form data.

**Solution:**
```html
<!-- Added hidden input in new.ejs -->
<input type="hidden" id="aiSuggestions" name="aiSuggestions">

<!-- JavaScript stores AI response -->
aiSuggestionsInput.value = data.suggestions;
```

**Impact:** AI suggestions now persist with tasks and are viewable later.

---

### 6. ❌ Limited AI Response Quality

**Problem:**
- Initial prompts returned generic, brief suggestions (~200 words)
- Lacked structure, timelines, and actionable insights
- No obstacle identification or risk management

**Root Cause:**
Basic prompt template without detailed instructions or structured output format.

**Solution:**
Enhanced prompt engineering with 8-section structure:
```python
prompt = f"""
You are an expert project manager and task planner...

**📋 TASK OVERVIEW**
**🎯 PHASE-WISE BREAKDOWN WITH TIMELINE**
**⏱️ REALISTIC TIMELINE**
**⚠️ POTENTIAL OBSTACLES & SOLUTIONS**
**❌ WHAT TO AVOID**
**✅ BEST PRACTICES**
**🛠️ RECOMMENDED TOOLS & RESOURCES**
**📊 SUCCESS METRICS**

Format: 400-600 words, structured sections...
"""
```

**Impact:** 
- Comprehensive 400-600 word responses
- Phase-wise breakdown with realistic timelines
- Obstacle identification with likelihood/impact ratings
- Actionable best practices and tool recommendations

---

### 7. ❌ Port Already in Use Errors

**Problem:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Root Cause:**
Previous Node.js processes not properly terminated before restarting.

**Solution:**
```powershell
# Kill existing Node processes before restart
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
npm start
```

**Impact:** Clean server restarts without port conflicts.

---

### 8. 🎨 Poor AI Suggestion Formatting

**Problem:**
Raw text display made long AI responses hard to read and unprofessional.

**Root Cause:**
No markdown-to-HTML conversion; plain text rendering in suggestions box.

**Solution:**
```javascript
// Added formatting function in ai-suggestions.js
function formatAISuggestions(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')  // Bold
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')              // Italic
    .replace(/\n\n+/g, '</p><p>')                         // Paragraphs
    .replace(/(\d+\.)\s/g, '<br><br><strong>$1</strong>') // Lists
    // ... more formatting
}
```

**CSS Enhancements:**
- Gradient purple header (#667eea → #764ba2)
- Scrollable content area (max 600px)
- Animated robot icon with pulse effect
- Custom scrollbar styling

**Impact:** 
- Professional, readable AI suggestions
- Beautiful visual presentation
- Enhanced user experience

---

## Key Takeaways

1. **Always check API documentation** for latest model names and supported features
2. **Keep dependencies updated** but watch for breaking changes
3. **Defensive programming** helps prevent template errors
4. **Virtual environments** should be consistent and well-documented
5. **Prompt engineering** dramatically impacts AI response quality
6. **User experience matters** - formatting and styling enhance perceived value
7. **Error handling** should be comprehensive at every layer

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
