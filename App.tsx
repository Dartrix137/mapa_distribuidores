
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PublicView from './components/public/PublicView';
import AdminView from './components/admin/AdminView';
import Login from './components/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Vista pública */}
          <Route path="/" element={<PublicView />} />

          {/* Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Rutas protegidas — solo admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminView />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
