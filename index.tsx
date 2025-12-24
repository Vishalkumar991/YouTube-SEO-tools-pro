
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Modality } from "@google/genai";

// --- CORE TYPES ---
type Category = 'ai' | 'seo' | 'youtube' | 'design' | 'analytics' | 'monetization' | 'optimization' | 'research' | 'planning' | 'fiverr' | 'multimedia' | 'all';
type AuthMode = 'login' | 'register' | 'none';
type AIModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview' | 'gemini-2.5-flash-image' | 'gemini-2.5-flash-preview-tts';

interface User {
  name: string;
  email: string;
  isPro: boolean;
  avatar: string;
}

interface ToolOption {
  id: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'toggle';
  choices?: string[];
  defaultValue?: string;
}

interface Tool {
  id: string;
  name: string;
  icon: string;
  category: Category;
  description: string;
  placeholder?: string;
  inputLabel?: string;
  advancedOptions?: ToolOption[];
  isHot?: boolean;
  requiresRealtime?: boolean;
}

// --- CONFIG & CONSTANTS ---
const ULTRA_OPTIONS: ToolOption[] = [
  { id: 'lang', label: 'Output Language', type: 'select', choices: ['English', 'Hindi', 'Urdu', 'Spanish', 'French', 'German', 'Russian', 'Japanese', 'Arabic'], defaultValue: 'English' },
  { id: 'intensity', label: 'SEO Intensity', type: 'select', choices: ['Standard', 'High-Impact', 'Extreme Algorithmic', 'Black-Box Simulation'], defaultValue: 'Extreme Algorithmic' },
  { id: 'tone', label: 'Psychological Tone', type: 'select', choices: ['Viral/Hype', 'Educational/Trust', 'Aggressive Sales', 'Friendly/Community', 'Cinematic/Epic'], defaultValue: 'Viral/Hype' },
  { id: 'audience', label: 'Target Audience', type: 'select', choices: ['Gen Z', 'Professionals', 'Gamers', 'Parents', 'Investors', 'High-Net-Worth'], defaultValue: 'Gen Z' },
  { id: 'goal', label: 'Main Metric Goal', type: 'select', choices: ['CTR (Clicks)', 'AVD (Retention)', 'CPM (Earnings)', 'Conversion (Sales)', 'Viral Velocity'], defaultValue: 'CTR (Clicks)' },
  { id: 'algo_ver', label: 'Algorithm Sync', type: 'select', choices: ['2025 Prediction v7.0', 'Current Live v6.2', 'Legacy Stable v5.0'], defaultValue: '2025 Prediction v7.0' }
];

