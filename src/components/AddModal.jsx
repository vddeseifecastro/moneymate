import { useState } from 'react';
import { useApp } from '../context/AppContext';

const EXPENSE_CATS = [
  { id: 'food',      label: 'Comida',     icon: '🍔' },
  { id: 'transport', label: 'Transporte', icon: '🚌' },
  { id: 'shopping',  label: 'Compras',    icon: '🛍️' },
  { id: 'health',    label: 'Salud',      icon: '💊' },
  { id: 'entertain', label: 'Ocio',       icon: '🎬' },
  { id: 'bills',     label: 'Facturas',   icon: '📄' },
  { id: 'other',     label: 'Otro',       icon: '📦' },
];

export default function AddModal({ onClose, onSaved }) {
  const { addTransaction } = useApp();
  const [type, setType]         = useState('expense');
  const [amount, setAmount]     = useState('');
  const [name, setName]         = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote]         = useState('');
  const [recurring, setRecurring] = useState(false);

  function handleSubmit() {
    if (!amount || !name || parseFloat(amount) <= 0) return;
    addTransaction({
      name,
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'income' : category,
      note,
      recurring,
    });
    onSaved?.();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">Nueva transacción</div>

        {/* Tipo */}
        <div className="type-toggle">
          <button className={`type-btn ${type === 'expense' ? 'active-expense' : ''}`}
            onClick={() => { setType('expense'); setCategory('food'); }}>
            ↓ Gasto
          </button>
          <button className={`type-btn ${type === 'income' ? 'active-income' : ''}`}
            onClick={() => { setType('income'); setCategory('income'); }}>
            ↑ Ingreso
          </button>
        </div>

        {/* Importe */}
        <div className="form-group">
          <label className="form-label">Importe</label>
          <div className="amount-input-wrap">
            <span className="amount-currency">€</span>
            <input type="number" className="form-input" placeholder="0.00"
              value={amount} onChange={e => setAmount(e.target.value)}
              autoFocus min="0" step="0.01" />
          </div>
        </div>

        {/* Nombre */}
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <input type="text" className="form-input"
            placeholder={type === 'income' ? 'Ej: Salario, Freelance...' : 'Ej: Mercadona, Metro...'}
            value={name} onChange={e => setName(e.target.value)} maxLength={40} />
        </div>

        {/* Categoría */}
        {type === 'expense' && (
          <div className="form-group">
            <label className="form-label">Categoría</label>
            <div className="categories-grid">
              {EXPENSE_CATS.map(cat => (
                <button key={cat.id} className={`cat-btn ${category === cat.id ? 'selected' : ''}`}
                  onClick={() => setCategory(cat.id)}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nota */}
        <div className="form-group">
          <label className="form-label">Nota (opcional)</label>
          <input type="text" className="form-input" placeholder="Añade una nota..."
            value={note} onChange={e => setNote(e.target.value)} maxLength={80} />
        </div>

        {/* Recurrente toggle */}
        <button
          onClick={() => setRecurring(r => !r)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: recurring ? 'rgba(74,158,255,0.08)' : 'var(--bg-3)',
            border: `1px solid ${recurring ? 'rgba(74,158,255,0.3)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)', padding: '12px 16px', cursor: 'pointer',
            marginBottom: 16, transition: 'all 0.2s', fontFamily: 'inherit'
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔁</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: recurring ? 'var(--blue)' : 'var(--text)' }}>
                Transacción fija
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                Se repite cada mes
              </div>
            </div>
          </div>
          <div style={{
            width: 40, height: 22, borderRadius: 11,
            background: recurring ? 'var(--blue)' : 'var(--bg-4)',
            position: 'relative', transition: 'background 0.2s',
            border: '1px solid var(--border-2)'
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 2,
              left: recurring ? 20 : 2,
              transition: 'left 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
            }} />
          </div>
        </button>

        <button className="btn-primary" onClick={handleSubmit}
          disabled={!amount || !name || parseFloat(amount) <= 0}>
          {type === 'income' ? '↑ Añadir ingreso' : '↓ Registrar gasto'}
        </button>
      </div>
    </div>
  );
}