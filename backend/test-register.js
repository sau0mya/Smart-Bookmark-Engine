const axios = require('axios');

async function testRegister() {
    try {
        console.log('Attempting to hit http://localhost:5000/api/auth/register...');
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'saumyaa',
            email: 'saumyakatiyar1930@gmail.com',
            password: 'password123'
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.log('--- Error Caught ---');
        if (err.response) {
            console.log('Error Status:', err.response.status);
            console.log('Error Data:', JSON.stringify(err.response.data, null, 2));
        } else if (err.request) {
            console.log('No response received. Request was made.');
            console.log('Error Code:', err.code);
            console.log('Error Message:', err.message);
        } else {
            console.log('Error setting up request:', err.message);
        }
    }
}

testRegister();
