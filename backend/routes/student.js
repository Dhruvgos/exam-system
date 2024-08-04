import express from 'express';
import Student from '../models/student.js'; // Note the .js extension

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('stage');
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router; // Use export default instead of module.exports
