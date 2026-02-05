📄 Resume ATS Analyzer – Node.js + OpenAI GPT-4o + Redis

A production-ready Resume ATS Analyzer API that processes resumes, extracts text, evaluates them against job descriptions, generates ATS scores, and produces fully optimized resumes using GPT-4o.
Includes Redis caching and optional Docker containerization for scalable performance.

🚀 Features

✔ Upload PDF / DOCX / TXT resumes

✔ Extract text using custom parsers

✔ ATS score generation using GPT-4o

✔ Missing keywords, matched skills, & resume strength analysis

✔ AI-powered resume rewriting (optimized JSON output)

✔ Redis caching for fast repeated requests

✔ Clean MVC file structure

✔ Multer memory upload (no temp files)

✔ Dockerized backend + Redis

✔ Error-safe JSON extraction from GPT responses

🧠 Tech Stack
Layer	Technology
Backend API	Node.js, Express
AI Engine	OpenAI GPT-4o
Caching	Redis (ioredis)
File Uploads	Multer (memory storage)
File Parsing	pdf-parse, docx
Logging	console logs + error-safe JSON wrapping
Containerization	Docker & Docker Compose
Environment	dotenv
📁 Project Structure
Resume-Analyser/
│
├── config/
│   └── redis.js                # Redis client (Docker-ready)
│
├── controllers/
│   └── analyzeController.js    # All route logic
│
├── services/
│   ├── gptService.js           # GPT scoring + optimization + caching
│   └── parserService.js        # PDF/DOCX parsing
│
├── middleware/
│   └── upload.js               # Multer memory storage
│
├── routes/
│   └── analyzeRoutes.js        # API endpoints
│
├── view/                       # ATS UI (optional frontend)
│
├── Dockerfile                  # Node.js backend container
├── docker-compose.yml          # Backend + Redis stack
├── .dockerignore
├── package.json
├── app.js
└── README.md

🔐 Environment Variables

Create a .env file:

OPENAI_API_KEY=your_api_key_here
PORT=5000
MY_SECRET_KEY=test-key
pass "test-key" as header authorization

# Redis (works locally & in Docker)
REDIS_HOST=redis
REDIS_PORT=6379

🧪 API Routes
1️⃣ Analyze Resume (ATS Score)

POST /api/analyze

Uploads: resume file + job description
Returns: ATS score breakdown, matched/missing skills, summary, improvements.

📸 Insert Postman screenshot for /api/analyze here
(Paste image after pushing README)

2️⃣ Optimize Resume (Rewrite using GPT-4o)

POST /api/optimize

Returns: JSON resume with fields:

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


📸 Insert Postman screenshot for /api/optimize here

3️⃣ Health Check

GET /health

📸 Insert health check screenshot here

⚡ Redis Caching

Your GPT responses are cached automatically:

Analysis Cache Key
analysis:<sha256(resume + jd)>

Optimized Resume Cache Key
optimized:<sha256(resume + jd + tone + goal)>

Cache Expiry
1 hour (3600 seconds)

Benefits

⚡ 80–95% faster responses

💰 Saves OpenAI cost

🔁 No repeated GPT calls for same files

🚀 Run Locally (Without Docker)
1️⃣ Install dependencies
npm install

2️⃣ Start local Redis

Using Docker:

docker run -d --name redis -p 6379:6379 redis


Or if you have Redis installed:

redis-server

3️⃣ Start server
npm run dev


API runs at:

http://localhost:5000

🐳 Docker Setup (Recommended)

Runs Node.js backend AND Redis in containers.

1️⃣ Dockerfile (already in repo)
2️⃣ docker-compose.yml (already in repo)
Start Stack:
docker-compose up --build


If you want detached mode:

docker-compose up -d

Stop Stack:
docker-compose down

🛠 Troubleshooting
Redis port already in use
docker ps
docker stop <redis_container>
docker rm <redis_container>

Slow build (Transferring Context)

Add .dockerignore (already done):

node_modules
.git
.env

🧼 Future Enhancements

Resume → PDF export

Frontend dashboard with React

Rate limiting

User authentication

Resume templates

Multi-language support

⭐ Support

If this project helped you:
🌟 Star the repository — it motivates future updates!
💬 Open issues for bug reports or feature requests.

🤝 Author

Built by Pranav Tiwari
AI-powered. Dockerized. Production ready.