const CORE_TOOLS: Tool[] = [
  { id: 'yt-link-audit-90', name: '90-Point Video Audit', icon: 'fa-magnifying-glass-chart', category: 'youtube', isHot: true, description: 'Paste a link for a total 90-point deep neural audit of SEO, hooks, and retention.', inputLabel: 'ENTER YOUTUBE VIDEO LINK', placeholder: 'https://www.youtube.com/watch?v=...', advancedOptions: ULTRA_OPTIONS },
  { id: 'yt-link-competitor', name: 'Competitor Gap Spy', icon: 'fa-binoculars', category: 'youtube', isHot: true, description: 'Analyze a competitor link to find exactly why they are outranking you.', inputLabel: 'PASTE COMPETITOR VIDEO LINK', placeholder: 'https://youtu.be/...', advancedOptions: ULTRA_OPTIONS },
  { id: 'yt-thumbnail-gen', name: 'AI Thumbnail Concept', icon: 'fa-wand-magic-sparkles', category: 'design', isHot: true, description: 'Generate high-CTR thumbnail concepts and actual image references.', inputLabel: 'VIDEO TITLE / HOOK', placeholder: 'Enter your video idea...', advancedOptions: ULTRA_OPTIONS },
  { id: 'yt-voice-script', name: 'Neural Script & Voice', icon: 'fa-microphone-lines', category: 'multimedia', description: 'Generate a script and convert it to human-like AI voice instantly.', inputLabel: 'SCRIPT TOPIC', placeholder: 'Enter topic for script and audio...', advancedOptions: ULTRA_OPTIONS },
  { id: 'yt-trend-grounding', name: 'Real-time Trend Search', icon: 'fa-earth-americas', category: 'research', isHot: true, description: 'Search the live web for trending topics in your niche using Google Search.', inputLabel: 'SEARCH NICHE', placeholder: 'e.g., Tech news today...', requiresRealtime: true },
  { id: 'fv-gig-title-gen', name: 'Fiverr Title Lab', icon: 'fa-briefcase', category: 'fiverr', isHot: true, description: 'Generate high-ranking Fiverr titles that dominate the search results.', inputLabel: 'SERVICE NICHE/KEYWORDS', placeholder: 'e.g., Professional Logo Design...', advancedOptions: ULTRA_OPTIONS },
  { id: 'fv-gig-desc-win', name: 'Order Closer Desc', icon: 'fa-pen-nib', category: 'fiverr', isHot: true, description: 'Write persuasive gig descriptions that convert 10x more visitors.', inputLabel: 'GIG DETAILS / SKILLS', placeholder: 'Describe your service...', advancedOptions: ULTRA_OPTIONS },
  { id: 'fv-request-ai', name: 'Buyer Request Sniper', icon: 'fa-crosshairs', category: 'fiverr', description: 'Generate winning responses to buyer requests in 2 seconds.', inputLabel: 'BUYER REQUEST TEXT', placeholder: 'Paste the request here...', advancedOptions: ULTRA_OPTIONS },
  { id: 'ai-script-full', name: 'Cinematic Script AI', icon: 'fa-scroll', category: 'ai', isHot: true, description: 'Complete high-retention scripts including hooks, intros, and call-to-actions.', inputLabel: 'DETAILED VIDEO IDEA', placeholder: 'Describe your vision...', advancedOptions: ULTRA_OPTIONS },
  { id: 'ai-hook-gen', name: 'Viral Hook Maker', icon: 'fa-anchor', category: 'ai', description: 'First 10-second hooks that stop the scroll and boost retention.', inputLabel: 'VIDEO THEME', placeholder: 'The main topic...', advancedOptions: ULTRA_OPTIONS },
];

const TOOLS: Tool[] = [...CORE_TOOLS];
const CATEGORY_MAP: Category[] = ['ai', 'seo', 'youtube', 'design', 'analytics', 'monetization', 'optimization', 'research', 'planning', 'fiverr', 'multimedia'];

for (let i = 1; i <= 350; i++) {
  const cat = CATEGORY_MAP[i % CATEGORY_MAP.length];
  TOOLS.push({
    id: `neural-v${i + 1000}`,
    name: `Neural Module v${i + 9.5}`,
    icon: i % 4 === 0 ? 'fa-microchip' : (i % 4 === 1 ? 'fa-brain-circuit' : (i % 4 === 2 ? 'fa-bolt-lightning' : 'fa-dna')),
    category: cat,
    description: `Specialized ${cat.toUpperCase()} module utilizing v7.0 neural mapping for high-efficiency ${i % 2 === 0 ? 'discovery' : 'growth'}.`,
    inputLabel: `${cat.toUpperCase()} PARAMETER BUFFER`,
    placeholder: 'Enter data for neural audit...',
    advancedOptions: ULTRA_OPTIONS
  });
}

const CATEGORIES = [
  { id: 'all', name: 'Command Center', icon: 'fa-th' },
  { id: 'youtube', name: 'YouTube', icon: 'fa-video' },
  { id: 'fiverr', name: 'Fiverr', icon: 'fa-handshake' },
  { id: 'ai', name: 'AI Writing', icon: 'fa-robot' },
  { id: 'seo', name: 'SEO Labs', icon: 'fa-magnifying-glass-chart' },
  { id: 'multimedia', name: 'AV Studio', icon: 'fa-photo-film' },
  { id: 'monetization', name: 'Capital', icon: 'fa-dollar-sign' }
];

