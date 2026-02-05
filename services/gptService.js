import { OpenAI } from 'openai';
import redis from "../config/redis.js";
import crypto from "crypto";

let openaiClient;

const getOpenAIClient = () => {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
};

/* ============================================================
   ANALYZE WITH GPT (WITH REDIS CACHING)
============================================================ */
const analyzeWithGPT = async (resumeText, jd) => {

  // Create cache key
  const hashInput = resumeText + jd;
  const cacheKey =
    "analysis:" + crypto.createHash("sha256").update(hashInput).digest("hex");

  // 1️⃣ Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("⚡ Returning cached ANALYSIS");
    return JSON.parse(cached);
  }

  console.log("⏳ Cache miss → Calling GPT (analysis)...");

  const prompt = `Analyze the resume against the job description.

Return ONLY valid JSON:
{
  "score": {
    "total": number,
    "skillsMatch": number,
    "experience": number,
    "education": number,
    "certifications": number,
    "formatting": number,
    "keywords": number
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

Resume:
${resumeText}

Job Description:
${jd}
`;

  const start = Date.now();
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are an ATS resume evaluator." },
      { role: "user", content: prompt },
    ],
    max_tokens: 700,
  });

  console.log(`Response time: ${(Date.now() - start) / 1000}s`);

  // Extract JSON string
  let raw = response.choices[0].message.content.trim();

  if (raw.startsWith("```")) {
    raw = raw.replace(/```(?:json)?/g, "").trim();
  }

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Invalid JSON returned from GPT");
  }

  const jsonString = raw.slice(firstBrace, lastBrace + 1);

  // 2️⃣ Parse JSON
  let result;
  try {
    result = JSON.parse(jsonString);
  } catch (err) {
    console.error("GPT JSON parse error:", err);
    throw new Error("GPT returned invalid JSON");
  }

  // 3️⃣ Save to Redis
  await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);

  return result;
};

/* ============================================================
   OPTIMIZE RESUME WITH GPT (WITH REDIS CACHING)
============================================================ */
const optimizeWithGPT = async (
  resumeText,
  jd,
  goalScore = 95,
  tone = "professional and concise"
) => {
  const hashInput = resumeText + jd + goalScore + tone;
  const cacheKey =
    "optimized:" + crypto.createHash("sha256").update(hashInput).digest("hex");

  // 1️⃣ Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("⚡ Returning cached OPTIMIZED RESUME");
    return JSON.parse(cached);
  }

  console.log("⏳ Cache miss → Calling GPT (optimize)...");

  const prompt = `
Here is the candidate's resume:
---
${resumeText}

Here is the job description:
---
${jd}

Optimize this resume using ATS standards.
Return ONLY valid JSON:
{
  "name": "",
  "contact_information": "",
  "technical_skills": "",
  "professional_overview": "",
  "professional_experience": "",
  "projects": "",
  "education": "",
  "awards_and_achievements": ""
}
  `.trim();

  const openai = getOpenAIClient();
  const start = Date.now();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an ATS resume optimizer. Return only valid JSON with no backticks.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 1400,
    temperature: 0.3,
  });

  console.log(`Response time: ${(Date.now() - start) / 1000}s`);

  let rawContent = response.choices[0].message.content.trim();

  if (rawContent.startsWith("```")) {
    rawContent = rawContent.replace(/```(?:json)?/g, "").trim();
  }

  const firstBrace = rawContent.indexOf("{");
  const lastBrace = rawContent.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Could not find JSON in GPT response");
  }

  const jsonString = rawContent.slice(firstBrace, lastBrace + 1);

  let result;
  try {
    result = JSON.parse(jsonString);
  } catch (err) {
    console.error("Parsing error:", err);
    throw new Error("Invalid JSON returned from GPT.");
  }

  // Save to Redis
  await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);

  return result;
};

export { optimizeWithGPT, analyzeWithGPT };
