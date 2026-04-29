import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Circle,
  Filter,
  PlusCircle,
  LayoutGrid,
  Search
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | null;
  estimatedHours: number;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'MEDIUM',
    estimatedHours: 1
  });

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/tasks', newTask);
      if (response.data.success) {
        setTasks([response.data.data, ...tasks]);
        setNewTask({ title: '', priority: 'MEDIUM', estimatedHours: 1 });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Failed to add task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 glass p-10 rounded-[3rem] relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">Mission Control</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Define your goals and break them down into actionable tasks.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-500 hover:bg-red-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-12 py-5 rounded-3xl font-black transition-all shadow-2xl flex items-center gap-4 active:scale-95 relative z-10"
        >
          {showAddForm ? <AlertCircle size={24} /> : <PlusCircle size={24} />}
          {showAddForm ? 'Cancel Operation' : 'Initialize Task'}
        </button>
      </header>

      {showAddForm && (
        <div className="glass p-12 rounded-[3.5rem] animate-in zoom-in-95 duration-300 glow-red dark:glow-blue">
          <form onSubmit={handleAddTask} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <label htmlFor="taskTitle" className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Objective Name</label>
              <input
                id="taskTitle"
                name="taskTitle"
                type="text"
                required
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-8 py-5 text-slate-950 dark:text-white text-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-800"
                placeholder="e.g. Master Linear Regression"
              />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <label htmlFor="priority" className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Priority Level</label>
              <select
                id="priority"
                name="priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-8 py-5 text-slate-950 dark:text-white text-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                <option value="HIGH">CRITICAL</option>
                <option value="MEDIUM">STANDARD</option>
                <option value="LOW">BACKLOG</option>
              </select>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <label htmlFor="estimatedHours" className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">EST. Hours</label>
              <input
                id="estimatedHours"
                name="estimatedHours"
                type="number"
                min="0.5"
                step="0.5"
                value={newTask.estimatedHours}
                onChange={(e) => setNewTask({...newTask, estimatedHours: parseFloat(e.target.value)})}
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl px-8 py-5 text-slate-950 dark:text-white text-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="lg:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white h-[68px] rounded-2xl transition-all flex items-center justify-center shadow-xl active:scale-90"
              >
                <Plus size={36} strokeWidth={3} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-6">
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search objectives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-white/5 rounded-3xl pl-16 pr-8 py-4 text-slate-950 dark:text-white focus:ring-2 focus:ring-red-500/30 dark:focus:ring-blue-500/30 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-bold text-sm">
          <Filter size={18} className="text-red-500 dark:text-blue-500" />
          <span>Active Objectives: {filteredTasks.length}</span>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20">
        {loading ? (
          <div className="col-span-full py-32 text-center text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] flex flex-col items-center gap-6">
            <div className="h-12 w-12 border-4 border-red-500/20 dark:border-blue-500/20 border-t-red-500 dark:border-t-blue-500 rounded-full animate-spin" />
            Synchronizing Terminal...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="col-span-full py-32 text-center glass rounded-[4rem] border-dashed border-slate-300 dark:border-white/10">
            <LayoutGrid className="mx-auto text-slate-200 dark:text-zinc-900 mb-8" size={80} />
            <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">No active objectives</h3>
            <p className="text-slate-500 dark:text-slate-500 mt-3 text-lg font-medium">Initialize your first task to begin the cycle.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group glass p-10 rounded-[3.5rem] hover:border-red-500/30 dark:hover:border-blue-500/30 transition-all hover:-translate-y-3 relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className={`text-[10px] font-black px-4 py-1.5 rounded-full border tracking-widest ${
                    task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
                    task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}>
                    {task.priority}
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2.5 text-slate-400 hover:text-red-500 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 className={`text-2xl font-black text-slate-950 dark:text-white mb-10 leading-tight tracking-tight flex-1 ${task.status === 'COMPLETED' ? 'line-through opacity-30' : ''}`}>
                  {task.title}
                </h3>

                <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-auto">
                   <div className="flex items-center gap-5 text-slate-400 dark:text-slate-500 text-xs font-black">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-red-500 dark:text-blue-500" />
                        {task.estimatedHours}H
                      </div>
                   </div>
                   <div className="p-3 bg-slate-50 dark:bg-black rounded-2xl shadow-inner border border-slate-100 dark:border-white/5">
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle2 className="text-emerald-500" size={24} />
                      ) : (
                        <Circle className="text-slate-300 dark:text-zinc-800" size={24} />
                      )}
                   </div>
                </div>
              </div>
              
              {/* Background Glow */}
              <div className={`absolute -right-12 -bottom-12 w-40 h-40 blur-[80px] opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity rounded-full ${
                 task.priority === 'HIGH' ? 'bg-rose-500' :
                 task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
