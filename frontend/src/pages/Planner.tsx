import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Sparkles, Calendar, Clock, Loader2, Info, ChevronRight, Wand2, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ScheduleItem {
  id: string;
  date: string;
  hours: number;
  task: {
    title: string;
    priority: string;
  };
}

interface Schedule {
  id: string;
  items: ScheduleItem[];
}

const Planner = () => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [improvedText, setImprovedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [improving, setImproving] = useState(false);

  const fetchSchedule = async () => {
    try {
      const response = await api.get('/schedule');
      if (response.data.success) {
        setSchedule(response.data.data);
      }
    } catch (err) {
      console.error('No schedule found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/schedule/generate');
      if (response.data.success) {
        setSchedule(response.data.data);
        setImprovedText(null);
      }
    } catch (err) {
      alert('Failed to generate schedule. Make sure you have pending tasks!');
    } finally {
      setGenerating(false);
    }
  };

  const handleImprove = async () => {
    setImproving(true);
    try {
      const response = await api.post('/ai/improve');
      if (response.data.success) {
        setImprovedText(response.data.data.improvedSchedule);
      }
    } catch (err) {
      console.error('Failed to improve schedule');
    } finally {
      setImproving(false);
    }
  };

  const groupedItems = schedule?.items.reduce((acc: any, item) => {
    const date = new Date(item.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 glass p-10 rounded-[3rem] relative overflow-hidden shadow-xl">
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">Your Smart Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">AI-powered planning to optimize your study velocity.</p>
        </div>
        <div className="flex flex-wrap gap-5 relative z-10">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-950 dark:text-white px-10 py-5 rounded-[2rem] font-bold transition-all border border-slate-200 dark:border-white/10 flex items-center gap-3 disabled:opacity-50"
          >
            {generating ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} />}
            Reschedule Plan
          </button>
          <button
            onClick={handleImprove}
            disabled={!schedule || improving}
            className="bg-red-500 hover:bg-red-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-500 dark:hover:to-purple-500 text-white px-10 py-5 rounded-[2rem] font-black transition-all shadow-xl shadow-red-500/20 dark:shadow-purple-500/20 flex items-center gap-3 disabled:opacity-50"
          >
            {improving ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
            AI Optimization
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 text-slate-500 gap-6">
          <Loader2 className="animate-spin h-12 w-12 text-red-500 dark:text-blue-500" />
          <p className="font-black tracking-[0.2em] uppercase text-[10px]">Architecting your path...</p>
        </div>
      ) : !schedule ? (
        <div className="text-center py-40 glass rounded-[4rem] border-dashed border-slate-300 dark:border-white/10">
          <Calendar className="mx-auto text-slate-200 dark:text-zinc-900 mb-8" size={100} />
          <h2 className="text-4xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter">No Active Plan</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-md mx-auto text-xl font-medium leading-relaxed">
            Your workspace is ready. Add your tasks and let AI build the most efficient study path for you.
          </p>
          <button
            onClick={handleGenerate}
            className="bg-red-500 hover:bg-red-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-16 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-red-500/30 dark:shadow-blue-600/30 transition-all active:scale-95"
          >
            Generate My First Path
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Schedule Column */}
          <div className={`${improvedText ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-12 pb-20`}>
            {Object.entries(groupedItems || {}).map(([date, items]: [any, any]) => (
              <div key={date} className="relative">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-5 w-5 rounded-full bg-red-500 dark:bg-blue-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] dark:shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                  <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">{date}</h3>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
                  <span className="glass px-6 py-2 rounded-full text-[10px] font-black text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 tracking-[0.1em]">
                    {items.length} SESSIONS
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item: any) => (
                    <div 
                      key={item.id} 
                      className="group bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-700 transition-all hover:bg-slate-900 shadow-xl"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                          item.task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          item.task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {item.task.priority}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                          <Clock size={14} />
                          {item.hours}H
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {item.task.title}
                      </h4>
                      <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">Tap for details</span>
                         <ChevronRight size={16} className="text-slate-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights Sidebar */}
          {improvedText && (
            <div className="lg:col-span-5 space-y-6 sticky top-8">
              <div className="bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                {/* Decorative Background Icon */}
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                  <Sparkles size={250} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-purple-400 font-black mb-8 uppercase tracking-[0.2em] text-[10px]">
                    <div className="p-2 bg-purple-500/10 rounded-xl">
                      <Sparkles size={16} />
                    </div>
                    AI Study Strategy
                  </div>
                  
                  <div className="prose prose-invert prose-sm max-w-none text-slate-200 overflow-x-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {improvedText}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-10 pt-8 border-t border-purple-500/20">
                     <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                        <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                        <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                          This schedule has been rebalanced to prevent cognitive fatigue and optimize retention.
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Planner;
