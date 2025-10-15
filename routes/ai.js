const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get AI suggestions for task
router.post('/suggest', async (req, res) => {
  try {
    const { taskTitle, taskDescription } = req.body;
    
    // Call Flask API with Gemini
    const response = await axios.post(`${process.env.FLASK_API_URL}/api/suggest`, {
      title: taskTitle,
      description: taskDescription
    });
    
    res.json({ 
      success: true, 
      suggestions: response.data.suggestions 
    });
  } catch (error) {
    console.error('AI API Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get AI suggestions' 
    });
  }
});

// Get task priority recommendation
router.post('/priority', async (req, res) => {
  try {
    const { taskTitle, taskDescription, dueDate } = req.body;
    
    const response = await axios.post(`${process.env.FLASK_API_URL}/api/priority`, {
      title: taskTitle,
      description: taskDescription,
      dueDate: dueDate
    });
    
    res.json({ 
      success: true, 
      priority: response.data.priority,
      reasoning: response.data.reasoning
    });
  } catch (error) {
    console.error('AI API Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get priority recommendation' 
    });
  }
});

module.exports = router;
