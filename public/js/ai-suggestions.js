// AI Suggestions functionality
document.addEventListener('DOMContentLoaded', () => {
  const getAIButton = document.getElementById('getAISuggestions');
  const aiSuggestionsBox = document.getElementById('aiSuggestionsBox');
  const aiSuggestionsText = document.getElementById('aiSuggestionsText');
  const aiSuggestionsInput = document.getElementById('aiSuggestions');
  
  if (getAIButton) {
    getAIButton.addEventListener('click', async () => {
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const dueDate = document.getElementById('dueDate').value;
      
      if (!title) {
        alert('Please enter a task title first');
        return;
      }
      
      // Show loading state
      getAIButton.disabled = true;
      getAIButton.textContent = '🤖 Analyzing task...';
      aiSuggestionsBox.style.display = 'none';
      
      try {
        const response = await fetch('/api/ai/suggest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            taskTitle: title,
            taskDescription: description,
            dueDate: dueDate
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Format the suggestions with HTML
          const formattedSuggestions = formatAISuggestions(data.suggestions);
          aiSuggestionsText.innerHTML = formattedSuggestions;
          
          // Store in hidden input to save with form
          if (aiSuggestionsInput) {
            aiSuggestionsInput.value = data.suggestions;
          }
          
          aiSuggestionsBox.style.display = 'block';
          
          // Smooth scroll to suggestions
          aiSuggestionsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          alert('Failed to get AI suggestions. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to AI service. Make sure the Flask API is running.');
      } finally {
        getAIButton.disabled = false;
        getAIButton.textContent = '🤖 Get AI Suggestions';
      }
    });
  }
  
  // Format AI suggestions with better HTML structure
  function formatAISuggestions(text) {
    // Convert markdown-style formatting to HTML
    let formatted = text
      // Headers (**, **, and emoji headers like 📋)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Paragraphs
      .replace(/\n\n+/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br>');
    
    // Wrap in paragraph
    formatted = '<p>' + formatted + '</p>';
    
    // Format numbered lists with better spacing
    formatted = formatted.replace(/(\d+\.)\s/g, '<br><br><strong>$1</strong> ');
    
    // Format bullet points
    formatted = formatted.replace(/<br>-\s/g, '<br>• ');
    
    // Add spacing for emoji headers (for better visual sections)
    formatted = formatted.replace(/([📋🎯⏱️⚠️❌✅🛠️📊])\s*<strong>/g, '<br><br>$1 <strong style="font-size: 1.15rem;">');
    
    // Clean up multiple breaks
    formatted = formatted.replace(/(<br>){3,}/g, '<br><br>');
    
    return formatted;
  }
  
  // Get AI priority recommendation
  const getPriorityButton = document.getElementById('getAIPriority');
  if (getPriorityButton) {
    getPriorityButton.addEventListener('click', async () => {
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const dueDate = document.getElementById('dueDate').value;
      
      if (!title) {
        alert('Please enter a task title first');
        return;
      }
      
      try {
        const response = await fetch('/api/ai/priority', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            taskTitle: title,
            taskDescription: description,
            dueDate: dueDate
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          document.getElementById('priority').value = data.priority;
          alert(`AI recommends priority: ${data.priority}\n\nReason: ${data.reasoning}`);
        } else {
          alert('Failed to get priority recommendation.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to AI service.');
      }
    });
  }
});
