import { useState } from 'react';
import { useApp } from '../context/AppContext';

function fmt(n) {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

const FILTERS = [
  { id: 'all',       label: 'Todo' },
  { id: 'income',    label: '↑ Ingresos' },
  { id: 'expense',   label: '↓ Gastos' },
  { id: 'food',      label: '🍔 Comida' },
  { id: 'transport', label: '🚌 Transporte' },
  { id: 'shopping',  label: '🛍️ Compras' },
  { id: 'health',    label: '💊 Salud' },
  { id: 'entertain', label: '🎬 Ocio' },
  { id: 'bills',     label: '📄 Facturas' },
];

const EXPENSE_CATS = [
  { id: 'food',      label: 'Comida',     icon: '🍔' },
  { id: 'transport', label: 'Transporte', icon: '🚌' },
  { id: 'shopping',  label: 'Compras',    icon: '🛍️' },
  { id: 'health',    label: 'Salud',      icon: '💊' },
  { id: 'entertain', label: 'Ocio',       icon: '🎬' },
  { id: 'bills',     label: 'Facturas',   icon: '📄' },
  { id: 'other',     label: 'Otro',       icon: '📦' },
];

export default function Transactions() {
  const { monthTxs, categories, deleteTransaction, transactions, updateTransaction } = useApp();
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing]   = useState(null);
  const [editData, setEditData] = useState({});
  const [showRecurring, setShowRecurring] = useState(false);

  function getCatInfo(catId) {
    return categories.find(c => c.id === catId) || { icon: '📦', label: 'Otro', color: '#8892b0' };
  }

  // Recurrentes: transacciones marcadas como recurring
  const recurringTxs = transactions.filter(t => t.recurring);

  const filtered = [...monthTxs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(t => {
      const matchFilter = filter === 'all' ? true
        : filter === 'income' || filter === 'expense' ? t.type === filter
        : t.category === filter;
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });

  const grouped = filtered.reduce((acc, tx) => {
    const d = new Date(tx.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!acc[d]) acc[d] = [];
    acc[d].push(tx);
    return acc;
  }, {});

  function startEdit(tx) {
    setEditing(tx.id);
    setEditData({ name: tx.name, amount: String(tx.amount), category: tx.category, note: tx.note || '' });
    setSelected(null);
  }

  function saveEdit() {
    const val = parseFloat(editData.amount);
    if (!editData.name || isNaN(val) || val <= 0) return;
    updateTransaction(editing, { name: editData.name, amount: val, category: editData.category, note: editData.note });
    setEditing(null);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historial</h1>
          <p className="page-subtitle">{filtered.length} transacciones</p>
        </div>
        <button
          onClick={() => setShowRecurring(true)}
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          🔁 Fijas
        </button>
      </div>

      {/* Búsqueda */}
      <div style={{ padding: '0 16px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar transacciones..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12 }}>✕</button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button key={f.id} className={`filter-tab ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{search ? '🔍' : '💸'}</div>
          <p className="empty-state-text">
            {search ? `Sin resultados para "${search}"` : 'No hay transacciones con este filtro'}
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, txs]) => (
          <div key={date}>
            <div style={{ padding: '8px 16px 6px', fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'capitalize', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{date}</span>
              <span>€{fmt(txs.reduce((s, t) => t.type === 'expense' ? s - t.amount : s + t.amount, 0))}</span>
            </div>
            <div className="tx-list" style={{ marginBottom: 4 }}>
              {txs.map((tx, i) => {
                const cat = getCatInfo(tx.category);
                return (
                  <div key={tx.id}>
                    <div className="tx-item" style={{ animationDelay: `${i * 0.04}s` }}
                      onClick={() => setSelected(selected?.id === tx.id ? null : tx)}>
                      <div className="tx-icon" style={{ background: `${cat.color}20`, color: cat.color }}>
                        {cat.icon}
                      </div>
                      <div className="tx-info">
                        <div className="tx-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {tx.name}
                          {tx.recurring && <span style={{ fontSize: 9, background: 'rgba(74,158,255,0.15)', color: 'var(--blue)', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>FIJA</span>}
                        </div>
                        <div className="tx-meta">{cat.label}{tx.note ? ` · ${tx.note}` : ''}</div>
                      </div>
                      <div className={`tx-amount ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'}€{fmt(tx.amount)}
                      </div>
                    </div>

                    {/* Panel de acciones */}
                    {selected?.id === tx.id && (
                      <div style={{ margin: '0 0 4px', background: 'var(--bg-3)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-3)', flex: 1 }}>{fmtDate(tx.date)}</span>
                        <button onClick={() => startEdit(tx)}
                          style={{ background: 'rgba(74,158,255,0.1)', border: '1px solid rgba(74,158,255,0.2)', color: 'var(--blue)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          ✏️ Editar
                        </button>
                        <button onClick={() => { deleteTransaction(tx.id); setSelected(null); }}
                          style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', color: 'var(--red)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          🗑 Borrar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* ===== MODAL EDITAR ===== */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Editar transacción</div>

            <div className="form-group">
              <label className="form-label">Importe</label>
              <div className="amount-input-wrap">
                <span className="amount-currency">€</span>
                <input type="number" className="form-input" value={editData.amount}
                  onChange={e => setEditData(d => ({ ...d, amount: e.target.value }))}
                  autoFocus min="0" step="0.01" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <input type="text" className="form-input" value={editData.name}
                onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} maxLength={40} />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría</label>
              <div className="categories-grid">
                {EXPENSE_CATS.map(cat => (
                  <button key={cat.id} className={`cat-btn ${editData.category === cat.id ? 'selected' : ''}`}
                    onClick={() => setEditData(d => ({ ...d, category: cat.id }))}>
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nota</label>
              <input type="text" className="form-input" value={editData.note}
                onChange={e => setEditData(d => ({ ...d, note: e.target.value }))} maxLength={80} />
            </div>

            <button className="btn-primary" onClick={saveEdit}
              disabled={!editData.name || !editData.amount || parseFloat(editData.amount) <= 0}>
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL RECURRENTES ===== */}
      {showRecurring && (
        <div className="modal-overlay" onClick={() => setShowRecurring(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Transacciones fijas</div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20, lineHeight: 1.6 }}>
              Gastos e ingresos recurrentes cada mes. Márcalos al añadir una transacción.
            </p>

            {recurringTxs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔁</div>
                <p style={{ fontSize: 13 }}>No tienes transacciones fijas.<br />Márcalas con 🔁 al crearlas.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {recurringTxs.map(tx => {
                  const cat = getCatInfo(tx.category);
                  return (
                    <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                      <div style={{ fontSize: 20 }}>{cat.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{tx.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Mensual · {cat.label}</div>
                      </div>
                      <div style={{ fontFamily: 'DM Serif Display', fontSize: '1rem', color: tx.type === 'income' ? 'var(--green)' : 'var(--text)' }}>
                        {tx.type === 'income' ? '+' : '-'}€{fmt(tx.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.15)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 12, color: 'var(--blue)', lineHeight: 1.6 }}>
              💡 Las transacciones fijas se muestran aquí como referencia. Añádelas manualmente cada mes o márcalas al crearlas.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}