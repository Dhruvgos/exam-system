import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import './Home.css';
const Home = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userRole, setUserRole] = useState('');
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    
  };
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/login', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': `${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Token validation failed');
          }

          const user = await response.json();
          console.log('User details:', user);

          setIsLoggedIn(true);
          // setUserRole(user.role);
          // setUsername(user.name);
          // navigate('/');
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      }
    };

    checkToken();
  }, [isLoggedIn, navigate]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h2>Welcome to the Home Page</h2>
      {isLoggedIn ? (
        <div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
          <button onClick={() => navigate('/admin-dashboard')} className="dashboard-button">Go to Dashboard</button>
        </div>
      ) : (
        <button onClick={handleLoginClick} className="login-button">Login</button>
      )}
    </div>
  );
};

export default Home;
