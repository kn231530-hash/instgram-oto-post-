import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API endpoint for Autonomous Reel AI Generation
app.post('/api/generate-reel', async (req, res) => {
  const { topic, niche, tone, duration } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      success: false,
      isFallback: true,
      message: 'GEMINI_API_KEY not found in environment. Fallback templates activated.'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the Autonomous Creator Engine for digital solopreneurs, high-velocity creators, and Fiverr/agency editors.
Generate a high-converting short-form Reel/TikTok package for:
Topic: "${topic || 'AI tools replacing 5-figure agency workflows'}"
Niche: "${niche || 'Solopreneur & SaaS Growth'}"
Tone: "${tone || 'High-Octane Founder'}"
Duration: "${duration || '30s'}"

Respond strictly with valid JSON with this exact schema:
{
  "hook": "Strong 1-line hook (under 10 words) that stops scrolling immediately",
  "hookSub": "Supporting sub-hook (12-18 words) highlighting pain/transformation",
  "captions": [
    { "time": "00:00 - 00:04", "text": "Hook text displayed in bold kinetic style", "emphasis": "critical" },
    { "time": "00:04 - 00:10", "text": "Core problem or shocking insight", "emphasis": "high" },
    { "time": "00:10 - 00:18", "text": "The 3-step automated solution / tool reveal", "emphasis": "standard" },
    { "time": "00:18 - 00:25", "text": "Proof of result or MRR multiplier metric", "emphasis": "standard" },
    { "time": "00:25 - 00:30", "text": "Comment keyword CTA trigger for DM automation", "emphasis": "cta" }
  ],
  "fullScript": "Complete spoken voiceover script in natural fast-paced cadence",
  "viralityScore": 94,
  "retentionPrediction": "88% completion rate with peak drop-off at second 19",
  "audioRecommendation": "Dark Phonk 130BPM or Cyber Synth Pulse",
  "instagramCaption": "Instagram caption complete with hook, key points, CTA and 5 relevant hashtags",
  "fiverrDeliverableNotes": "Ready for 4K 60fps export. Clean b-roll pacing recommended."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      data: parsed
    });
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    return res.status(200).json({
      success: false,
      isFallback: true,
      error: error.message || 'Generation failed'
    });
  }
});

// Mount Vite in development or serve static in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Autonomous Creator Engine running at http://localhost:${PORT}`);
});
