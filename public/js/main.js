// Main JavaScript file
console.log('Smart Task Planner loaded');

// Confirmation for delete actions
document.addEventListener('DOMContentLoaded', () => {
  // Add any global event listeners here
  
  // Example: Handle task status updates
  const statusSelects = document.querySelectorAll('select[name="status"]');
  statusSelects.forEach(select => {
    select.addEventListener('change', (e) => {
      console.log('Status changed to:', e.target.value);
    });
  });
});
