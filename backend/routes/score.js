import express from 'express';
import Score from '../models/score.js'; // Adjust path as needed

const router = express.Router();

// Create a new score entry
router.post('/', async (req, res) => {
  try {
    const score = new Score(req.body);
    await score.save();
    res.status(201).send(score);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all scores
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find().populate('student').populate('subject'); // Adjust as needed
    res.send(scores);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
