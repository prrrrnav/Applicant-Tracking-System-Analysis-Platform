# 📄 Resume ATS Analysis Platform (Resume Club)

![Docker Image address](https://hub.docker.com/u/prrrranv)
![React](https://react.dev)
![Node.js](https://nodejs.org/en)
![Redis](https://redis.io)

An intelligent, Dockerized Applicant Tracking System (ATS) simulator and resume analysis tool. This application allows users to upload their resumes (PDF or DOCX) to receive AI-powered summaries, formatting feedback, and actionable insights to improve their job application success rate.

## ✨ Key Features

* **Intelligent Parsing:** Extracts text seamlessly from both PDF and DOCX files using `pdf-parse` and `mammoth`.
* **AI-Powered Analysis:** Leverages the OpenAI API to evaluate resume content, generating summaries and ATS-compatibility scores.
* **Interactive Dashboard:** Beautiful, animated frontend built with Framer Motion and Recharts for visualizing resume metrics.
* **High Performance:** Utilizes Redis for caching analysis results, significantly reducing API latency and OpenAI token usage.
* **Export Capabilities:** Generate and download optimized resume documents directly from the browser.

## 🛠️ Tech Stack

**Frontend (Client)**
* React 19 & Vite
* TailwindCSS (Styling)
* Framer Motion (Animations)
* Recharts (Data Visualization)
* React Dropzone (Drag-and-drop uploads)

**Backend (Server)**
* Node.js & Express
* OpenAI API
* Redis / ioredis (Caching)
* Multer (File Handling)

**Infrastructure & Deployment**
* Docker & Docker Compose

---

## 🚦 Prerequisites

Before you begin, ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* An active [OpenAI API Key](https://platform.openai.com/)

---

## 🐳 Running with Docker (Recommended)

This project is fully containerized. You can pull the pre-built images directly from Docker Hub or build it locally using Docker Compose.

### 1. Environment Setup (CRITICAL)
Your OpenAI API key must be provided securely. **Never commit this file to version control.**

Create a `.env` file in the root directory of the project:
```bash
touch .env