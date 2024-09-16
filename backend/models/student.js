import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  // stage: { type: mongoose.Schema.Types.ObjectId, ref: 'Stage' },
  semester: { type: String,  required: true }, // Reference to Semester
  department: { type: String,  required: true }, 
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], // Assigned subjects
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
