import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom'; // Import Outlet
import Navbar from './components/Navbar.jsx';
import BottomNav from './components/BottomNav.jsx';
import Create from './components/Create.jsx'; // Import the Create component

function App() {
  // State to track the current section
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('Chats');
  const [bottomNavDisabled, setBottomNavDisabled] = useState(false); // Manage BottomNav state

  // Effect to navigate based on current section
  useEffect(() => {
    switch (currentSection) {
      case 'Chats':
        navigate('/chats');
        break;
      case 'Peoples':
        navigate('/peoples');
        break;
      case 'Notifications':
        navigate('/notification');
        break;
      default:
        navigate('/chats'); // fallback to chats if current section is unknown
    }
  }, [currentSection, navigate]); // Dependency array includes currentSection and navigate

  return (
    <div>
      {/* Pass the current section to Navbar to update the title */}
      <Navbar title={currentSection} />

      {/* Conditionally render the Create button only in the "Chats" section */}
      {currentSection === 'Chats' && <Create setBottomNavDisabled={setBottomNavDisabled} />}

      {/* This is where child routes will be rendered */}
      <Outlet />

      {/* Pass the setCurrentSection function to BottomNav to handle button clicks */}
      <BottomNav setCurrentSection={setCurrentSection} bottomNavDisabled={bottomNavDisabled} />
    </div>
  );
}

export default App;