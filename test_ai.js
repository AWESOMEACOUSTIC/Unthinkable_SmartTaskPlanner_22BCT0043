const axios = require('axios');

async function testAI() {
    try {
        console.log('Testing AI API...');
        const response = await axios.post('http://localhost:5000/api/suggest', {
            title: 'Complete project documentation',
            description: 'Write comprehensive documentation for the Smart Task Planner project'
        });
        
        console.log('\n✅ SUCCESS!');
        console.log('\nAI Suggestions:');
        console.log(response.data.suggestions);
    } catch (error) {
        console.error('\n❌ ERROR:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Message:', error.message);
        }
    }
}

testAI();
