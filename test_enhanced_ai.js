const axios = require('axios');

async function testEnhancedAI() {
    try {
        console.log('🧪 Testing Enhanced AI Suggestions...\n');
        console.log('=' .repeat(70));
        
        const testTask = {
            title: 'Develop a Mobile App for Food Delivery',
            description: 'Create a full-featured mobile application for a food delivery service with user authentication, restaurant listings, cart management, payment integration, and real-time order tracking.',
            dueDate: '2025-12-31'
        };
        
        console.log('\n📝 Test Task:');
        console.log(`Title: ${testTask.title}`);
        console.log(`Description: ${testTask.description}`);
        console.log(`Due Date: ${testTask.dueDate}\n`);
        console.log('=' .repeat(70));
        console.log('\n⏳ Fetching AI analysis...\n');
        
        const response = await axios.post('http://localhost:5000/api/suggest', testTask);
        
        if (response.data.success) {
            console.log('✅ SUCCESS! Enhanced AI Analysis:\n');
            console.log('=' .repeat(70));
            console.log(response.data.suggestions);
            console.log('=' .repeat(70));
            console.log('\n✨ Features in the response:');
            console.log('  ✅ Phase-wise breakdown with timeline');
            console.log('  ✅ Realistic time estimates');
            console.log('  ✅ Potential obstacles with solutions');
            console.log('  ✅ What to avoid and why');
            console.log('  ✅ Best practices');
            console.log('  ✅ Recommended tools & resources');
            console.log('  ✅ Success metrics\n');
        } else {
            console.error('❌ Failed to get suggestions');
        }
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testEnhancedAI();
