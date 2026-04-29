import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, User, BrainCircuit, Mic, Paperclip, Eraser } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI study assistant. Ask me anything about your schedule, or get help with a difficult topic! I can also help you break down complex subjects into 40-day roadmaps." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: userMessage });
      if (response.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.data }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared. How can I help you today?" }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)] -mt-6 lg:-mt-10 animate-in fade-in duration-700">
      <header className="flex items-center justify-between mb-8 px-6">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-red-500 dark:bg-blue-600 rounded-2xl shadow-lg shadow-red-500/10 dark:shadow-blue-500/10">
            <BrainCircuit className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter">AI Knowledge Hub</h1>
            <p className="text-slate-500 dark:text-slate-500 font-black uppercase tracking-[0.3em] text-[9px]">Neural Assistant v2.0</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-4 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest"
        >
          <Eraser size={20} />
          <span className="hidden sm:inline">Purge History</span>
        </button>
      </header>

      <div className="flex-1 glass rounded-[4rem] overflow-hidden flex flex-col relative shadow-2xl glow-red dark:glow-blue">
        {/* Ambient Background Glimmer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-red-500/5 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar relative z-10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-4 duration-500`}
            >
              <div className={`flex-shrink-0 p-1 rounded-2xl shadow-lg border-2 ${
                msg.role === 'user' 
                  ? 'bg-red-500 border-red-400 shadow-red-500/20' 
                  : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-white/10'
              }`}>
                <div className="h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center">
                  {msg.role === 'user' ? <User size={22} className="text-white" /> : <img src="/logo.png" className="h-full w-full object-cover" />}
                </div>
              </div>
              
              <div className={`max-w-[90%] lg:max-w-[80%] p-6 rounded-[2rem] shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-red-500 text-white dark:bg-blue-600 rounded-tr-none' 
                  : 'bg-slate-50 dark:bg-black/60 backdrop-blur-md border border-slate-100 dark:border-white/5 text-slate-900 dark:text-slate-200 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose dark:prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-li:my-2 overflow-x-auto selection:bg-red-500/20 dark:selection:bg-blue-500/30">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-base font-medium leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-8 animate-pulse">
              <div className="flex-shrink-0 p-1 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-white/10 shadow-lg">
                 <div className="h-10 w-10 rounded-xl overflow-hidden">
                    <img src="/logo.png" className="h-full w-full object-cover" />
                 </div>
              </div>
              <div className="bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 p-6 rounded-[2rem] rounded-tl-none flex items-center gap-5">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-red-500 dark:bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-red-500 dark:bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-red-500 dark:bg-blue-500 rounded-full animate-bounce" />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.3em]">Processing Neural Query...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Zone */}
        <div className="p-6 lg:p-8 bg-slate-50/50 dark:bg-black/80 border-t border-slate-100 dark:border-white/10 backdrop-blur-xl relative z-10">
          <form onSubmit={handleSend} className="max-w-5xl mx-auto relative group">
            <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-5 text-slate-300 dark:text-zinc-800 group-focus-within:text-red-500 dark:group-focus-within:text-blue-500 transition-colors">
               <Mic size={20} className="cursor-pointer hover:text-red-400 dark:hover:text-blue-400" />
               <Paperclip size={20} className="cursor-pointer hover:text-red-400 dark:hover:text-blue-400" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the AI assistant..."
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-[2.5rem] pl-24 pr-24 py-6 text-slate-950 dark:text-white focus:ring-4 focus:ring-red-500/10 dark:focus:ring-blue-500/10 focus:border-red-500/50 dark:focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-zinc-900 shadow-xl text-lg font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-5 bg-red-500 hover:bg-red-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-[1.5rem] shadow-2xl shadow-red-500/30 dark:shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Send size={24} strokeWidth={3} />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.4em] mt-8">
            Neural Engine Active • Encryption Enabled
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
