import { OpenAI } from 'openai';
import redis from "../config/redis.js";
import crypto from "crypto";

let openaiClient;

const getOpenAIClient = () => {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
};

/* ============================================================
   ANALYZE WITH GPT (WITH REDIS CACHING)
============================================================ */
const analyzeWithGPT = async (resumeText, jd) => {
  const hashInput = resumeText + jd;
  const cacheKey = "analysis:" + crypto.createHash("sha256").update(hashInput).digest("hex");

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("⚡ Returning cached ANALYSIS");
    return JSON.parse(cached);
  }

  console.log("⏳ Cache miss → Calling GPT (analysis)...");

  const prompt = `Analyze the resume against the job description.

Return ONLY valid JSON (no markdown, no backticks):
{
  "score": {
    "total": number (0-100),
    "skillsMatch": number (0-100),
    "experience": number (0-100),
    "education": number (0-100),
    "certifications": number (0-100),
    "formatting": number (0-100),
    "keywords": number (0-100)
  },
  "keywords": {
    "matched": string[],
    "missing": string[]
  },
  "missingSkills": string[],
  "strengths": string[],
  "improvements": {
    "skills": string[],
    "experience": string[],
    "formatting": string[]
  },
  "summary": string
}

All scores MUST be 0–100 integers. Do not use 0–10 scale.

Resume:
${resumeText}

Job Description:
${jd}`;

  const start = Date.now();
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are an ATS resume evaluator. Return only valid JSON. All scores must be 0-100 integers." },
      { role: "user", content: prompt },
    ],
    max_tokens: 900,
    temperature: 0.1,
  });

  console.log(`Response time: ${(Date.now() - start) / 1000}s`);

  let raw = response.choices[0].message.content.trim();
  if (raw.startsWith("```")) raw = raw.replace(/```(?:json)?/g, "").trim();

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid JSON returned from GPT");

  let result;
  try {
    result = JSON.parse(raw.slice(firstBrace, lastBrace + 1));
  } catch (err) {
    console.error("GPT JSON parse error:", err);
    throw new Error("GPT returned invalid JSON");
  }

  await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);
  return result;
};

/* ============================================================
   OPTIMIZE RESUME WITH GPT (WITH REDIS CACHING)
============================================================ */
const optimizeWithGPT = async (resumeText, jd, goalScore = 95, tone = "professional and concise") => {
  const hashInput = resumeText + jd + goalScore + tone;
  const cacheKey = "optimized:" + crypto.createHash("sha256").update(hashInput).digest("hex");

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("⚡ Returning cached OPTIMIZED RESUME");
    return JSON.parse(cached);
  }

  console.log("⏳ Cache miss → Calling GPT (optimize)...");

  const prompt = `You are an expert ATS resume writer. Optimize the resume below for the given job description.

Return ONLY valid JSON (no markdown, no backticks, no extra text) in this exact structure:

{
  "name": "Full Name",
  "title": "Professional title/role (e.g. Software Engineer — Distributed Systems & AI Platforms)",
  "contact": {
    "location": "City, Country",
    "phone": "+XX XXXXX XXXXX",
    "email": "email@example.com",
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username"
  },
  "summary": "2-3 sentence professional summary optimized for ATS and the job description.",
  "skills": {
    "languages": ["Go", "Python", "JavaScript"],
    "backend": ["Node.js", "Express.js", "REST APIs"],
    "databases": ["MongoDB", "PostgreSQL", "Redis"],
    "devops": ["Docker", "AWS EC2", "Kubernetes", "CI/CD"],
    "ai_ml": ["OpenAI API", "OpenCV"]
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "period": "Month Year – Month Year",
      "bullets": [
        "Achievement-focused bullet with metrics",
        "Another strong bullet point"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "stack": ["Go", "Redis", "Docker"],
      "period": "Month Year – Month Year",
      "bullets": [
        "Strong achievement bullet with impact metrics",
        "Another bullet"
      ]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "location": "City",
      "period": "Graduating Month Year"
    }
  ],
  "certifications": [
    "Certification name — Issuing Body"
  ],
  "achievements": [
    "Achievement description"
  ]
}

Rules:
- All bullet points must start with strong action verbs
- Include specific metrics and impact wherever possible
- Optimize all content for ATS keyword matching with the job description
- Keep the tone: ${tone}
- Target ATS score: ${goalScore}+

Resume:
${resumeText}

Job Description:
${jd}`.trim();

  const openai = getOpenAIClient();
  const start = Date.now();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert ATS resume optimizer. Return only valid JSON with no backticks or markdown.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 2000,
    temperature: 0.2,
  });

  console.log(`Response time: ${(Date.now() - start) / 1000}s`);

  let rawContent = response.choices[0].message.content.trim();
  if (rawContent.startsWith("```")) rawContent = rawContent.replace(/```(?:json)?/g, "").trim();

  const firstBrace = rawContent.indexOf("{");
  const lastBrace = rawContent.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) throw new Error("Could not find JSON in GPT response");

  let result;
  try {
    result = JSON.parse(rawContent.slice(firstBrace, lastBrace + 1));
  } catch (err) {
    console.error("Parsing error:", err);
    throw new Error("Invalid JSON returned from GPT.");
  }

  await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);
  return result;
};

export { optimizeWithGPT, analyzeWithGPT };