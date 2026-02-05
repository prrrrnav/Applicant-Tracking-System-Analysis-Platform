import express from "express";

import { upload } from "../middleware/upload.js";
import {
  analyzeResume,
  generateOptimizedResume,
} from "../controllers/analyzeController.js";

const router = express.Router();

import verifySource from "../middleware/verifySource.js";

// Main route for resume analysis
router.post('/',verifySource, upload.single('resume'),analyzeResume);

// Route for generating optimized resume
router.post('/generate-optimized-resume', verifySource, upload.single('resume'),generateOptimizedResume)

export default router;