import { useState } from 'react';
import { useApp } from '../context/AppContext';

function fmt(n) {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function Budget() {
  const { budgets, expensesByCategory, updateBudget } = useApp();
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  const totalBudget  = Object.values(budgets).reduce((s, b) => s + b.limit, 0);
  const totalSpent   = Object.values(expensesByCategory).reduce((s, v) => s + v, 0);
  const totalPct     = Math.min((totalSpent / totalBudget) * 100, 100);

  function getBarColor(pct) {
    if (pct >= 90) return 'var(--red)';
    if (pct >= 70) return 'var(--gold)';
    return 'var(--green)';
  }

  function startEdit(catId) {
    setEditing(catId);
    setEditValue(String(budgets[catId].limit));
  }

  function saveEdit() {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val > 0) updateBudget(editing, val);
    setEditing(null);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Presupuesto</h1>
          <p className="page-subtitle">Control de límites mensuales</p>
        </div>
      </div>

      {/* Overview card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>
              Total gastado
            </div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: '1.8rem', color: 'var(--text)' }}>
              €{fmt(totalSpent)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
              de €{fmt(totalBudget)} presupuestado
            </div>
          </div>
          <div style={{
            fontFamily: 'DM Serif Display', fontSize: '2rem',
            color: totalPct >= 90 ? 'var(--red)' : totalPct >= 70 ? 'var(--gold)' : 'var(--green)'
          }}>
            {Math.round(totalPct)}%
          </div>
        </div>
        <div className="budget-bar-bg">
          <div className="budget-bar-fill" style={{
            width: `${totalPct}%`,
            background: getBarColor(totalPct)
          }} />
        </div>
        {totalPct >= 80 && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.15)', borderRadius: 8, fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>
            ⚠️ Has superado el 80% de tu presupuesto total
          </div>
        )}
      </div>

      {/* Por categoría */}
      <div className="section-header">
        <h2 className="section-title">Por categoría</h2>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Toca para editar</span>
      </div>

      {Object.entries(budgets).map(([catId, budget]) => {
        const spent = expensesByCategory[catId] || 0;
        const pct   = Math.min((spent / budget.limit) * 100, 100);
        const color = getBarColor(pct);

        return (
          <div key={catId} className="budget-item" onClick={() => startEdit(catId)} style={{ cursor: 'pointer' }}>
            <div className="budget-item-header">
              <div className="budget-item-left">
                <span className="budget-item-icon">{budget.icon}</span>
                <div>
                  <div className="budget-item-name">{budget.label}</div>
                  <div className="budget-item-spent">
                    €{fmt(spent)} / €{fmt(budget.limit)}
                  </div>
                </div>
              </div>
              <div className="budget-item-pct" style={{ color }}>
                {Math.round(pct)}%
              </div>
            </div>
            <div className="budget-bar-bg">
              <div className="budget-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            {pct >= 100 && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--red)', fontWeight: 600 }}>
                🚨 Límite superado en €{fmt(spent - budget.limit)}
              </div>
            )}
          </div>
        );
      })}

      {/* Edit modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">
              {budgets[editing].icon} Editar límite
            </div>
            <div className="form-group">
              <label className="form-label">Límite mensual (€)</label>
              <div className="amount-input-wrap">
                <span className="amount-currency">€</span>
                <input
                  type="number"
                  className="form-input"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                />
              </div>
            </div>
            <button className="btn-primary" onClick={saveEdit}>
              Guardar límite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}