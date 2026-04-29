import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { 
  ListTodo, 
  CalendarDays, 
  MessageSquareText, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  BrainCircuit,
  TrendingUp,
  Zap,
  Target,
  Flame,
  Sun,
  Moon,
  Loader2,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ tasks: 0, pending: 0, completed: 0 });
  const [nextTask, setNextTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingNext, setFetchingNext] = useState(false);
  const [updatingEnergy, setUpdatingEnergy] = useState(false);

  const fetchData = async () => {
    try {
      const [profileRes, tasksRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/tasks')
      ]);

      if (profileRes.data.success) {
        setProfile(profileRes.data.data);
      }

      if (tasksRes.data.success) {
        const tasks = tasksRes.data.data;
        setStats({
          tasks: tasks.length,
          pending: tasks.filter((t: any) => t.status === 'PENDING').length,
          completed: tasks.filter((t: any) => t.status === 'COMPLETED').length
        });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGetNextTask = async () => {
    setFetchingNext(true);
    try {
      const response = await api.get('/ai/next-task');
      if (response.data.success) {
        setNextTask(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch next task');
    } finally {
      setFetchingNext(false);
    }
  };

  const toggleEnergy = async () => {
    if (!profile) return;
    setUpdatingEnergy(true);
    const newType = profile.energyType === 'morning' ? 'night' : 'morning';
    try {
      const response = await api.patch('/users/profile', { energyType: newType });
      if (response.data.success) {
        setProfile({ ...profile, energyType: newType });
      }
    } catch (err) {
      console.error('Failed to update energy type');
    } finally {
      setUpdatingEnergy(false);
    }
  };

  const focusScore = stats.tasks > 0 ? Math.round((stats.completed / stats.tasks) * 100) : 0;

  const quickActions = [
    {
      title: 'Task Manager',
      desc: 'Organize your study items and deadlines.',
      icon: <ListTodo className="text-blue-400" size={32} />,
      link: '/tasks',
      bg: 'bg-blue-500/5',
      border: 'hover:border-blue-500/50'
    },
    {
      title: 'Study Planner',
      desc: 'AI-generated schedules and optimization.',
      icon: <CalendarDays className="text-purple-400" size={32} />,
      link: '/schedule',
      bg: 'bg-purple-500/5',
      border: 'hover:border-purple-500/50'
    },
    {
      title: 'AI Study Chat',
      desc: 'Get instant help with complex topics.',
      icon: <MessageSquareText className="text-emerald-400" size={32} />,
      link: '/chat',
      bg: 'bg-emerald-500/5',
      border: 'hover:border-emerald-500/50'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-500 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] bg-red-500/5 dark:bg-blue-500/5 px-4 py-2 rounded-full w-fit border border-red-500/10 dark:border-blue-500/10">
            <TrendingUp size={14} />
            Study Momentum Active
          </div>
          <h1 className="text-6xl font-black text-slate-950 dark:text-white tracking-tighter">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 dark:from-blue-500 dark:to-purple-600">{user?.email.split('@')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl font-medium">
            Your operating system for peak academic performance.
          </p>
        </div>

        <button 
          onClick={toggleEnergy}
          disabled={updatingEnergy}
          className="flex items-center gap-4 glass p-2.5 pl-6 pr-2.5 rounded-[2rem] hover:border-red-500/30 dark:hover:border-blue-500/30 transition-all group shadow-xl"
        >
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {profile?.energyType === 'morning' ? 'Early Bird Mode' : 'Night Owl Mode'}
          </span>
          <div className={`p-3 rounded-2xl ${profile?.energyType === 'morning' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 dark:bg-indigo-500/10 text-red-600 dark:text-indigo-400'} group-hover:scale-110 transition-transform shadow-sm`}>
            {updatingEnergy ? <Loader2 size={18} className="animate-spin" /> : profile?.energyType === 'morning' ? <Sun size={20} /> : <Moon size={20} />}
          </div>
        </button>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden group glow-blue transition-all hover:-translate-y-1">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] dark:opacity-[0.07] group-hover:scale-125 transition-transform duration-700 text-orange-500">
             <Flame size={160} />
          </div>
          <div className="p-3.5 bg-orange-500/10 rounded-2xl w-fit">
            <Flame className="text-orange-500" size={24} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Study Streak</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter">{loading ? '...' : `${profile?.streakCount || 0} Days`}</p>
          </div>
        </div>
        
        <div className="glass p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden group glow-purple transition-all hover:-translate-y-1">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] dark:opacity-[0.07] group-hover:scale-125 transition-transform duration-700 text-emerald-500">
             <Target size={160} />
          </div>
          <div className="p-3.5 bg-emerald-500/10 rounded-2xl w-fit">
            <Target className="text-emerald-500" size={24} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Focus Score</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter">{loading ? '...' : `${focusScore}%`}</p>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 transition-all hover:-translate-y-1">
          <div className="p-3.5 bg-purple-500/10 rounded-2xl w-fit">
            <Clock className="text-purple-500" size={24} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pending Tasks</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter">{loading ? '...' : stats.pending}</p>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 transition-all hover:-translate-y-1">
          <div className="p-3.5 bg-blue-500/10 rounded-2xl w-fit">
            <CheckCircle2 className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Mastered Items</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter">{loading ? '...' : stats.completed}</p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column - Hero */}
        <section className="lg:col-span-8 group h-[500px]">
          <div className="h-full rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-red-500/10 dark:shadow-blue-500/20 border border-white/10">
            {/* Background Image */}
            <img 
              src="/hero.png" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Futuristic Study Environment"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-12 lg:p-16 space-y-8 max-w-2xl">
              <div className="bg-red-500/20 dark:bg-blue-500/20 backdrop-blur-md border border-red-500/30 dark:border-blue-500/30 px-5 py-2.5 rounded-full w-fit flex items-center gap-2.5 text-red-100 dark:text-blue-200 font-bold text-xs">
                <Sparkles size={14} className="fill-red-100 dark:fill-blue-200" />
                SYSTEM OPTIMIZED
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                What's your next <br />breakthrough?
              </h2>
              
              {!nextTask ? (
                <div className="space-y-6">
                  <p className="text-blue-50 text-xl font-medium leading-relaxed max-w-md">
                    Our AI evaluates your velocity to find your most impactful next move.
                  </p>
                  <button
                    onClick={handleGetNextTask}
                    disabled={fetchingNext}
                    className="bg-white text-slate-950 font-black px-12 py-5 rounded-[2rem] hover:scale-105 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50"
                  >
                    {fetchingNext ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} className="fill-slate-950" />}
                    Compute Next Task
                  </button>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[3rem] space-y-6 animate-in zoom-in-95 duration-500 glow-blue">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-red-300 dark:text-blue-300 uppercase tracking-[0.2em]">System Recommendation</span>
                    <div className="bg-red-500/20 dark:bg-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black text-red-100 dark:text-blue-100 uppercase border border-red-500/30 dark:border-blue-500/30">
                      {nextTask.priority} Priority
                    </div>
                  </div>
                  <h3 className="text-4xl font-black text-white leading-tight tracking-tight">
                    {nextTask.title}
                  </h3>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2.5 text-slate-200 font-bold">
                       <Clock size={20} className="text-blue-400" />
                       {nextTask.estimatedHours}h Alloted
                    </div>
                    <Link
                      to="/tasks"
                      className="ml-auto bg-white text-slate-950 font-black px-8 py-3.5 rounded-2xl hover:scale-105 transition-all flex items-center gap-2 text-sm shadow-xl"
                    >
                      Initialize <ArrowRight size={18} />
                    </Link>
                  </div>
                  <button 
                    onClick={() => setNextTask(null)}
                    className="text-slate-400 text-xs font-bold hover:text-white transition-colors underline underline-offset-8 decoration-slate-600 hover:decoration-blue-500"
                  >
                    Rescan queue
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column - Actions */}
        <section className="lg:col-span-4 space-y-6">
          <h3 className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] px-6">Terminal Access</h3>
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className={`block glass p-8 rounded-[3rem] ${action.border} transition-all hover:-translate-y-2 group relative overflow-hidden`}
            >
              <div className="flex items-center gap-8 relative z-10">
                <div className={`p-4.5 rounded-2xl ${action.bg} group-hover:scale-110 transition-transform group-hover:rotate-3`}>
                  {action.icon}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{action.title}</h4>
                  <p className="text-slate-500 dark:text-slate-500 text-sm mt-1 font-medium">{action.desc}</p>
                </div>
              </div>
              <ArrowRight className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 dark:text-slate-800 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2" size={32} />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