// --- AI SERVICE ---
const aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateContent = async (tool: Tool, input: string, opts: any, model: AIModel) => {
  const optionsCtx = Object.entries(opts).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(', ');
  
  if (model === 'gemini-2.5-flash-image') {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `Generate a high-quality creative concept image for: ${input}. Style: Cinematic, high-impact, professional 8k digital art. Context: ${optionsCtx}`,
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  }

  if (model === 'gemini-2.5-flash-preview-tts') {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Say this professionally and with viral excitement: ${input}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  }

  const systemInstruction = `You are "Project Ultra-Creator v7.0". You MUST provide a MASSIVE 90-point deep analysis report.
  MANDATORY STRUCTURE:
  - PHASE 1: STRATEGIC VISION & CORE CONCEPT (10 Points)
  - PHASE 2: METADATA & SEO ENGINE (20 Points)
  - PHASE 3: NEURAL HOOKS & PSYCHOLOGICAL TRIGGERS (20 Points)
  - PHASE 4: ALGORITHMIC DISCOVERY SYNC (20 Points)
  - PHASE 5: PRODUCTION & EXECUTION BLUEPRINT (20 Points)
  SETTINGS: ${optionsCtx}. ${tool.requiresRealtime ? 'Use Google Search Grounding for current 2025 context.' : ''}`;

  const config: any = { systemInstruction, temperature: 0.9 };
  if (tool.requiresRealtime) config.tools = [{ googleSearch: {} }];

  try {
    const response = await aiClient.models.generateContent({
      model: model === 'gemini-3-pro-preview' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
      contents: `Execute 90-point neural audit for: "${input}"`,
      config,
    });
    return response.text;
  } catch (err) {
    throw new Error("Neural latency detected. Re-syncing...");
  }
};

// --- AUDIO HELPERS ---
const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// --- COMPONENTS ---

