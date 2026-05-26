import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import AppActivity from './pages/AppActivity';
import DashboardData from './pages/DashboardData';
import './App.css';
import UserActivity from './pages/UserActivity';
import LogonDetail from './pages/LogonDetail';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = (page) => setCurrentPage(page);

  return (
    <div className="app">
      {currentPage === 'home'      && <Dashboard navigate={navigate} />}
      {currentPage === 'app-activity' && <AppActivity navigate={navigate} />}
      {currentPage === 'dashboard' && <DashboardData navigate={navigate} />}
      {currentPage === 'user-activity' && <UserActivity navigate={navigate} />}
      {currentPage === 'logon-detail' && <LogonDetail navigate={navigate} />}
    </div>
  );
}

export default App;