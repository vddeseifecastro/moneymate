import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Charts from './pages/Charts';
import AddModal from './components/AddModal';
import './index.css';

const NAV = [
  { id: 'dashboard',    icon: '🏠', label: 'Inicio' },
  { id: 'transactions', icon: '📋', label: 'Gastos' },
  { id: 'charts',       icon: '📊', label: 'Gráficas' },
  { id: 'budget',       icon: '🎯', label: 'Límites' },
];

function App() {
  const [page, setPage]       = useState('dashboard');
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast]     = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function renderPage() {
    switch (page) {
      case 'dashboard':    return <Dashboard onNavigate={setPage} />;
      case 'transactions': return <Transactions />;
      case 'charts':       return <Charts />;
      case 'budget':       return <Budget />;
      default:             return <Dashboard onNavigate={setPage} />;
    }
  }

  return (
    <AppProvider>
      <div className="app">
        {renderPage()}

        {/* Bottom navigation */}
        <nav className="bottom-nav">
          {NAV.slice(0, 2).map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
              <div className="nav-icon">{n.icon}</div>
              <span>{n.label}</span>
            </button>
          ))}

          {/* Add button */}
          <button className="nav-btn-add" onClick={() => setShowAdd(true)} aria-label="Añadir transacción">
            +
          </button>

          {NAV.slice(2).map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
              <div className="nav-icon">{n.icon}</div>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Add modal */}
        {showAdd && (
          <AddModal
            onClose={() => setShowAdd(false)}
            onSaved={() => showToast('✅ Transacción guardada')}
          />
        )}

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </AppProvider>
  );
}

export default App;