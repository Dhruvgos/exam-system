import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from 'cors'
import studentRoutes from "./routes/student.js";
import lecturerRoutes from './routes/lecturer.js';
import userRoutes from './routes/user.js'
import subjectRoutes from './routes/subject.js';
import semesterRoutes from './routes/semester.js';
import stageRoutes from './routes/stage.js';
import scoreRoutes from './routes/score.js';
dotenv.config();
const port = process.env.PORT || 3001;
const app = express();
app.use(cors()); 
app.use(bodyParser.json());
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));
  app.use('/api/students', studentRoutes);
  app.use('/api/lecturers', lecturerRoutes);
  app.use('/api/login', userRoutes);
  app.use('/api/subjects', subjectRoutes);
  app.use('/api/semesters', semesterRoutes);
  app.use('/api/stages', stageRoutes);
  app.use('/api/scores', scoreRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
