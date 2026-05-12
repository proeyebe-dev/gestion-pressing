import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ClientForm from './pages/Clients/ClientForm';
import VetementForm from './pages/Vetements/VetementForm';
export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center gap-6 shadow-lg">
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-yellow-400 text-2xl">👔</span>
          <span className="text-white font-bold text-lg">Gestion Pressing</span>
        </div>
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            isActive
              ? 'bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-sm'
              : 'text-blue-300 hover:text-white font-medium px-4 py-2 rounded-xl text-sm transition'
          }
        >
          👤 Clients
        </NavLink>
        <NavLink
          to="/vetements"
          className={({ isActive }) =>
            isActive
              ? 'bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-sm'
              : 'text-blue-300 hover:text-white font-medium px-4 py-2 rounded-xl text-sm transition'
          }
        >
          👕 Vêtements
        </NavLink>
      </nav>
      {/* Pages */}
      <Routes>
        <Route path="/clients" element={<ClientForm />} />
        <Route path="/vetements" element={<VetementForm />} />
        <Route path="*" element={<ClientForm />} />
      </Routes>
    </BrowserRouter>
  );
}