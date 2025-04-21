import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './assets/pages/Login';
import Signup from './assets/pages/Signup';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/team-dashboard" element={<TeamDashboard />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App
