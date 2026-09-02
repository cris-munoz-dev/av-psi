import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-white font-medium text-lg">Panel de Control</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-slate-800 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/admin/pacientes" className="block px-4 py-2 rounded hover:bg-slate-800 hover:text-white transition-colors">Fichas Clínicas</Link>
          <Link to="/admin/citas" className="block px-4 py-2 rounded hover:bg-slate-800 hover:text-white transition-colors">Citas</Link>
          <Link to="/admin/configuracion" className="block px-4 py-2 rounded hover:bg-slate-800 hover:text-white transition-colors">Disponibilidad</Link>
        </nav>
        <div className="p-4 border-t border-slate-800 text-sm">
          <p className="truncate mb-2">{user?.email}</p>
          <button onClick={handleSignOut} className="w-full text-left text-red-400 hover:text-red-300">Cerrar Sesión</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white h-16 shadow-sm flex items-center px-6 md:hidden">
           <span className="font-medium text-slate-900">Admin Panel</span>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
