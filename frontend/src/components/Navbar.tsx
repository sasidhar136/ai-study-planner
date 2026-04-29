import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { LayoutDashboard, ListTodo, CalendarDays, LogOut, MessageSquareText, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { logout, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Tasks', path: '/tasks', icon: <ListTodo size={18} /> },
    { name: 'Planner', path: '/schedule', icon: <CalendarDays size={18} /> },
    { name: 'AI Chat', path: '/chat', icon: <MessageSquareText size={18} /> },
  ];

  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/50 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <img src="/logo.png" alt="StudyOS Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter">Study<span className="text-blue-500">OS</span></span>
            </NavLink>
            
            {isAuthenticated && (
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400'
                            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                        }`
                      }
                    >
                      {item.icon}
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
