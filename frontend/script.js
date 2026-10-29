// Placeholder for your GCP Cloud Function HTTP Trigger URL
const API_URL = "YOUR_GCP_CLOUD_FUNCTION_URL_HERE";

document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');
    
    statusMessage.className = 'status hidden';
    statusMessage.textContent = '';
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Authenticating...';

    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        department: document.getElementById('department').value,
        interest: document.getElementById('interest').value,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        statusMessage.textContent = 'Registration successful! Node active.';
        statusMessage.className = 'status success';
        document.getElementById('registrationForm').reset();

    } catch (error) {
        console.error('Error submitting form:', error);
        
        statusMessage.textContent = 'Connection failed. Please verify endpoint.';
        statusMessage.className = 'status error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register Now';
    }
});