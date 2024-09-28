import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Guard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center p-2">
        <div className="loading-wrapper mt-auto mb-auto flex flex-col items-center">
          <span className="loading loading-infinity loading-md w-10 h-10"></span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null; // Render children only if authenticated
};

export default Guard;