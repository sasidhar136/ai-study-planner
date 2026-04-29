import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskManager from './pages/TaskManager';
import Planner from './pages/Planner';
import Chat from './pages/Chat';
import { 
  LayoutDashboard, 
  ListTodo, 
  CalendarDays, 
  MessageSquareText, 
  LogOut, 
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const { logout } = useAuthStore();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={22} /> },
    { name: 'Tasks', path: '/tasks', icon: <ListTodo size={22} /> },
    { name: 'Planner', path: '/schedule', icon: <CalendarDays size={22} /> },
    { name: 'AI Chat', path: '/chat', icon: <MessageSquareText size={22} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-50 dark:bg-black border-r border-slate-200 dark:border-white/10 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20">
               <img src="/logo.png" alt="StudyOS Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-slate-950 dark:text-white font-black text-2xl tracking-tighter">Study<span className="text-red-500">OS</span></span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-black text-sm transition-all duration-200 group
                  ${isActive 
                    ? 'bg-red-500 text-white dark:bg-blue-600 dark:text-white shadow-xl' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 dark:hover:text-white'}
                `}
              >
                <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10">
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-rose-500/10 hover:text-red-600 dark:hover:text-rose-400 transition-all group"
            >
              <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex min-h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-500">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex items-center justify-between px-8 bg-white dark:bg-black border-b border-slate-100 dark:border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:hidden">
            <img src="/logo.png" className="h-8 w-8" alt="Logo" />
            <span className="text-slate-950 dark:text-white font-black tracking-tighter text-xl">Study<span className="text-red-500">OS</span></span>
          </div>

          <div className="hidden lg:block" /> {/* Spacer */}

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-blue-400 transition-all border border-transparent hover:border-red-500/20 dark:hover:border-blue-500/20 shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 rounded-2xl"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-10 lg:px-12 lg:py-16">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/tasks" element={<Layout><TaskManager /></Layout>} />
          <Route path="/schedule" element={<Layout><Planner /></Layout>} />
          <Route path="/chat" element={<Layout><Chat /></Layout>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
