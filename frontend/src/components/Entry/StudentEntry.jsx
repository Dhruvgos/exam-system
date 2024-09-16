import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentEntry.css';

const StudentEntry = () => {
  const [student, setStudent] = useState({ firstName: '', lastName: '', studentId: '', semester: '', department: '' });
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/login', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token,
            },
          });

          if (!response.ok) {
            throw new Error('Token validation failed');
          }

          const user = await response.json();
          if (user.role !== 'admin') {
            navigate('/');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    const fetchSemesters = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/semesters');
        if (!response.ok) {
          throw new Error('Failed to fetch semesters');
        }
        const data = await response.json();
        setSemesters(data);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };

    checkToken();
    fetchSemesters();
  }, [navigate]);

  const fetchSubjectsForSemester = async (semesterId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/subjects/semester?semester=${semesterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'semester') {
      fetchSubjectsForSemester(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedSubjects = subjects.map((subject) => subject._id);
    try {
      const response = await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...student, subjects: selectedSubjects }),
      });
      if (!response.ok) {
        throw new Error('Failed to create student');
      }
      setStudent({ firstName: '', lastName: '', studentId: '', semester: '', department: '' });
      setSubjects([]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="student-entry-form">
      <h2>Student Entry</h2>
      <div className="form-group">
        <label>First Name</label>
        <input type="text" name="firstName" value={student.firstName} onChange={handleChange} placeholder="First Name" required />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input type="text" name="lastName" value={student.lastName} onChange={handleChange} placeholder="Last Name" required />
      </div>
      <div className="form-group">
        <label>Student ID</label>
        <input type="text" name="studentId" value={student.studentId} onChange={handleChange} placeholder="Student ID" required />
      </div>
      <div className="form-group">
        <label>Department</label>
        <select name="department" value={student.department} onChange={handleChange} required>
          <option value="">Select Department</option>
          <option value="ENGINEERING">ENGINEERING</option>
          <option value="COMPUTER APPLICATIONS">COMPUTER APPLICATIONS</option>
          <option value="SCIENCE">SCIENCE</option>
        </select>
      </div>
      <div className="form-group">
        <label>Semester</label>
        <select name="semester" value={student.semester} onChange={handleChange} required>
          <option value="">Select Semester</option>
          {semesters.map((semester) => (
            <option key={semester._id} value={semester.order}>
              {semester.order} Semester
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add Student</button>
    </form>
  );
};

export default StudentEntry;
