const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Smart Task Planner',
    page: 'home'
  });
});

// Dashboard
router.get('/dashboard', (req, res) => {
  res.redirect('/tasks');
});

module.exports = router;
