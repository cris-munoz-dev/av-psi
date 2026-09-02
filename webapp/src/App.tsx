import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';

import RootLayout from './layouts/RootLayout';
import Landing from './pages/Landing';
import Booking from './pages/Booking';
import Login from './pages/auth/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Patients from './pages/admin/Patients';
import Appointments from './pages/admin/Appointments';
import Settings from './pages/admin/Settings';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, role, isLoading } = useAuth();
  if (isLoading) return <div className="p-8 text-center">Cargando sesión...</div>;
  if (!session || role !== 'ADMIN') return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/agendar" element={<Booking />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Rutas Privadas de Administración */}
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="pacientes" element={<Patients />} />
        <Route path="citas" element={<Appointments />} />
        <Route path="configuracion" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
