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

![Dashboard Dark](https://github.com/user-attachments/assets/85f052f3-0c2e-46d6-985f-d2461791881d)

### ☀️ Dashboard — Light Theme

![Dashboard Light](https://github.com/user-attachments/assets/28a64010-bbb7-4107-a40c-6736a36d11d6)

### 📋 Transaction History

![History](https://github.com/user-attachments/assets/c09646a6-0d4b-4257-964b-10d0629531b9)

### 📊 Graphics — Expenses

![Graphics Expenses 1](https://github.com/user-attachments/assets/61e8f6b4-9312-4114-b401-b9891adbe221)

![Graphics Expenses 2](https://github.com/user-attachments/assets/6360d8c1-96f0-4f1a-bd6b-00678009662e)

### 📈 Graphics — Income

![Graphics Income](https://github.com/user-attachments/assets/3f865813-63d0-4115-97c1-30f03033a2a1)

### 📉 Graphics — Trend

![Graphics Trend](https://github.com/user-attachments/assets/7d987d3e-b4c5-4e9a-ac42-3e8ae2f63e4f)

### ➕ New Transaction

![New Transaction](https://github.com/user-attachments/assets/1f9eb67a-8d89-4363-af87-2f41e015c3e9)

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