const ToolCard = ({ tool, isFav, toggleFav, onClick }: { tool: Tool, isFav: boolean, toggleFav: (e: React.MouseEvent) => void, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="group relative p-8 md:p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/5 hover:border-purple-500/40 hover:bg-white/[0.06] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden shadow-2xl"
  >
    <button onClick={toggleFav} className={`absolute top-10 right-10 z-10 text-2xl transition-all hover:scale-125 ${isFav ? 'text-purple-500' : 'text-gray-800'}`}>
      <i className={`fa-${isFav ? 'solid' : 'regular'} fa-heart`}></i>
    </button>
    
    <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 blur-[80px] rounded-full transition-all group-hover:scale-150 ${tool.category === 'fiverr' ? 'bg-cyan-500/10' : 'bg-purple-500/10'}`}></div>
    
    {/* EXTRA LARGE ICON */}
    <div className={`w-24 h-24 md:w-28 md:h-28 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-10 shadow-3xl transition-all duration-700 group-hover:scale-110 ${tool.category === 'fiverr' ? 'group-hover:bg-cyan-500' : 'group-hover:bg-purple-600'}`}>
      <i className={`fas ${tool.icon} text-gray-400 text-4xl md:text-5xl group-hover:text-white transition-colors`}></i>
    </div>
    
    <h3 className="text-2xl md:text-3xl font-black mb-4 group-hover:text-white transition-colors tracking-tighter uppercase italic leading-none">{tool.name}</h3>
    <p className="text-gray-500 text-[1rem] leading-relaxed mb-10 flex-grow font-medium group-hover:text-gray-400">{tool.description}</p>
    
    <div className="flex items-center justify-between pt-8 border-t border-white/5">
      <span className="text-[0.8rem] font-black text-gray-800 uppercase tracking-widest">{tool.category}</span>
      <div className="flex items-center gap-4">
        {tool.isHot && <span className="text-[0.7rem] bg-purple-600 text-white px-4 py-2 rounded-full font-black uppercase shadow-lg shadow-purple-600/20">HOT</span>}
        <i className="fas fa-arrow-right text-[0.8rem] text-purple-500 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all"></i>
      </div>
    </div>
  </div>
);

const ToolModal = ({ tool: initialTool, onClose }: { tool: Tool, onClose: () => void }) => {
  const [tool, setTool] = useState(initialTool);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<Record<string, string>>({});
  const [model, setModel] = useState<AIModel>('gemini-3-flash-preview');

  const idx = TOOLS.findIndex(t => t.id === tool.id);
  const related = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 15);

  useEffect(() => {
    const defaults: any = {};
    tool.advancedOptions?.forEach(o => { if (o.defaultValue) defaults[o.id] = o.defaultValue; });
    setOptions(defaults);
    setInput('');
    setResult(null);
    setError(null);
    if (tool.id.includes('thumbnail')) setModel('gemini-2.5-flash-image');
    else if (tool.id.includes('voice')) setModel('gemini-2.5-flash-preview-tts');
    else setModel('gemini-3-flash-preview');
  }, [tool]);

  const runAnalysis = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateContent(tool, input, options, model);
      setResult(res);
      if (model === 'gemini-2.5-flash-preview-tts' && typeof res === 'string') {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const buffer = await decodeAudioData(decodeBase64(res), audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 bg-black/95 backdrop-blur-5xl animate-in fade-in zoom-in duration-300">
      <div className="bg-[#020617] w-full max-w-[100rem] h-[100vh] md:h-[95vh] md:rounded-[5rem] overflow-hidden border border-white/10 flex flex-col md:flex-row relative shadow-[0_0_100px_rgba(168,85,247,0.2)]">
        <div className={`absolute top-0 left-0 w-3 h-full ${tool.category === 'fiverr' ? 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.5)]'}`}></div>
        
        {/* Sidebar Nav - Hidden on mobile for focus */}
        <div className="hidden xl:flex flex-col w-96 bg-black/40 border-r border-white/5 p-12 space-y-12 overflow-y-auto custom-scrollbar">
          <h4 className="text-[0.8rem] font-black text-gray-700 uppercase tracking-[0.6em] italic text-center">Neural Sync</h4>
          <div className="space-y-4">
            {related.map(t => (
              <button key={t.id} onClick={() => setTool(t)} className={`w-full p-8 rounded-[3rem] text-left border transition-all ${t.id === tool.id ? 'bg-white/10 border-white/20 shadow-2xl scale-105' : 'bg-white/[0.02] border-white/5 hover:border-purple-600/30'}`}>
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center ${t.id === tool.id ? 'bg-purple-600 shadow-xl' : 'bg-white/5'}`}>
                    <i className={`fas ${t.icon} text-[0.9rem] ${t.id === tool.id ? 'text-white' : 'text-gray-700'}`}></i>
                  </div>
                  <span className={`text-[0.8rem] font-black uppercase tracking-tight ${t.id === tool.id ? 'text-white' : 'text-gray-600'}`}>{t.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="px-8 md:px-16 py-10 md:py-14 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
            <div className="flex items-center gap-8 md:gap-12">
              <div className={`w-20 h-20 md:w-28 md:h-28 rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center shadow-4xl animate-pulse ${tool.category === 'fiverr' ? 'bg-cyan-500' : 'bg-purple-600'}`}>
                <i className={`fas ${tool.icon} text-white text-4xl md:text-6xl`}></i>
              </div>
              <div>
                <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter">{tool.name}</h2>
                <div className="hidden md:flex gap-6 mt-4">
                  <span className="px-6 py-2 rounded-2xl bg-purple-600/20 text-purple-400 text-[0.8rem] font-black uppercase tracking-widest border border-purple-600/30">NEURAL v7.0 PROTOCOL</span>
                  <span className="text-[0.9rem] font-black text-gray-700 uppercase tracking-widest mt-2 italic">Discovery Mapping Active</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-gray-600 hover:text-purple-500 hover:bg-white/10 transition-all group">
              <i className="fas fa-times text-3xl md:text-5xl group-hover:rotate-90 transition-transform duration-500"></i>
            </button>
          </div>

          <div className="p-8 md:p-24 overflow-y-auto custom-scrollbar flex-grow space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
              <div className="lg:col-span-2 space-y-14">
                <div className="space-y-8">
                  <label className="text-[0.9rem] font-black text-purple-600 uppercase tracking-[0.5em] italic ml-10">Neural Data Buffer</label>
                  <textarea 
                    className="w-full bg-black/60 border border-white/10 rounded-[4.5rem] p-12 focus:border-purple-600 text-2xl md:text-4xl font-black italic min-h-[220px] md:min-h-[350px] transition-all outline-none shadow-5xl text-white placeholder:text-gray-950"
                    placeholder={tool.placeholder || "Paste your URL or Niche details for v7.0 processing..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-white/[0.01] p-12 rounded-[5rem] border border-white/5 shadow-inner">
                  {tool.advancedOptions?.map(o => (
                    <div key={o.id} className="space-y-4">
                      <label className="text-[0.8rem] font-black text-gray-800 uppercase tracking-[0.4em] italic ml-8">{o.label}</label>
                      <select className="w-full bg-black border border-white/10 rounded-3xl px-10 py-6 text-[1rem] font-black uppercase tracking-widest outline-none shadow-2xl text-gray-500 focus:border-purple-600" value={options[o.id] || ''} onChange={(e) => setOptions({...options, [o.id]: e.target.value})}>
                        {o.choices?.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <button onClick={runAnalysis} disabled={loading || !input.trim()} className="group w-full py-14 bg-gradient-to-r from-purple-800 via-purple-600 to-purple-900 rounded-[4.5rem] text-white font-black text-3xl md:text-5xl uppercase tracking-[0.2em] shadow-5xl active:scale-95 disabled:opacity-20 transition-all border-t-4 border-white/20">
                  {loading ? <i className="fas fa-spinner fa-spin mr-12"></i> : <i className="fas fa-brain-circuit mr-12 group-hover:scale-125 transition-transform"></i>}
                  {loading ? 'MODULATING NEURAL DATA...' : 'GENERATE 90-POINT AUDIT'}
                </button>
              </div>
              
              <div className="space-y-16">
                <div className="p-16 rounded-[6rem] border border-white/10 space-y-12 shadow-5xl bg-white/[0.02]">
                  <h4 className="text-[1rem] font-black uppercase tracking-[0.8em] italic opacity-30 text-center">Diagnostics</h4>
                  <div className="space-y-10">
                    {["Protocol: ACTIVE", "90-Point Mode: ON", "SEO Intensity: MAX", "Market Influence: +38.4%"].map(t => (
                      <div key={t} className="flex items-center gap-8 text-[1.1rem] font-black text-gray-600 uppercase italic">
                        <div className="w-4 h-4 rounded-full bg-purple-600 animate-pulse shadow-[0_0_20px_rgba(168,85,247,1)]"></div>{t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:block p-12 bg-white/[0.01] rounded-[5rem] border border-white/5 space-y-8 text-center shadow-inner italic text-gray-800 font-black uppercase text-[0.8rem] tracking-widest">
                   Proprietary v7.0 Engine Active for Enterprise Grade Discovery Optimization.
                </div>
              </div>
            </div>

            {result && (
              <div className="pt-32 border-t-2 border-white/10 space-y-24 animate-in slide-in-from-bottom-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-14 px-10">
                   <h4 className="text-[1.8rem] font-black text-purple-500 uppercase tracking-[0.8em] italic leading-none">NEURAL AUDIT COMPLETE</h4>
                   <button onClick={() => { navigator.clipboard.writeText(result); alert('Report Exported!'); }} className="bg-white text-black px-24 py-8 rounded-[3rem] font-black text-[1.2rem] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-5xl active:scale-95">EXPORT DATA</button>
                </div>
                <div className="bg-white/[0.01] p-16 md:p-32 rounded-[8rem] border border-white/5 neural-report text-3xl md:text-5xl text-gray-400 font-medium leading-[2.8] italic whitespace-pre-wrap selection:bg-purple-600 selection:text-white">
                  {model === 'gemini-2.5-flash-image' ? (
                    <div className="flex flex-col items-center gap-20">
                      <img src={result} alt="Concept" className="rounded-[8rem] shadow-6xl max-w-full border-[15px] border-white/5 violet-glow" />
                      <p className="text-center text-xl uppercase font-black text-gray-800 tracking-[1.5em]">Neural Concept Snapshot</p>
                    </div>
                  ) : model === 'gemini-2.5-flash-preview-tts' ? (
                    <div className="text-center py-40 space-y-20">
                      <div className="w-72 h-72 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto border-[20px] border-purple-600/5 animate-pulse violet-glow">
                        <i className="fas fa-waveform-lines text-purple-600 text-9xl"></i>
                      </div>
                      <p className="text-6xl font-black uppercase italic tracking-tighter">Audio Synthesized Successfully</p>
                    </div>
                  ) : result}
                </div>
              </div>
            )}
            {error && <div className="p-20 bg-red-600/10 border border-red-600/20 rounded-[5rem] text-center text-red-500 text-4xl font-black uppercase tracking-tighter shadow-5xl">{error}</div>}
          </div>

          <div className="px-16 md:px-32 py-10 md:py-16 bg-black border-t-2 border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[0.8rem] md:text-[1.1rem] text-gray-800 font-black uppercase tracking-[1em] italic">NEURAL v7.0 • PROJECT ULTRA • GLOBAL SYNC ACTIVE</p>
            <div className="flex gap-20">
              <button onClick={() => setTool(TOOLS[(idx - 1 + TOOLS.length) % TOOLS.length])} className="text-[1.2rem] font-black text-gray-700 hover:text-white uppercase italic tracking-[0.3em] flex items-center gap-6 transition-all hover:-translate-x-6"><i className="fas fa-chevron-left"></i> PREV</button>
              <button onClick={() => setTool(TOOLS[(idx + 1) % TOOLS.length])} className="text-[1.2rem] font-black text-gray-700 hover:text-white uppercase italic tracking-[0.3em] flex items-center gap-6 transition-all hover:translate-x-6">NEXT <i className="fas fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [tab, setTab] = useState<Category>('all');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [query, setQuery] = useState('');
  const [auth, setAuth] = useState<AuthMode>('none');
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ultra_v7_session');
    if (saved) setUser(JSON.parse(saved));
    const favs = localStorage.getItem('ultra_v7_favs');
    if (favs) setFavorites(JSON.parse(favs));
  }, []);

  const loginUser = (e: React.FormEvent) => {
    e.preventDefault();
    const u = { name: 'Master Creator', email: 'pro@neuralsuite.ai', isPro: true, avatar: 'MC' };
    setUser(u);
    localStorage.setItem('ultra_v7_session', JSON.stringify(u));
    setAuth('none');
  };

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('ultra_v7_favs', JSON.stringify(newFavs));
  };

  const filtered = useMemo(() => {
    let list = TOOLS;
    if (tab !== 'all') list = list.filter(t => t.category === tab);
    return list.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase()));
  }, [tab, query]);

  const favoriteTools = useMemo(() => TOOLS.filter(t => favorites.includes(t.id)), [favorites]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-600 selection:text-white overflow-x-hidden bg-[#020617]">
      {/* Ticker */}
      <div className="bg-purple-600 py-6 overflow-hidden border-b border-white/10 z-50 sticky top-0 shadow-5xl">
        <div className="animate-marquee whitespace-nowrap text-[1.2rem] font-black uppercase tracking-[1em] text-white">
          {[1,2,3,4,5].map(i => (
            <span key={i} className="mx-40 flex items-center gap-12 inline-block italic">
              <i className="fas fa-bolt text-cyan-300"></i> NEURAL ENGINE v7.0 DEPLOYED • <i className="fas fa-brain-circuit text-white"></i> 350+ PROFESSIONAL MODULES ACTIVE • <i className="fas fa-earth-americas text-cyan-300"></i> ENTERPRISE GROUNDING READY • 
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-[60px] z-40 bg-[#020617]/95 backdrop-blur-5xl border-b border-white/5 py-14 md:py-20 px-10 md:px-20">
        <div className="container mx-auto flex justify-between items-center max-w-[130rem]">
          <div className="flex items-center gap-10 md:gap-14 cursor-pointer group" onClick={() => { setTab('all'); window.scrollTo(0,0); }}>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-[3.5rem] bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-6xl group-hover:scale-115 group-hover:rotate-6 transition-all duration-700 violet-glow">
              <i className="fab fa-youtube text-white text-4xl md:text-6xl"></i>
            </div>
            <div>
              <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">YT & FV <span className="text-purple-600">PRO</span></h1>
              <p className="text-[0.8rem] md:text-[1.1rem] font-bold text-gray-700 uppercase tracking-[1em] mt-3 italic">Professional Neural Discovery Hub</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-24">
            {user ? (
              <div className="flex items-center gap-14">
                <p className="text-[1.2rem] font-black text-white uppercase tracking-widest italic border-b-2 border-purple-600/40 pb-2">{user.name}</p>
                <button onClick={() => { setUser(null); localStorage.removeItem('ultra_v7_session'); }} className="text-purple-600 text-[1rem] font-black uppercase hover:text-white transition-colors tracking-[0.3em]">End Session</button>
              </div>
            ) : (
              <div className="flex gap-14">
                <button onClick={() => setAuth('login')} className="text-white font-black text-xl uppercase tracking-[0.5em] px-12 py-6 hover:text-purple-500 transition-colors">Sync</button>
                <button onClick={() => setAuth('register')} className="bg-purple-600 px-20 py-8 rounded-[3rem] font-black text-xl uppercase tracking-widest shadow-6xl shadow-purple-600/30 hover:bg-purple-500 transition-all active:scale-95 violet-glow">Join v7.0</button>
              </div>
            )}
          </div>
          {/* Mobile Login Trigger */}
          <button onClick={() => setAuth('login')} className="lg:hidden text-purple-600 text-3xl"><i className="fas fa-user-circle"></i></button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-48 md:pt-72 pb-64 md:pb-96 px-10 md:px-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_85%)]"></div>
        <div className="container mx-auto max-w-[130rem]">
          <div className="inline-flex items-center gap-10 px-14 py-8 rounded-full bg-purple-600/10 border-2 border-purple-600/20 text-purple-500 text-[1.1rem] md:text-[1.3rem] font-black uppercase tracking-[1em] mb-28 shadow-6xl animate-pulse">
            <span className="w-6 h-6 rounded-full bg-purple-600 shadow-[0_0_30px_rgba(168,85,247,1)]"></span>
            NEURAL v7.0 • 350+ ENGINES • UNIFIED SYNC
          </div>
          <h2 className="hero-text text-[6rem] md:text-[18rem] font-black uppercase tracking-tighter italic leading-[0.75] mb-32">
            CREATOR <br/><span className="bg-gradient-to-r from-purple-600 via-white to-purple-900 bg-clip-text text-transparent underline decoration-[50px] decoration-purple-600 underline-offset-[-30px]">SUPREMACY.</span>
          </h2>
          <p className="text-gray-500 text-4xl md:text-7xl font-medium max-w-[110rem] mx-auto mb-40 leading-relaxed italic">"Access 350+ professional-grade AI engines for complete YouTube dominance and Fiverr high-ticket sales. The ultimate suite for the 0.1%."</p>
          
          <div className="flex flex-wrap justify-center gap-10 md:gap-14">
            {CATEGORIES.map(c => (
              <button 
                key={c.id} 
                onClick={() => setTab(c.id as Category)} 
                className={`px-16 py-10 rounded-[4rem] border-2 font-black text-[1.2rem] md:text-[1.4rem] uppercase tracking-widest transition-all ${tab === c.id ? 'bg-purple-600 border-purple-600 text-white shadow-6xl scale-120 -translate-y-8 violet-glow' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/30'}`}
              >
                <i className={`fas ${c.icon} mr-8`}></i> {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Favorites Display */}
      {favoriteTools.length > 0 && tab === 'all' && (
        <section className="container mx-auto px-10 md:px-20 pb-56 max-w-[140rem]">
          <div className="flex items-center gap-12 mb-32 border-l-[20px] border-purple-600 pl-20">
            <h3 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter">My Favorites</h3>
          </div>
          <div className="tool-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 md:gap-24">
            {favoriteTools.map(t => <ToolCard key={t.id} tool={t} isFav={true} toggleFav={(e) => toggleFav(t.id, e)} onClick={() => setActiveTool(t)} />)}
          </div>
        </section>
      )}

      {/* Main Grid */}
      <section className="container mx-auto px-10 md:px-20 py-56 border-t-2 border-white/5 max-w-[140rem]">
        <div className="flex flex-col xl:flex-row justify-between items-end mb-48 gap-32">
          <div className="space-y-10 text-center md:text-left w-full xl:w-auto">
            <h3 className="text-8xl md:text-[12rem] font-black uppercase italic tracking-tighter">Command Center</h3>
            <p className="text-[1.1rem] md:text-[1.4rem] text-gray-800 font-black uppercase tracking-[1.2em] italic ml-6">Protocol: {tab.toUpperCase()} • {filtered.length} ENGINES ONLINE</p>
          </div>
          <div className="relative w-full xl:w-[70rem]">
            <i className="fas fa-search absolute left-16 top-1/2 -translate-y-1/2 text-gray-800 text-5xl"></i>
            <input 
              type="text" 
              placeholder="Search 350+ enterprise tools..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/[0.03] border-2 border-white/10 rounded-full py-20 pl-48 pr-20 focus:border-purple-600 outline-none text-4xl md:text-6xl font-black transition-all shadow-inner placeholder:text-gray-950"
            />
          </div>
        </div>
        <div className="tool-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 md:gap-24">
          {filtered.map(t => <ToolCard key={t.id} tool={t} isFav={favorites.includes(t.id)} toggleFav={(e) => toggleFav(t.id, e)} onClick={() => setActiveTool(t)} />)}
        </div>
      </section>

      {/* Auth Modal */}
      {auth !== 'none' && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-black/99 backdrop-blur-6xl animate-in zoom-in duration-700">
          <div className="bg-[#020617] w-full max-w-4xl rounded-[8rem] border-2 border-white/10 p-24 md:p-40 space-y-20 shadow-[0_0_400px_rgba(168,85,247,0.3)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-8 h-full bg-purple-600 shadow-[0_0_80px_rgba(168,85,247,0.8)]"></div>
            <div className="text-center space-y-12">
              <h2 className="text-8xl md:text-[10rem] font-black uppercase italic tracking-tighter">{auth === 'login' ? 'Identify' : 'Join Force'}</h2>
              <p className="text-[1.2rem] text-gray-800 font-black uppercase tracking-[1.2em] italic">Enterprise Identity Sync Required</p>
            </div>
            <form onSubmit={loginUser} className="space-y-20">
              <input type="email" placeholder="PROTOCOL EMAIL" className="w-full bg-black border-2 border-white/10 rounded-[5rem] p-16 focus:border-purple-600 outline-none font-black text-4xl uppercase tracking-widest placeholder:text-gray-950 shadow-4xl" required />
              <input type="password" placeholder="NEURAL PASSKEY" className="w-full bg-black border-2 border-white/10 rounded-[5rem] p-16 focus:border-purple-600 outline-none font-black text-4xl uppercase tracking-widest placeholder:text-gray-950 shadow-4xl" required />
              <button className="w-full bg-purple-600 py-20 rounded-[5rem] font-black uppercase tracking-[0.6em] text-5xl shadow-6xl hover:bg-purple-500 transition-all border-t-8 border-white/20 active:scale-95 violet-glow">INITIALIZE SESSION</button>
            </form>
            <button onClick={() => setAuth('none')} className="w-full text-[1.2rem] font-black text-gray-800 uppercase tracking-widest hover:text-white transition-colors tracking-[0.8em]">Cancel Sync Operation</button>
          </div>
        </div>
      )}

      {activeTool && <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />}

      <footer className="bg-black py-96 border-t-4 border-white/5 text-center mt-auto px-10 md:px-20">
        <div className="container mx-auto max-w-[120rem] space-y-72">
          <div className="flex flex-col md:flex-row justify-between items-center gap-48 text-center md:text-left">
            <div className="space-y-20">
               <div className="flex items-center justify-center md:justify-start gap-12">
                 <div className="w-24 h-24 rounded-[3rem] bg-purple-600 flex items-center justify-center shadow-6xl violet-glow"><i className="fab fa-youtube text-white text-5xl"></i></div>
                 <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">YT & FV PRO</h2>
               </div>
               <p className="text-gray-700 font-black uppercase tracking-[1em] text-[1.2rem] md:text-[1.5rem] italic leading-loose max-w-[80rem]">The World's Largest Neural Super-Suite for Discovery Dominance.<br/>Powered by Project Ultra-Creator v7.0.2.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-24 text-gray-800 text-8xl">
              <i className="fab fa-twitter hover:text-white transition-colors cursor-pointer" />
              <i className="fab fa-discord hover:text-white transition-colors cursor-pointer" />
              <i className="fab fa-instagram hover:text-white transition-colors cursor-pointer" />
              <i className="fab fa-youtube hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
          <div className="pt-72 border-t-4 border-white/5">
             <p className="text-[1.2rem] md:text-[1.5rem] font-black text-gray-950 uppercase tracking-[4em]">PROJECT ULTRA-CREATOR • v7.0.2 • ALL 350+ ENGINES SECURE</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- RENDER ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
