import mongoose from "mongoose";
const scoreSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  caScore: { type: Number, required: true },
  examScore: { type: Number, required: true },
  totalScore: { type: Number, required: true },
});

// module.exports = mongoose.model('Score', scoreSchema);
const Score = mongoose.model('Score',scoreSchema)
export default Score