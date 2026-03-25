import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { ModalAppointment } from './components/ModalAppointment';
import './App.css';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="dashboard">
      <Routes>
        <Route path="/" element={<Dashboard key={isModalOpen ? 'open' : 'closed'} />} />
        <Route path="/clientes" element={<Patients />} />
      </Routes>

      <nav className="floating-menu">
        <button className="btn-menu btn-primary" onClick={() => setIsModalOpen(true)}> + Novo Agendamento</button>
        <button className="btn-menu" 
          onClick={() => navigate(location.pathname === '/clientes' ? '/' : '/clientes')}>
          {location.pathname === '/clientes' ? 'Voltar para Dash' : 'Clientes'}
        </button>
      </nav>

      <ModalAppointment 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
           // Essa parte é um truque simples: quando o modal salva,
           // ele fecha e a Dashboard vai dar o refresh automático se 
           // você usar um refresh state ou o truque da 'key' acima.
        }}
      />
      
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}