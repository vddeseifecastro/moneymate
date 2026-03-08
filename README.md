<div align="center">

# 💰 MoneyMate
### Personal Finance PWA

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=recharts&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A modern personal finance PWA built with React. Track income and expenses, manage budgets per category, visualize spending trends with interactive charts, and export your data to CSV — all stored locally, no backend required.

[Report Bug](https://github.com/vddeseifecastro/moneymate/issues) · [Request Feature](https://github.com/vddeseifecastro/moneymate/issues)

</div>

---

## 📸 Screenshots

### 🏠 Dashboard — Dark Theme

![Dashboard Dark](URL_IMAGEN_1)

### ☀️ Dashboard — Light Theme

![Dashboard Light](URL_IMAGEN_2)

### 📋 Transaction History

![History](URL_IMAGEN_3)

### 📊 Graphics — Expenses

![Graphics Expenses 1](URL_IMAGEN_4)

![Graphics Expenses 2](URL_IMAGEN_5)

### 📈 Graphics — Income

![Graphics Income](URL_IMAGEN_6)

### 📉 Graphics — Trend

![Graphics Trend](URL_IMAGEN_7)

### ➕ New Transaction

![New Transaction](URL_IMAGEN_8)

---

## ✨ Features

### 🏠 Dashboard
- Balance total del mes con hero card
- Resumen de ingresos y gastos del mes actual
- Selector de mes para navegar el historial
- Transacciones recientes
- Comparación mes a mes (% de cambio vs mes anterior)
- Acciones rápidas

### 📋 Transacciones
- Historial completo agrupado por fecha
- Balance diario por grupo
- Búsqueda en tiempo real
- Filtros por categoría, tipo y estado
- Editar y eliminar transacciones
- Transacciones recurrentes/fijas con badge 🔁

### 📊 Gráficas
- **Gastos:** gráfica circular por categoría
- **Ingresos:** gráfica circular por categoría
- **Tendencia:** gráfica de barras de los últimos 6 meses

### 💼 Presupuesto
- Límite mensual por categoría
- Barras de progreso con alertas de color
- Alerta al 80% del presupuesto
- Alerta al 100% del presupuesto

### 🎨 General
- Tema oscuro / tema claro persistido
- Exportar transacciones del mes a CSV (compatible con Excel)
- Instalable como PWA en móvil y escritorio
- Funciona offline — datos guardados en localStorage
- Diseño completamente responsive

---

## 🖥️ Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 (Create React App) |
| Gráficas | Recharts |
| Estado global | React Context API |
| Almacenamiento | localStorage |
| Estilos | CSS3 personalizado |
| Fuentes | DM Serif Display + DM Sans (Google Fonts) |
| PWA | Web App Manifest |

---

## 🚀 Getting Started

### Prerrequisitos
- Node.js 18+
- npm

### Instalación

```bash
cd moneymate
npm install
npm start
```

App corriendo en `http://localhost:3000`

### Build para producción

```bash
npm run build
```

Genera la carpeta `build/` lista para deploy. Puedes arrastrarla directamente a [Netlify Drop](https://app.netlify.com/drop) para obtener un link público al instante.

---

## 📁 Project Structure

```
moneymate/
│
├── public/
│   └── manifest.json        ← Configuración PWA
│
├── src/
│   ├── App.jsx              ← Rutas y layout principal
│   ├── index.css            ← Estilos globales + variables de tema
│   ├── context/
│   │   └── AppContext.jsx   ← Estado global (transacciones, presupuesto, tema)
│   ├── pages/
│   │   ├── Dashboard.jsx    ← Página principal con balance y resumen
│   │   ├── Transactions.jsx ← Historial con filtros y búsqueda
│   │   ├── Budget.jsx       ← Presupuesto por categoría
│   │   └── Charts.jsx       ← Gráficas de gastos, ingresos y tendencia
│   └── components/
│       └── AddModal.jsx     ← Modal para crear y editar transacciones
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🗂️ Categories

| Categoría | Emoji | Color |
|-----------|-------|-------|
| Alimentación | 🍔 | #ff6b35 |
| Transporte | 🚌 | #4a9eff |
| Compras | 🛍️ | #9b6dff |
| Salud | 💊 | #00d68f |
| Entretenimiento | 🎬 | #f7c94b |
| Facturas | 📄 | #ff4757 |
| Ingresos | 💰 | #00d68f |
| Otros | 📦 | #8892b0 |

---

## 🌱 Upcoming Features

- [ ] Deploy en GitHub Pages
- [ ] Sincronización en la nube
- [ ] Notificaciones cuando superas el presupuesto
- [ ] Múltiples monedas
- [ ] Importar desde CSV

---

## 👨‍💻 Author

**Victor Dominic Deseife Castro**

[![GitHub](https://img.shields.io/badge/GitHub-vddeseifecastro-181717?style=for-the-badge&logo=github)](https://github.com/vddeseifecastro)

---

<div align="center">
  <p>Built with ❤️ by Victor Dominic Deseife Castro</p>
  <p>⭐ Star this repo if you found it useful!</p>
</div>