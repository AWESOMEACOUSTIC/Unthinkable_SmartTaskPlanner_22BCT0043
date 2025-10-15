from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

try:
    import google.generativeai as genai
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    
    print("Available Gemini models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
    
    model_names = [
        'gemini-2.0-flash',
        'gemini-flash-latest',
        'gemini-pro-latest',
        'gemini-2.5-flash',
        'gemini-2.0-flash-001'
    ]
    
    model = None
    for model_name in model_names:
        try:
            model = genai.GenerativeModel(model_name)
            print(f"Successfully initialized model: {model_name}")
            break
        except Exception as e:
            print(f"Failed to initialize {model_name}: {e}")
            continue
    
    if model is None:
        raise Exception("No compatible Gemini model found")
    
    GEMINI_AVAILABLE = True
except Exception as e:
    print(f"Warning: Gemini AI not available: {e}")
    GEMINI_AVAILABLE = False
    model = None

@app.route('/api/suggest', methods=['POST'])
def get_suggestions():
    """Get AI suggestions for a task with comprehensive phase-wise breakdown"""
    try:
        data = request.json
        title = data.get('title', '')
        description = data.get('description', '')
        due_date = data.get('dueDate', '')
        
        if not GEMINI_AVAILABLE:
            return jsonify({
                'success': True,
                'suggestions': 'AI service is currently unavailable. Please add your own task details.'
            })
        
        prompt = f"""
You are an expert project manager and task planner. Analyze this task and provide a comprehensive, actionable plan:

**Task Title:** {title}
**Description:** {description}
**Due Date:** {due_date if due_date else 'Not specified'}

Please provide a detailed analysis with the following structure:

**📋 TASK OVERVIEW**
Briefly summarize what this task entails and its key objectives.

**🎯 PHASE-WISE BREAKDOWN WITH TIMELINE**
Divide the task into 3-5 logical phases. For each phase:
- **Phase Name** (Estimated Time: X hours/days)
- Key activities and deliverables
- Success criteria

**⏱️ REALISTIC TIMELINE**
Provide a realistic timeline breakdown:
- Total estimated time
- Time allocation per phase
- Buffer time for unexpected delays (10-20%)

**⚠️ POTENTIAL OBSTACLES & SOLUTIONS**
List 3-5 major challenges with:
- **Obstacle:** [Description]
- **Likelihood:** High/Medium/Low
- **Impact:** High/Medium/Low
- **Solution:** [How to overcome it]
- **Preventive Action:** [How to avoid it]

**❌ WHAT TO AVOID**
- List 3-5 common mistakes or pitfalls
- Explain why each should be avoided
- Provide alternatives

**✅ BEST PRACTICES**
- 3-5 proven strategies for success
- Tips for efficiency and quality
- Quick wins to build momentum

**🛠️ RECOMMENDED TOOLS & RESOURCES**
- Tools/software that can help
- Learning resources (if applicable)
- Templates or frameworks to use

**📊 SUCCESS METRICS**
- How to measure progress
- Key milestones to track
- Definition of "done"

Format your response using clear sections with bold headers and bullet points for readability.
Keep the total response comprehensive but focused (400-600 words).
"""
        
        response = model.generate_content(prompt)
        suggestions = response.text
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/priority', methods=['POST'])
def get_priority():
    """Get AI recommendation for task priority"""
    try:
        data = request.json
        title = data.get('title', '')
        description = data.get('description', '')
        due_date = data.get('dueDate', '')
        
        if not GEMINI_AVAILABLE:
            return jsonify({
                'success': True,
                'priority': 'medium',
                'reasoning': 'AI service unavailable. Default priority set to medium.'
            })
        
        prompt = f"""
        Analyze this task and recommend a priority level (high, medium, or low):
        
        Task Title: {title}
        Description: {description}
        Due Date: {due_date if due_date else 'Not specified'}
        
        Respond in this exact format:
        Priority: [high/medium/low]
        Reasoning: [brief explanation in one sentence]
        """
        
        response = model.generate_content(prompt)
        result = response.text
        
        # Parse the response
        lines = result.strip().split('\n')
        priority = 'medium'
        reasoning = 'Unable to determine priority'
        
        for line in lines:
            if line.startswith('Priority:'):
                priority = line.split(':')[1].strip().lower()
            elif line.startswith('Reasoning:'):
                reasoning = line.split(':')[1].strip()
        
        return jsonify({
            'success': True,
            'priority': priority,
            'reasoning': reasoning
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'gemini_available': GEMINI_AVAILABLE
    })

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=True, port=port)
