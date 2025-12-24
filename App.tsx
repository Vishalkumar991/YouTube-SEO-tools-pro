
import React, { useState, useEffect, useMemo } from 'react';
import { TOOLS, CATEGORIES } from './constants';
import { Tool, Category, Page, User, AuthMode } from './types';
import ToolCard from './components/ToolCard';
import ToolModal from './components/ToolModal';
import { generateToolBlog } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('none');
  const [history, setHistory] = useState<any[]>([]);
  
  const [blogTool, setBlogTool] = useState<Tool | null>(null);
  const [blogContent, setBlogContent] = useState<string | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('yt_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedHistory = JSON.parse(localStorage.getItem('yt_tool_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { 
      name: authMode === 'register' ? 'New Freelancer' : 'Master Creator', 
      email: 'user@neuralsuite.ai', 
      isPro: true, 
      avatar: authMode === 'register' ? 'NF' : 'MC' 
    };
    setUser(newUser);
    localStorage.setItem('yt_user', JSON.stringify(newUser));
    setAuthMode('none');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('yt_user');
    setCurrentPage('home');
  };

  const loadBlog = async (tool: Tool) => {
    setBlogTool(tool);
    setBlogContent(null);
    setBlogLoading(true);
    setCurrentPage('blog');
    window.scrollTo(0,0);
    try {
      const content = await generateToolBlog(tool.name, tool.category);
      setBlogContent(content || "Guide is being updated by the algorithm...");
    } catch (e) {
      setBlogContent("Connection to SEO Database failed.");
    } finally {
      setBlogLoading(false);
    }
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const renderHome = () => (
    <>
      <section className="pt-32 pb-44 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[60rem] h-[60rem] bg-red-600/10 rounded-full blur-[250px]" />
          <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-green-600/5 rounded-full blur-[200px]" />
        </div>
        <div className="container mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[0.7rem] font-black uppercase tracking-[0.4em] mb-12 shadow-[0_0_40px_rgba(220,38,38,0.1)]">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            SYSTEM ONLINE: FIVERR & YOUTUBE NEURAL MODES ACTIVE
          </div>
          <h2 className="text-8xl md:text-[11rem] font-black uppercase tracking-tighter italic leading-[0.8] mb-12">
            FREELANCE <br/><span className="bg-gradient-to-r from-green-500 via-white to-red-600 bg-clip-text text-transparent underline decoration-[20px] decoration-green-500 underline-offset-[-10px]">DOMINANCE.</span>
          </h2>
          <p className="text-gray-500 text-3xl font-medium max-w-5xl mx-auto mb-20 leading-relaxed italic">
            "The world's most powerful AI suite for YouTube Creators and Fiverr Freelancers. Generate 90-point reports instantly."
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`px-10 py-5 rounded-[2.2rem] border font-black text-[0.75rem] uppercase tracking-widest transition-all ${
                  selectedCategory === cat.id ? 
                  (cat.id === 'fiverr' ? 'bg-green-600 border-green-600 text-white shadow-green-600/30' : 'bg-red-600 border-red-600 text-white shadow-red-600/30') 
                  + ' scale-110 -translate-y-2' : 
                  'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                }`}
              >
                <i className={`fas ${cat.icon} mr-4`}></i> {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-8 py-24">
        <div className="flex flex-col xl:flex-row justify-between items-end mb-20 gap-10">
          <div>
            <h3 className="text-5xl font-black uppercase italic tracking-tighter">Marketplace Hub</h3>
            <p className="text-gray-600 font-bold uppercase tracking-[0.3em] text-[0.6rem] mt-3">Active Algorithm Filters: ON • Discovery Indexing: ENABLED</p>
          </div>
          <div className="relative w-full xl:w-[35rem]">
            <i className="fas fa-search absolute left-8 top-1/2 -translate-y-1/2 text-gray-600 text-xl"></i>
            <input 
              type="text" 
              placeholder="Search 80+ neural engines..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-6 pl-20 pr-10 focus:outline-none focus:border-red-600 focus:ring-[15px] focus:ring-red-600/5 transition-all text-xl font-bold"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} onClick={() => setActiveTool(tool)} />
          ))}
        </div>
      </section>
    </>
  );

  const renderBlog = () => (
    <div className="container mx-auto px-8 py-32 max-w-5xl">
      <button onClick={() => setCurrentPage('home')} className="mb-12 text-red-600 font-black uppercase tracking-widest text-xs flex items-center gap-3">
        <i className="fas fa-arrow-left"></i> BACK TO SUITE
      </button>
      {blogLoading ? (
        <div className="py-40 text-center space-y-10">
          <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-2xl font-black uppercase italic tracking-tighter animate-pulse">Consulting the SEO Neural Database...</p>
        </div>
      ) : (
        <article className="space-y-16 animate-in fade-in duration-1000">
          <div className="space-y-6">
            <span className="px-6 py-2 bg-red-600/10 border border-red-600/20 text-red-500 text-[0.6rem] font-black uppercase tracking-widest rounded-xl">Advanced Academy Lesson</span>
            <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">Mastering the {blogTool?.name}</h1>
            <p className="text-gray-500 font-bold text-xl leading-relaxed italic border-l-4 border-red-600 pl-8">"Why this specific tool is responsible for 40% of viral discovery in 2025."</p>
          </div>
          <div className="prose prose-invert prose-xl max-w-none whitespace-pre-wrap text-gray-400 font-medium leading-[2.2]">
            {blogContent}
          </div>
          <div className="pt-20 border-t border-white/5 flex flex-col items-center gap-10">
            <h3 className="text-4xl font-black uppercase italic">Ready to Apply This?</h3>
            <button 
              onClick={() => { if(blogTool) setActiveTool(blogTool); }}
              className="bg-red-600 text-white px-20 py-8 rounded-[3rem] font-black text-2xl uppercase tracking-widest shadow-2xl shadow-red-600/20 hover:scale-105 transition-all"
            >
              RUN {blogTool?.name?.toUpperCase()} NOW
            </button>
          </div>
        </article>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="container mx-auto px-8 py-24 space-y-20">
      <div className="flex flex-col lg:flex-row justify-between items-end border-b border-white/10 pb-16 gap-10">
        <div className="space-y-4">
          <h2 className="text-7xl font-black uppercase italic tracking-tighter">Command Center</h2>
          <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[0.6rem]">Logged as: {user?.email} • Platinum Account</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center min-w-[16rem] shadow-2xl">
            <p className="text-[0.6rem] font-black text-green-600 uppercase mb-4 tracking-[0.3em]">Freelance Efficiency</p>
            <p className="text-6xl font-black italic tracking-tighter">98.9<span className="text-xl">%</span></p>
          </div>
          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center min-w-[16rem] shadow-2xl">
            <p className="text-[0.6rem] font-black text-red-600 uppercase mb-4 tracking-[0.3em]">Algo Rank</p>
            <p className="text-6xl font-black italic tracking-tighter">TIER 1</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-16">
        <div className="xl:col-span-3 space-y-12">
          <h3 className="text-3xl font-black uppercase italic tracking-tight">Recent Neural Audits</h3>
          <div className="grid grid-cols-1 gap-6">
            {history.length > 0 ? history.map((h, i) => (
              <div key={i} className="bg-white/[0.03] p-12 rounded-[3.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 group hover:border-red-600/30 hover:bg-white/[0.05] transition-all">
                <div className="space-y-4 text-center md:text-left">
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
                    <h4 className="font-black uppercase text-red-600 text-[0.7rem] tracking-[0.3em]">{h.toolName}</h4>
                  </div>
                  <p className="text-3xl font-black tracking-tight leading-tight group-hover:text-red-500 transition-colors">{h.input}</p>
                  <p className="text-xs text-gray-700 font-black uppercase tracking-[0.2em]">{new Date(h.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => { const t = TOOLS.find(x => x.id === h.toolId); if(t) loadBlog(t); }} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[0.6rem] uppercase tracking-widest hover:bg-white/10">READ GUIDE</button>
                  <button onClick={() => { const t = TOOLS.find(x => x.id === h.toolId); if(t) setActiveTool(t); }} className="px-10 py-5 bg-red-600 rounded-2xl font-black text-[0.7rem] uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-500 active:scale-95 transition-all">RUN AGAIN</button>
                </div>
              </div>
            )) : <p className="text-gray-600 font-bold uppercase tracking-widest py-20 text-center italic">No history found yet. Run a tool to see reports here.</p>}
          </div>
        </div>
        <div className="space-y-10">
          <div className="p-12 bg-gradient-to-br from-green-600 to-green-900 rounded-[4rem] shadow-3xl space-y-8 relative overflow-hidden group">
            <h3 className="text-3xl font-black uppercase italic italic">Freelance Path</h3>
            <p className="text-lg font-bold opacity-80 leading-relaxed">Upgrade to Top-Rated AI training by landing 5 more audits.</p>
            <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[75%] transition-all duration-1000"></div>
            </div>
            <p className="text-[0.6rem] font-black uppercase text-white/50 text-right">75% Sync Complete</p>
          </div>
          <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10 space-y-6">
            <h4 className="text-[0.6rem] font-black text-gray-600 uppercase tracking-widest text-center">Protocol Management</h4>
            <div className="space-y-4">
              <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[0.7rem] font-black uppercase hover:bg-white/10">Global Settings</button>
              <button onClick={handleLogout} className="w-full py-5 bg-red-600/10 border border-red-600/20 rounded-2xl text-[0.7rem] font-black uppercase text-red-600 hover:bg-red-600 hover:text-white transition-all">TERMINATE SESSION</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-red-600 selection:text-white">
      {/* Ticker */}
      <div className="bg-red-600 py-3 overflow-hidden border-b border-white/10 z-50 sticky top-0">
        <div className="flex animate-marquee whitespace-nowrap text-[0.6rem] font-black uppercase tracking-[0.4em]">
          {[1,2,3,4,5].map(i => (
            <span key={i} className="mx-12 flex items-center gap-6">
              ALGORITHM UPDATE: Retention weights increased for 2025 <i className="fas fa-bolt text-yellow-300" /> SEO ALERT: Semantic tags now index faster than meta <i className="fas fa-check-circle text-white/50" />
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-[30px] z-40 bg-[#050505]/95 backdrop-blur-3xl border-b border-white/5 py-10">
        <div className="container mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-8 group cursor-pointer" onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); }}>
            <div className="w-16 h-16 rounded-[1.8rem] bg-gradient-to-tr from-green-700 via-green-600 to-green-500 flex items-center justify-center shadow-[0_0_60px_rgba(29,191,115,0.3)] group-hover:scale-110 group-hover:rotate-12 transition-all">
              <i className="fab fa-youtube text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">YT & FV <span className="text-green-600">PRO</span></h1>
              <p className="text-[0.6rem] font-bold text-gray-700 uppercase tracking-[0.5em] mt-2 italic">Neural Marketplace Suite</p>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-16 text-[0.75rem] font-black uppercase tracking-widest text-gray-500">
            <button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'text-green-600' : 'hover:text-white transition-colors'}>Marketplace</button>
            <button className="hover:text-white transition-colors">Academy</button>
            {user ? (
              <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-5 bg-white/5 px-10 py-4 rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all group">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-[0.6rem] group-hover:scale-110 transition-transform">{user.avatar}</div>
                MY HUB
              </button>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => setAuthMode('login')} className="text-white hover:text-green-500 transition-colors uppercase font-black text-xs tracking-widest px-6 py-4">Sign In</button>
                <button onClick={() => setAuthMode('register')} className="bg-green-600 text-white px-10 py-4 rounded-2xl hover:bg-green-500 transition-all shadow-3xl shadow-green-600/30">Join Pro</button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Dynamic Routing */}
      <main className="flex-grow">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'dashboard' && renderDashboard()}
        {currentPage === 'blog' && renderBlog()}
      </main>

      {/* Auth Modal */}
      {authMode !== 'none' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in zoom-in duration-500">
          <div className="bg-[#080808] w-full max-w-lg rounded-[4.5rem] border border-white/10 p-20 space-y-12 shadow-[0_0_200px_rgba(29,191,115,0.15)] relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-3 h-full ${authMode === 'register' ? 'bg-green-600' : 'bg-red-600'}`}></div>
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter">{authMode === 'register' ? 'JOIN THE FORCE' : 'IDENT SYNC'}</h2>
              <p className="text-[0.65rem] text-gray-700 font-black uppercase tracking-[0.5em]">{authMode === 'register' ? 'Create your neural profile' : 'Secure Neural Access'}</p>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-8">
              {authMode === 'register' && (
                <div className="space-y-3">
                  <label className="text-[0.6rem] font-black text-gray-800 uppercase tracking-widest ml-6 italic">Creator Name</label>
                  <input type="text" placeholder="JOE CREATOR" className="w-full bg-black border border-white/10 rounded-[2rem] p-8 focus:outline-none focus:border-green-600 text-lg font-black uppercase tracking-widest placeholder:text-gray-900" required />
                </div>
              )}
              <div className="space-y-3">
                <label className="text-[0.6rem] font-black text-gray-800 uppercase tracking-widest ml-6 italic">Protocol Email</label>
                <input type="email" placeholder="CREATOR@PRO.AI" className="w-full bg-black border border-white/10 rounded-[2rem] p-8 focus:outline-none focus:border-green-600 text-lg font-black uppercase tracking-widest placeholder:text-gray-900" required />
              </div>
              <div className="space-y-3">
                <label className="text-[0.6rem] font-black text-gray-800 uppercase tracking-widest ml-6 italic">Neural Passkey</label>
                <input type="password" placeholder="••••••••" className="w-full bg-black border border-white/10 rounded-[2rem] p-8 focus:outline-none focus:border-green-600 text-lg font-black uppercase tracking-widest placeholder:text-gray-900" required />
              </div>
              <button className={`w-full ${authMode === 'register' ? 'bg-green-600 shadow-green-600/30' : 'bg-red-600 shadow-red-600/30'} py-10 rounded-[2rem] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-4xl text-2xl active:scale-95`}>
                {authMode === 'register' ? 'CREATE ACCOUNT' : 'INITIALIZE ACCESS'}
              </button>
            </form>
            <div className="flex justify-center gap-10 pt-10 border-t border-white/5">
              <button onClick={() => setAuthMode('none')} className="text-[0.65rem] font-black text-gray-800 uppercase hover:text-white transition-colors">Abort</button>
              {authMode === 'login' ? (
                <button onClick={() => setAuthMode('register')} className="text-[0.65rem] font-black text-green-600 uppercase tracking-widest hover:text-green-400 transition-colors">Join instead</button>
              ) : (
                <button onClick={() => setAuthMode('login')} className="text-[0.65rem] font-black text-red-600 uppercase tracking-widest hover:text-red-400 transition-colors">Sign in instead</button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTool && <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />}
      
      <footer className="bg-black py-40 px-8 border-t border-white/5">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-32">
          <div className="md:col-span-2 space-y-12">
            <div className="flex items-center gap-8">
              <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center">
                <i className="fab fa-youtube text-white text-2xl" />
              </div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">YT & FV PRO</h2>
            </div>
            <p className="text-gray-700 font-bold uppercase tracking-[0.4em] text-[0.7rem] leading-[2.5] max-w-2xl italic">
              The world's premier neural suite for algorithmic dominance and freelance excellence. Powered by Project Ultra-Creator. 2025 Neural Evolution.
            </p>
          </div>
          <div className="space-y-10">
            <h4 className="text-[0.7rem] font-black text-gray-800 uppercase tracking-widest">Protocol</h4>
            <div className="flex flex-col gap-6 text-[0.75rem] font-black uppercase tracking-widest text-gray-600">
              <a href="#" className="hover:text-green-600 transition-colors">Privacy Shield</a>
              <a href="#" className="hover:text-green-600 transition-colors">Terms of Command</a>
              <a href="#" className="hover:text-green-600 transition-colors">Neural Documentation</a>
              <a href="#" className="hover:text-green-600 transition-colors">Agency Gateway</a>
            </div>
          </div>
          <div className="space-y-10 text-right">
            <h4 className="text-[0.7rem] font-black text-gray-800 uppercase tracking-widest">Global Sync</h4>
            <div className="flex justify-end gap-10 text-2xl text-gray-700">
              <i className="fab fa-twitter hover:text-white transition-colors cursor-pointer" />
              <i className="fab fa-discord hover:text-white transition-colors cursor-pointer" />
              <i className="fab fa-instagram hover:text-white transition-colors cursor-pointer" />
            </div>
            <p className="text-[0.65rem] font-black text-gray-900 uppercase italic">Status: 99.9% Discovery Uptime</p>
          </div>
        </div>
        <div className="container mx-auto pt-24 mt-24 border-t border-white/5 text-center">
          <p className="text-[0.6rem] font-black text-gray-800 uppercase tracking-[1em]">Project Ultra-Creator • v5.0.3 • Fiverr & YouTube Synced</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
