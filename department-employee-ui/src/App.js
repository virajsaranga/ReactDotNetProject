import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';

function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/departments" style={{ marginRight: 10 }}>Departments</Link>
        <Link to="/employees">Employees</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/departments" />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
      </Routes>
    </div>
  );
}

export default App;
