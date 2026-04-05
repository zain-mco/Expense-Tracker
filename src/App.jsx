import { useState, useEffect } from 'react';
import Login from './Login';
import ExpenseTracker from './ExpenseTracker';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const localAuth = localStorage.getItem('auth_token');
    const sessionAuth = sessionStorage.getItem('auth_token');
    
    if (localAuth || sessionAuth) {
      setIsAuthenticated(true);
    }
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = (rememberMe) => {
    if (rememberMe) {
      localStorage.setItem('auth_token', 'true');
    } else {
      sessionStorage.setItem('auth_token', 'true');
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  if (isInitializing) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="animate-pulse text-blue-500 font-bold text-xl">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      {isAuthenticated ? (
        <ExpenseTracker onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
