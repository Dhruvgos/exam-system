import express from 'express';
import Lecturer from '../models/lecturer.js'; // Adjust path as needed
import User from '../models/user.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { firstName, lastName, lecturerId, role } = req.body;

  // Validate role
  const validRoles = ['Academic Coordinator', 'Instructor', 'Exam Coordinator'];
  if (!validRoles.includes(role)) {
    return res.status(400).send('Invalid role');
  }

  try {
    const user = new User({name:`${firstName+""+lastName}`,role:"Lecturer",password:lecturerId});
    await user.save();
    const lecturer = new Lecturer({ firstName, lastName, lecturerId, role });
    await lecturer.save();
    res.status(201).send(lecturer);
  } catch (error) {
    res.status(402).send(error);
  }
});

// Get all lecturers
router.get('/', async (req, res) => {
  try {
    const lecturers = await Lecturer.find();
    res.send(lecturers);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
