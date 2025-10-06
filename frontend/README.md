# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.








<!-- Routing -->


<!-- <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  
  {/* Admin Routes */}
  <Route element={<AdminLayout />}>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/users" element={<ManageUsers />} />
  </Route>

  {/* Customer Routes */}
  <Route element={<CustomerLayout />}>
    <Route path="/customer/dashboard" element={<CustomerDashboard />} />
  </Route>

  {/* Professional Routes */}
  <Route element={<ProfessionalLayout />}>
    <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
  </Route>
</Routes> -->




<!--   folder structure for dashboards

frontend/
├── node_modules/
├── public/
├── src/
│   ├── api/
│   │   ├── auth.jsx
│   │   ├── axios.jsx
│   │   └── ...
│   │
│   ├── assets/
│   │   └── ... (images, icons, etc.)
│   │
│   ├── components/
│   │   ├── RoleSelection.jsx
│   │   ├── Sidebar/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── CustomerSidebar.jsx
│   │   │   └── ProfessionalSidebar.jsx
│   │   ├── DashboardHeader.jsx
│   │   └── CommonComponents.jsx
│   │
│   ├── layouts/
│   │   ├── Navbar.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── CustomerLayout.jsx
│   │   └── ProfessionalLayout.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignUpCustomer.jsx
│   │   ├── SignUpProfessional.jsx
│   │   ├── AdminLogin.jsx
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManageUsers.jsx
│   │   │   │   ├── ManageProfessionals.jsx
│   │   │   │   └── Reports.jsx
│   │   │   │
│   │   │   ├── Customer/
│   │   │   │   ├── CustomerDashboard.jsx
│   │   │   │   ├── BookService.jsx
│   │   │   │   ├── MyBookings.jsx
│   │   │   │   └── Profile.jsx
│   │   │   │
│   │   │   └── Professional/
│   │   │       ├── ProfessionalDashboard.jsx
│   │   │       ├── ServiceRequests.jsx
│   │   │       ├── Schedule.jsx
│   │   │       └── Profile.jsx
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js --->