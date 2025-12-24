
import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

// ToolCard component for displaying individual AI tools in the grid
const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-red-600/40 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
  >
    <div className={`absolute top-0 right-0 -mr-10 -mt-10 w-24 h-24 blur-[40px] rounded-full transition-all group-hover:scale-150 ${tool.category === 'fiverr' ? 'bg-green-600/10' : 'bg-red-600/10'}`}></div>
    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-xl transition-all duration-500 ${tool.category === 'fiverr' ? 'group-hover:bg-green-600' : 'group-hover:bg-red-600'}`}>
      <i className={`fas ${tool.icon} text-gray-500 text-xl group-hover:text-white transition-colors`}></i>
    </div>
    <h3 className="text-xl font-black mb-3 group-hover:text-white transition-colors tracking-tighter uppercase italic">{tool.name}</h3>
    <p className="text-gray-600 text-[0.85rem] leading-relaxed mb-8 flex-grow font-medium group-hover:text-gray-400">{tool.description}</p>
    <div className="flex items-center justify-between pt-6 border-t border-white/5">
      <span className="text-[0.6rem] font-black text-gray-700 uppercase tracking-widest">{tool.category}</span>
      <i className="fas fa-arrow-right text-[0.6rem] text-red-500 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all"></i>
    </div>
  </div>
);

export default ToolCard;
