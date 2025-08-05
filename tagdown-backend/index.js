require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = 3001; // Porta para o backend

// Armazenamento em memória para contagem de requisições
const requestCounts = {};

// Limpa a contagem de requisições a cada 24 horas
setInterval(() => {
    for (const key in requestCounts) {
        delete requestCounts[key];
    }
    console.log('Request counts cleared.');
}, 24 * 60 * 60 * 1000); // 24 horas

// Middleware de limite de requisições
const rateLimiter = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const ip = req.ip;
    const identifier = userId || ip;
    const limit = userId ? 20 : 5;

    const currentCount = requestCounts[identifier] || 0;

    if (currentCount >= limit) {
        return res.status(429).json({ message: 'Too Many Requests' });
    }

    requestCounts[identifier] = currentCount + 1;

    // Envia os limites nos headers da resposta
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', limit - requestCounts[identifier]);

    next();
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
    res.status(error.response ? error.response.status : 500).send(error.message);
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
    res.status(error.response ? error.response.status : 500).send(error.message);
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
    res.status(error.response ? error.response.status : 500).send(error.message);
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
    res.status(error.response ? error.response.status : 500).send(error.message);
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
    res.status(error.response ? error.response.status : 500).send(error.message);
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
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

app.get('/request-status', (req, res) => {
    const userId = req.headers['x-user-id'];
    const ip = req.ip;
    const identifier = userId || ip;
    const limit = userId ? 20 : 5;
    const currentCount = requestCounts[identifier] || 0;
    const remaining = limit - currentCount;

    res.json({
        limit,
        remaining: remaining < 0 ? 0 : remaining,
        used: currentCount
    });
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
