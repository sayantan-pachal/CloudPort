require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase securely using Environment Variables
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

// Strict CORS Configuration linked to your Vercel URL
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).send('CloudPort Backend Node is Active');
});

// Main POST Endpoint
app.post('/register', async (req, res) => {
    try {
        const { name, email, department, interest } = req.body;

        if (!name || !email || !department || !interest) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const docRef = await db.collection('registrations').add({
            name, 
            email, 
            department, 
            interest,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            clientTimestamp: req.body.timestamp || new Date().toISOString()
        });

        return res.status(200).json({ 
            success: true, 
            documentId: docRef.id 
        });

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});