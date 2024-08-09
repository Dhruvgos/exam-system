import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentEntry.css'
const StudentEntry = () => {
  const [student, setStudent] = useState({ firstName: '', lastName: '', studentId: '', stage: '' });
  const [stages, setStages] = useState([]);
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
          console.log('User details:', user);
          if(user.role!='admin') {
            navigate('/')
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

    const fetchStages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stages');
        if (!response.ok) {
          throw new Error('Failed to fetch stages');
        }
        const data = await response.json();
        setStages(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    checkToken();
    fetchStages();
  }, [navigate]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      if (!response.ok) {
        throw new Error('Failed to create student');
      }
      setStudent({ firstName: '', lastName: '', studentId: '', stage: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Student Entry</h2>
      <input type="text" name="firstName" value={student.firstName} onChange={handleChange} placeholder="First Name" required />
      <input type="text" name="lastName" value={student.lastName} onChange={handleChange} placeholder="Last Name" required />
      <input type="text" name="studentId" value={student.studentId} onChange={handleChange} placeholder="Student ID" required />
      <select name="stage" value={student.stage} onChange={handleChange} required>
        <option value="">Select Stage</option>
        {stages.map(stage => (
          <option key={stage._id} value={stage._id}>
            {stage.name}
          </option>
        ))}
      </select>
      <button type="submit">Add Student</button>
    </form>
  );
};

export default StudentEntry;
