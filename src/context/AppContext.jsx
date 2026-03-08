import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const CATEGORIES = [
  { id: 'food',      label: 'Comida',     icon: '🍔', color: '#ff6b35' },
  { id: 'transport', label: 'Transporte', icon: '🚌', color: '#4a9eff' },
  { id: 'shopping',  label: 'Compras',    icon: '🛍️', color: '#9b6dff' },
  { id: 'health',    label: 'Salud',      icon: '💊', color: '#00d68f' },
  { id: 'entertain', label: 'Ocio',       icon: '🎬', color: '#f7c94b' },
  { id: 'bills',     label: 'Facturas',   icon: '📄', color: '#ff4757' },
  { id: 'income',    label: 'Ingreso',    icon: '💰', color: '#00d68f' },
  { id: 'other',     label: 'Otro',       icon: '📦', color: '#8892b0' },
];

const BUDGETS_DEFAULT = {
  food:      { limit: 300, label: 'Comida',     icon: '🍔', color: '#ff6b35' },
  transport: { limit: 100, label: 'Transporte', icon: '🚌', color: '#4a9eff' },
  shopping:  { limit: 200, label: 'Compras',    icon: '🛍️', color: '#9b6dff' },
  health:    { limit: 100, label: 'Salud',      icon: '💊', color: '#00d68f' },
  entertain: { limit: 150, label: 'Ocio',       icon: '🎬', color: '#f7c94b' },
  bills:     { limit: 400, label: 'Facturas',   icon: '📄', color: '#ff4757' },
};

const DEMO_TRANSACTIONS = [
  { id: 1, name: 'Salario', amount: 2500, type: 'income', category: 'income', date: new Date().toISOString(), note: '', recurring: true },
  { id: 2, name: 'Supermercado', amount: 67.40, type: 'expense', category: 'food', date: new Date(Date.now() - 86400000).toISOString(), note: '', recurring: false },
  { id: 3, name: 'Metro mensual', amount: 54.60, type: 'expense', category: 'transport', date: new Date(Date.now() - 172800000).toISOString(), note: '', recurring: true },
  { id: 4, name: 'Netflix', amount: 15.99, type: 'expense', category: 'entertain', date: new Date(Date.now() - 259200000).toISOString(), note: '', recurring: true },
  { id: 5, name: 'Farmacia', amount: 23.50, type: 'expense', category: 'health', date: new Date(Date.now() - 345600000).toISOString(), note: '', recurring: false },
  { id: 6, name: 'Luz + Agua', amount: 89.00, type: 'expense', category: 'bills', date: new Date(Date.now() - 432000000).toISOString(), note: '', recurring: true },
];

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const txs = [action.payload, ...state.transactions];
      save('mm_transactions', txs);
      return { ...state, transactions: txs };
    }
    case 'UPDATE_TRANSACTION': {
      const txs = state.transactions.map(t =>
        t.id === action.id ? { ...t, ...action.data } : t
      );
      save('mm_transactions', txs);
      return { ...state, transactions: txs };
    }
    case 'DELETE_TRANSACTION': {
      const txs = state.transactions.filter(t => t.id !== action.payload);
      save('mm_transactions', txs);
      return { ...state, transactions: txs };
    }
    case 'UPDATE_BUDGET': {
      const budgets = {
        ...state.budgets,
        [action.category]: { ...state.budgets[action.category], limit: action.limit }
      };
      save('mm_budgets', budgets);
      return { ...state, budgets };
    }
    case 'SET_MONTH':
      return { ...state, currentMonth: action.payload };
    case 'SET_THEME': {
      localStorage.setItem('mm_theme', action.payload);
      return { ...state, theme: action.payload };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const savedTxs     = JSON.parse(localStorage.getItem('mm_transactions') || 'null');
  const savedBudgets = JSON.parse(localStorage.getItem('mm_budgets') || 'null');
  const savedTheme   = localStorage.getItem('mm_theme') || 'dark';

  const [state, dispatch] = useReducer(reducer, {
    transactions: savedTxs || DEMO_TRANSACTIONS,
    budgets:      savedBudgets || BUDGETS_DEFAULT,
    currentMonth: new Date().toISOString().slice(0, 7),
    theme:        savedTheme,
  });

  // Aplicar tema al documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const monthTxs = state.transactions.filter(t =>
    t.date.startsWith(state.currentMonth)
  );

  const totalIncome  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance      = totalIncome - totalExpense;

  const expensesByCategory = monthTxs
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  function addTransaction(data) {
    const tx = { ...data, id: Date.now(), date: new Date().toISOString() };
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    return tx;
  }

  function updateTransaction(id, data) {
    dispatch({ type: 'UPDATE_TRANSACTION', id, data });
  }

  function deleteTransaction(id) {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }

  function updateBudget(category, limit) {
    dispatch({ type: 'UPDATE_BUDGET', category, limit });
  }

  function setMonth(month) {
    dispatch({ type: 'SET_MONTH', payload: month });
  }

  function toggleTheme() {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' });
  }

  return (
    <AppContext.Provider value={{
      transactions: state.transactions,
      monthTxs,
      budgets: state.budgets,
      currentMonth: state.currentMonth,
      theme: state.theme,
      balance, totalIncome, totalExpense,
      expensesByCategory,
      categories: CATEGORIES,
      addTransaction, updateTransaction, deleteTransaction,
      updateBudget, setMonth, toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
export { CATEGORIES };