import { useApp } from '../context/AppContext';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function fmt(n) {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

export default function Dashboard({ onNavigate }) {
  const { balance, totalIncome, totalExpense, monthTxs, currentMonth, setMonth, categories, theme, toggleTheme } = useApp();

  const [year, month] = currentMonth.split('-').map(Number);

  function prevMonth() {
    const d = new Date(year, month - 2, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  function nextMonth() {
    const d = new Date(year, month, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const recentTxs = [...monthTxs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  function getCatInfo(catId) {
    return categories.find(c => c.id === catId) || { icon: '📦', label: 'Otro', color: '#8892b0' };
  }

  const isCurrentMonth = currentMonth === new Date().toISOString().slice(0, 7);
  const balancePositive = balance >= 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">MoneyMate</h1>
          <p className="page-subtitle">Tus finanzas personales</p>
        </div>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 18, transition: 'all 0.2s'
          }}
          aria-label="Cambiar tema">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Month selector */}
      <div className="month-selector">
        <button className="month-btn" onClick={prevMonth}>‹</button>
        <span className="month-name">{MONTHS[month - 1]} {year}</span>
        <button className="month-btn" onClick={nextMonth}
          disabled={isCurrentMonth} style={{ opacity: isCurrentMonth ? 0.3 : 1 }}>›</button>
      </div>

      {/* Balance hero */}
      <div className="balance-hero">
        <div className="balance-label">Balance del mes</div>
        <div className="balance-amount">
          <span className="currency">€</span>
          {fmt(Math.abs(balance))}
        </div>
        <div className="balance-change" style={{ color: balancePositive ? 'var(--green)' : 'var(--red)' }}>
          {balancePositive ? '↑ Positivo' : '↓ Negativo'} este mes
        </div>
        <div className="balance-stats">
          <div className="balance-stat">
            <div className="balance-stat-label">
              <span style={{ color: 'var(--green)' }}>↑</span> Ingresos
            </div>
            <div className="balance-stat-amount income">€{fmt(totalIncome)}</div>
          </div>
          <div className="balance-stat">
            <div className="balance-stat-label">
              <span style={{ color: 'var(--red)' }}>↓</span> Gastos
            </div>
            <div className="balance-stat-amount expense">€{fmt(totalExpense)}</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        {[
          { icon: '📊', label: 'Gráficas',    page: 'charts' },
          { icon: '🎯', label: 'Presupuesto', page: 'budget' },
          { icon: '📋', label: 'Historial',   page: 'transactions' },
        ].map(a => (
          <button key={a.page} className="quick-action" onClick={() => onNavigate(a.page)}>
            <span className="quick-action-icon">{a.icon}</span>
            <span className="quick-action-label">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="section-header">
        <h2 className="section-title">Recientes</h2>
        <button className="section-link" onClick={() => onNavigate('transactions')}>Ver todo →</button>
      </div>

      {recentTxs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💸</div>
          <p className="empty-state-text">No hay transacciones este mes.<br />¡Añade tu primer gasto o ingreso!</p>
        </div>
      ) : (
        <div className="tx-list">
          {recentTxs.map((tx, i) => {
            const cat = getCatInfo(tx.category);
            return (
              <div key={tx.id} className="tx-item" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="tx-icon" style={{ background: `${cat.color}20`, color: cat.color }}>
                  {cat.icon}
                </div>
                <div className="tx-info">
                  <div className="tx-name">{tx.name}</div>
                  <div className="tx-meta">{cat.label} · {fmtDate(tx.date)}</div>
                </div>
                <div className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}€{fmt(tx.amount)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}