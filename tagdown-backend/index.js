require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const admin = require('firebase-admin');

// Inicializa o Firebase Admin
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  // Tenta inicializar sem credenciais explícitas (para ambientes como o Google Cloud)
  try {
    admin.initializeApp();
  } catch (e) {
    console.error("Failed to initialize Firebase Admin without explicit credentials:", e);
  }
}

const db = admin.firestore();
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = 3001; // Porta para o backend

// Middleware de limite de requisições com Firestore
const rateLimiter = async (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const ip = req.ip;
    const identifier = userId || ip;
    const limit = userId ? 20 : 5;

    const userRequestRef = db.collection('user_requests').doc(identifier);

    try {
        const doc = await userRequestRef.get();
        let currentCount = 0;
        let lastRequest = null;

        if (doc.exists) {
            currentCount = doc.data().count;
            lastRequest = doc.data().lastRequest.toDate();
        }

        const now = new Date();
        // Reseta a contagem se a última requisição foi há mais de 24 horas
        if (lastRequest && (now - lastRequest) > 24 * 60 * 60 * 1000) {
            currentCount = 0;
        }

        if (currentCount >= limit) {
            return res.status(429).json({ message: 'Too Many Requests' });
        }

        const newCount = currentCount + 1;
        await userRequestRef.set({
            count: newCount,
            lastRequest: admin.firestore.Timestamp.now()
        }, { merge: true });

        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', limit - newCount);

        next();
    } catch (error) {
        console.error("Error in rate limiter:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

app.use(cors({
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
}));
app.set('trust proxy', true); // Necessário para obter o IP correto atrás de um proxy

app.get('/proxy', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get(url, {
      responseType: 'stream',
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);

  } catch (error) {
    console.error('Error fetching the URL:', error.message);
    res.status(error.response ? error.response.status : 500).json({ message: error.message });
  }
});

// Aplica o middleware de limite de requisições às rotas do Instagram
app.get('/instagram-profile', rateLimiter, async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send('Username is required');
  }

  try {
    const response = await axios.get(`https://instagram-scraper-20251.p.rapidapi.com/userinfo/?username_or_id=${username}`, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'instagram-scraper-20251.p.rapidapi.com'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Instagram profile:', error.message);
    res.status(error.response ? error.response.status : 500).json({ message: error.message });
  }
});

app.get('/instagram-posts', rateLimiter, async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send('Username is required');
  }

  try {
    const response = await axios.get(`https://instagram-scraper-20251.p.rapidapi.com/userposts/?username_or_id=${username}`, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'instagram-scraper-20251.p.rapidapi.com'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error.message);
    res.status(error.response ? error.response.status : 500).json({ message: error.message });
  }
});

app.get('/instagram-post-dl', rateLimiter, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get(`https://instagram-looter2.p.rapidapi.com/post-dl?url=${encodeURIComponent(url)}`, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'instagram-looter2.p.rapidapi.com'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Instagram post-dl:', error.message);
    res.status(error.response ? error.response.status : 500).json({ message: error.message });
  }
});

app.get('/instagram-post-info', rateLimiter, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get(`https://instagram-looter2.p.rapidapi.com/post?url=${encodeURIComponent(url)}`, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'instagram-looter2.p.rapidapi.com'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Instagram post-info:', error.message);
    res.status(error.response ? error.response.status : 500).json({ message: error.message });
  }
});

app.get('/tiktok-video', rateLimiter, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get('https://tiktok-video-no-watermark2.p.rapidapi.com/', {
      params: {
        url: url,
        hd: 1,
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TikTok video:', error.message);
    res.status(error.response ? error.response.status : 500).json({ message: error.message });
  }
});

app.get('/request-status', async (req, res) => {
    const userId = req.headers['x-user-id'];
    const ip = req.ip;
    const identifier = userId || ip;
    const limit = userId ? 20 : 5;

    const userRequestRef = db.collection('user_requests').doc(identifier);

    try {
        const doc = await userRequestRef.get();
        let currentCount = 0;
        let lastRequest = null;

        if (doc.exists) {
            currentCount = doc.data().count;
            lastRequest = doc.data().lastRequest.toDate();
        }

        const now = new Date();
        if (lastRequest && (now - lastRequest) > 24 * 60 * 60 * 1000) {
            currentCount = 0;
        }

        const remaining = limit - currentCount;

        res.json({
            limit,
            remaining: remaining < 0 ? 0 : remaining,
            used: currentCount
        });
    } catch (error) {
        console.error("Error fetching request status:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/convert-to-audio', (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');

    ffmpeg(url)
      .toFormat('mp3')
      .on('error', (err) => {
        console.error('An error occurred: ' + err.message);
        if (!res.headersSent) {
          res.status(500).send('Error during conversion');
        }
      })
      .pipe(res, { end: true });
      
  } catch (error) {
    console.error('Error setting up ffmpeg:', error.message);
    if (!res.headersSent) {
      res.status(500).send('Error setting up conversion');
    }
  }
});

// Export the app for Vercel
module.exports = app;

// Start the server only if not in a serverless environment
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
