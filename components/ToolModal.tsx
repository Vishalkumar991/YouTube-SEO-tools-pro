
import React, { useState, useEffect, useMemo } from 'react';
import { Tool, AIModel } from '../types';
import { generateAIContent } from '../services/geminiService';
import { TOOLS } from '../constants';

interface ToolModalProps {
  tool: Tool;
  onClose: () => void;
}

const ToolModal: React.FC<ToolModalProps> = ({ tool: initialTool, onClose }) => {
  const [tool, setTool] = useState<Tool>(initialTool);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<Record<string, string>>({});
  const [model, setModel] = useState<AIModel>('gemini-3-flash-preview');

  const currentIndex = useMemo(() => TOOLS.findIndex(t => t.id === tool.id), [tool]);

  const relatedTools = useMemo(() => {
    return TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 10);
  }, [tool]);

  useEffect(() => {
    const initialOptions: Record<string, string> = {};
    tool.advancedOptions?.forEach(opt => {
      if (opt.defaultValue) initialOptions[opt.id] = opt.defaultValue;
    });
    setOptions(initialOptions);
    setInput('');
    setResult(null);
    setError(null);
  }, [tool]);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateAIContent(tool.id, input, options, model);
      setResult(response);
      
      const history = JSON.parse(localStorage.getItem('yt_tool_history') || '[]');
      history.unshift({ toolId: tool.id, toolName: tool.name, input, timestamp: Date.now() });
      localStorage.setItem('yt_tool_history', JSON.stringify(history.slice(0, 10)));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    const next = TOOLS[(currentIndex + 1) % TOOLS.length];
    setTool(next);
  };

  const goToPrev = () => {
    const prev = TOOLS[(currentIndex - 1 + TOOLS.length) % TOOLS.length];
    setTool(prev);
  };

  const isLinkTool = tool.id.includes('video') || tool.id.includes('link') || tool.id.includes('dl') || tool.id.includes('sentiment') || tool.id.includes('timestamps');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-10 bg-black/98 backdrop-blur-3xl animate-in fade-in zoom-in duration-300">
      <div className="bg-[#080808] w-full max-w-[95rem] rounded-[2rem] md:rounded-[4.5rem] overflow-hidden border border-white/10 flex flex-col md:flex-row max-h-[98vh] shadow-[0_0_150px_rgba(29,191,115,0.1)] relative">
        <div className={`absolute top-0 left-0 w-2 h-full ${tool.category === 'fiverr' ? 'bg-green-600' : (tool.category === 'youtube' ? 'bg-blue-600' : 'bg-red-600')}`}></div>

        {/* Sidebar Switcher */}
        <div className="hidden xl:flex flex-col w-80 bg-black/40 border-r border-white/5 p-10 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <h4 className="text-[0.6rem] font-black text-gray-700 uppercase tracking-[0.4em] ml-2 italic">Neural Engines</h4>
            <p className="text-[0.55rem] text-gray-800 font-bold uppercase tracking-widest ml-2">Context: {tool.category}</p>
          </div>
          <div className="space-y-4">
            {relatedTools.map(t => (
              <button 
                key={t.id}
                onClick={() => setTool(t)}
                className={`w-full p-6 rounded-3xl text-left flex items-center gap-4 group transition-all border ${t.id === tool.id ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:border-green-600/30'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${t.id === tool.id ? 'bg-green-600' : 'bg-white/5 group-hover:bg-green-600/20'}`}>
                  <i className={`fas ${t.icon} text-[0.7rem] ${t.id === tool.id ? 'text-white' : 'text-gray-600 group-hover:text-green-500'}`}></i>
                </div>
                <span className={`text-[0.65rem] font-black uppercase tracking-tight transition-colors ${t.id === tool.id ? 'text-white' : 'text-gray-600 group-hover:text-white'}`}>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="px-8 md:px-16 py-6 md:py-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] via-transparent to-transparent">
            <div className="flex items-center gap-6 md:gap-10">
              <div className={`w-12 h-12 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2.5rem] ${tool.category === 'fiverr' ? 'bg-green-600' : (tool.category === 'youtube' ? 'bg-blue-600' : 'bg-red-600')} flex items-center justify-center shadow-3xl`}>
                <i className={`fas ${tool.icon} text-white text-xl md:text-4xl`}></i>
              </div>
              <div>
                <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">{tool.name}</h2>
                <div className="hidden md:flex items-center gap-4 mt-3">
                  <span className={`px-4 py-1.5 ${tool.category === 'fiverr' ? 'bg-green-600' : (tool.category === 'youtube' ? 'bg-blue-600' : 'bg-red-600')} text-[0.65rem] font-black rounded-xl uppercase tracking-widest`}>
                    PLATINUM v5.0
                  </span>
                  <p className="text-[0.7rem] text-gray-600 uppercase font-black tracking-[0.3em] italic">90-Point Deep Neural Analysis Ready</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex bg-white/5 p-2 rounded-2xl border border-white/10">
                <button onClick={() => setModel('gemini-3-flash-preview')} className={`px-6 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest ${model === 'gemini-3-flash-preview' ? 'bg-green-600 text-white' : 'text-gray-600'}`}>Flash</button>
                <button onClick={() => setModel('gemini-3-pro-preview')} className={`px-6 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest ${model === 'gemini-3-pro-preview' ? 'bg-green-600 text-white' : 'text-gray-600'}`}>Pro</button>
              </div>
              <button onClick={onClose} className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-600 transition-all">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="p-8 md:p-16 overflow-y-auto custom-scrollbar flex-grow space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <div className="space-y-4">
                  <label className={`text-[0.6rem] font-black uppercase tracking-[0.4em] ml-4 italic ${tool.category === 'fiverr' ? 'text-green-500' : (tool.category === 'youtube' ? 'text-blue-500' : 'text-red-500')}`}>
                    {isLinkTool ? 'ENTER YOUTUBE VIDEO LINK' : 'NEURAL BUFFER INPUT'}
                  </label>
                  <textarea
                    className="w-full bg-black border border-white/10 rounded-[2.5rem] p-8 md:p-12 focus:outline-none focus:border-green-600 text-lg md:text-2xl font-black italic min-h-[140px] md:min-h-[180px] shadow-2xl transition-all"
                    placeholder={tool.placeholder || "Enter your data for 90-point analysis..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  {isLinkTool && (
                    <p className="text-[0.55rem] text-gray-600 font-bold uppercase tracking-widest ml-6">
                      <i className="fas fa-info-circle mr-2"></i> Ensure the link is public for the neural scanner to connect.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tool.advancedOptions?.map(opt => (
                    <div key={opt.id} className="space-y-3">
                      <label className="text-[0.6rem] font-black text-gray-700 uppercase tracking-widest ml-4 italic">{opt.label}</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[0.7rem] font-black focus:border-green-600 text-gray-400 appearance-none shadow-xl uppercase tracking-widest"
                        value={options[opt.id] || ''}
                        onChange={(e) => setOptions({...options, [opt.id]: e.target.value})}
                      >
                        {opt.choices?.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRun}
                  disabled={loading || !input.trim()}
                  className={`group w-full bg-gradient-to-r ${tool.category === 'fiverr' ? 'from-green-700 via-green-600 to-green-800' : (tool.category === 'youtube' ? 'from-blue-700 via-blue-600 to-blue-800' : 'from-red-700 via-red-600 to-red-800')} py-8 md:py-10 rounded-[2.5rem] text-white font-black text-xl md:text-2xl uppercase tracking-widest shadow-4xl disabled:opacity-20 transition-all active:scale-95`}
                >
                  {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-brain-circuit group-hover:rotate-12 transition-transform"></i>}
                  <span className="ml-4">{loading ? 'SCANNING VIDEO DATA...' : 'GENERATE 90-POINT DEEP REPORT'}</span>
                </button>
              </div>

              <div className="hidden lg:block space-y-8">
                <div className={`p-8 rounded-[3.5rem] border space-y-6 ${tool.category === 'fiverr' ? 'bg-green-600/5 border-green-600/10' : (tool.category === 'youtube' ? 'bg-blue-600/5 border-blue-600/10' : 'bg-red-600/5 border-red-600/10')}`}>
                  <h4 className={`text-[0.6rem] font-black uppercase tracking-[0.4em] italic ${tool.category === 'fiverr' ? 'text-green-600' : (tool.category === 'youtube' ? 'text-blue-600' : 'text-red-600')}`}>Discovery Engine</h4>
                  <div className="space-y-4">
                    {["Algorithmic Sync Ready", "Neural Context Mapping", "Discovery Rank Bias: +14%", "NLP Tokenization Active"].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 text-[0.65rem] font-black text-gray-600 uppercase italic">
                        <div className={`w-1.5 h-1.5 rounded-full ${tool.category === 'fiverr' ? 'bg-green-600' : (tool.category === 'youtube' ? 'bg-blue-600' : 'bg-red-600')}`}></div>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {result && (
              <div className="pt-16 border-t border-white/10 space-y-10 animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-center px-4">
                  <h4 className="text-[0.7rem] font-black text-gray-600 uppercase tracking-[0.5em] italic text-center md:text-left">DEEP NEURAL REPORT READY</h4>
                  <button onClick={() => { navigator.clipboard.writeText(result); alert('Report Copied to Dashboard!'); }} className="text-[0.6rem] font-black text-green-600 uppercase tracking-widest hover:underline">Copy Report</button>
                </div>
                <div className="bg-white/[0.01] p-10 md:p-16 rounded-[3.5rem] border border-white/5 prose prose-invert max-w-none whitespace-pre-wrap font-medium text-lg md:text-xl leading-relaxed text-gray-400 italic">
                  {result}
                </div>
              </div>
            )}
          </div>

          <div className="px-8 md:px-16 py-6 md:py-8 bg-black border-t border-white/5 flex justify-between items-center">
            <p className="text-[0.5rem] md:text-[0.6rem] text-gray-800 font-black uppercase tracking-[0.4em] italic">NEURAL v5.0.3 • END-TO-END DATA SYNC</p>
            <div className="flex gap-6 md:gap-10">
              <button onClick={goToPrev} className="text-[0.55rem] md:text-[0.65rem] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-colors"><i className="fas fa-arrow-left mr-2"></i> PREV ENGINE</button>
              <button onClick={goToNext} className="text-[0.55rem] md:text-[0.65rem] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-colors">NEXT ENGINE <i className="fas fa-arrow-right ml-2"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolModal;
