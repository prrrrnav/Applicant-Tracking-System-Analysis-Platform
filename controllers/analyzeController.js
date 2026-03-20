import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { analyzeWithGPT, optimizeWithGPT } from "../services/gptService.js";
import { Document, Packer, Paragraph, TextRun } from "docx";

/* ============================================================
   ANALYZE RESUME
============================================================ */
export const analyzeResume = async (req, res) => {
  try {
    const file = req.file;
    const jobDescription = req.body.jd;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    let resumeText = "";

    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      resumeText = data.text;
    } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      resumeText = result.value;
    } else if (file.mimetype === "text/plain") {
      resumeText = file.buffer.toString("utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const analysis = await analyzeWithGPT(resumeText, jobDescription);

    return res.status(200).json({ message: "Resume analyzed successfully", analysis });
  } catch (err) {
    console.error("Error analyzing resume:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================================================
   GENERATE OPTIMIZED RESUME
============================================================ */
export const generateOptimizedResume = async (req, res) => {
  try {
    const file = req.file;
    const jobDescription = req.body.jd;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    let resumeText = "";

    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      resumeText = data.text;
    } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      resumeText = result.value;
    } else if (file.mimetype === "text/plain") {
      resumeText = file.buffer.toString("utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const optimized = await optimizeWithGPT(resumeText, jobDescription, 98, "confident and enthusiastic");

    // Return structured JSON — frontend renders it beautifully
    return res.status(200).json({
      message: "Optimized resume generated successfully",
      optimizedResume: optimized,
    });
  } catch (err) {
    console.error("Error generating optimized resume:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};