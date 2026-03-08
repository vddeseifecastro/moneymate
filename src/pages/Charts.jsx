import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';

function fmt(n) {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function exportCSV(transactions) {
  const headers = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Importe (€)'];
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString('es-ES'),
    t.name,
    t.category,
    t.type === 'income' ? 'Ingreso' : 'Gasto',
    (t.type === 'expense' ? '-' : '') + t.amount.toFixed(2)
  ]);

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `moneymate-${new Date().toISOString().slice(0,7)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export default function Charts() {
  const { expensesByCategory, totalExpense, totalIncome, monthTxs, categories, transactions, currentMonth } = useApp();
  const [tab, setTab] = useState('gastos');

  // ===== GASTOS POR CATEGORÍA =====
  const expenseData = Object.entries(expensesByCategory)
    .filter(([, v]) => v > 0)
    .map(([catId, amount]) => {
      const cat = categories.find(c => c.id === catId);
      return { name: cat?.label || catId, amount, icon: cat?.icon || '📦', color: cat?.color || '#8892b0' };
    })
    .sort((a, b) => b.amount - a.amount);

  // ===== INGRESOS POR CATEGORÍA =====
  const incomeByCategory = monthTxs
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      const label = t.name; // agrupamos por nombre de ingreso
      acc[label] = (acc[label] || 0) + t.amount;
      return acc;
    }, {});

  const incomeData = Object.entries(incomeByCategory)
    .map(([name, amount], i) => ({ name, amount, color: ['#00d68f','#4a9eff','#f7c94b','#9b6dff'][i % 4] }))
    .sort((a, b) => b.amount - a.amount);

  // ===== COMPARATIVA ÚLTIMOS 6 MESES =====
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const txs  = transactions.filter(t => t.date.startsWith(key));
    return {
      name: MONTHS_SHORT[d.getMonth()],
      gastos:   txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      ingresos: txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    };
  });

  // Comparativa con mes anterior
  const prevMonth = (() => {
    const d = new Date(currentMonth + '-01');
    d.setMonth(d.getMonth() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  })();

  const prevTxs     = transactions.filter(t => t.date.startsWith(prevMonth));
  const prevExpense = prevTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const prevIncome  = prevTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenseDiff = prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense * 100) : null;
  const incomeDiff  = prevIncome  > 0 ? ((totalIncome  - prevIncome)  / prevIncome  * 100) : null;

  // Stats
  const savingRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0;
  const expenseCount = monthTxs.filter(t => t.type === 'expense').length;
  const avgExpense   = expenseCount > 0 ? totalExpense / expenseCount : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gráficas</h1>
          <p className="page-subtitle">Análisis completo de tus finanzas</p>
        </div>
        {/* Export CSV */}
        <button
          onClick={() => exportCSV(monthTxs)}
          style={{
            background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.2)',
            color: 'var(--green)', borderRadius: 'var(--radius-sm)', padding: '8px 14px',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
          ↓ CSV
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px', marginBottom: 16 }}>
        {[
          { label: 'Tasa de ahorro', value: `${Math.max(0, savingRate).toFixed(0)}%`, color: savingRate >= 20 ? 'var(--green)' : savingRate >= 0 ? 'var(--gold)' : 'var(--red)' },
          { label: 'Gasto medio', value: `€${fmt(avgExpense)}`, color: 'var(--text)' },
          { label: 'Transacciones', value: monthTxs.length, color: 'var(--text)' },
          { label: 'Categorías', value: expenseData.length, color: 'var(--text)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: '1.4rem', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Comparativa mes anterior */}
      {(expenseDiff !== null || incomeDiff !== null) && (
        <div style={{ margin: '0 16px 16px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 12 }}>
            vs mes anterior
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {incomeDiff !== null && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>Ingresos</div>
                <div style={{ fontFamily: 'DM Serif Display', fontSize: '1.1rem', color: incomeDiff >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {incomeDiff >= 0 ? '↑' : '↓'} {Math.abs(incomeDiff).toFixed(0)}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>antes €{fmt(prevIncome)}</div>
              </div>
            )}
            {expenseDiff !== null && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>Gastos</div>
                <div style={{ fontFamily: 'DM Serif Display', fontSize: '1.1rem', color: expenseDiff <= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {expenseDiff >= 0 ? '↑' : '↓'} {Math.abs(expenseDiff).toFixed(0)}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>antes €{fmt(prevExpense)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="filter-tabs">
        {[
          { id: 'gastos',   label: '↓ Gastos' },
          { id: 'ingresos', label: '↑ Ingresos' },
          { id: 'tendencia',label: '📈 Tendencia' },
        ].map(t => (
          <button key={t.id} className={`filter-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== TAB: GASTOS ===== */}
      {tab === 'gastos' && (
        expenseData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p className="empty-state-text">Sin gastos este mes.</p>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title" style={{ marginBottom: 16 }}>Distribución de gastos</div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="amount">
                      {expenseData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                    </Pie>
                    <Tooltip formatter={v => [`€${fmt(v)}`, '']}
                      contentStyle={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Total gastos</div>
                <div style={{ fontFamily: 'DM Serif Display', fontSize: '1.6rem', color: 'var(--red)' }}>€{fmt(totalExpense)}</div>
              </div>
            </div>
            <div className="chart-legend">
              {expenseData.map((item, i) => (
                <div key={i} className="legend-item">
                  <div className="legend-dot" style={{ background: item.color }} />
                  <span style={{ fontSize: 18, marginRight: 4 }}>{item.icon}</span>
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-amount">€{fmt(item.amount)}</span>
                  <span className="legend-pct">{totalExpense > 0 ? Math.round((item.amount / totalExpense) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </>
        )
      )}

      {/* ===== TAB: INGRESOS ===== */}
      {tab === 'ingresos' && (
        incomeData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💰</div>
            <p className="empty-state-text">Sin ingresos registrados<br />este mes.</p>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title" style={{ marginBottom: 16 }}>Distribución de ingresos</div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={incomeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="amount">
                      {incomeData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                    </Pie>
                    <Tooltip formatter={v => [`€${fmt(v)}`, '']}
                      contentStyle={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Total ingresos</div>
                <div style={{ fontFamily: 'DM Serif Display', fontSize: '1.6rem', color: 'var(--green)' }}>€{fmt(totalIncome)}</div>
              </div>
            </div>
            <div className="chart-legend">
              {incomeData.map((item, i) => (
                <div key={i} className="legend-item">
                  <div className="legend-dot" style={{ background: item.color }} />
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-amount">€{fmt(item.amount)}</span>
                  <span className="legend-pct">{totalIncome > 0 ? Math.round((item.amount / totalIncome) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </>
        )
      )}

      {/* ===== TAB: TENDENCIA ===== */}
      {tab === 'tendencia' && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 20 }}>Últimos 6 meses</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={last6} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} width={48} />
              <Tooltip
                formatter={(v, name) => [`€${fmt(v)}`, name === 'ingresos' ? 'Ingresos' : 'Gastos']}
                contentStyle={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }} />
              <Bar dataKey="ingresos" fill="#00d68f" radius={[4,4,0,0]} maxBarSize={24} />
              <Bar dataKey="gastos"   fill="#ff4757" radius={[4,4,0,0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-2)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--green)' }} /> Ingresos
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-2)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--red)' }} /> Gastos
            </div>
          </div>
        </div>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}