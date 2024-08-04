import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

// module.exports = mongoose.model('Semester', semesterSchema);
const Semester = mongoose.model('Semester',semesterSchema)
export default Semester