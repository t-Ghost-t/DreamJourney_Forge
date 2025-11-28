
import React, { useState } from 'react';
import { Step } from '../types';
import { Menu, X, Dices, RotateCcw } from 'lucide-react';

interface SidebarProps {
  steps: Step[];
  currentStepIndex: number;
  maxStepReached: number;
  isNSFW: boolean;
  onJumpToStep: (index: number) => void;
  onToggleNSFW: (val: boolean) => void;
  onRandomize: () => void;
  onStartOver: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  steps, 
  currentStepIndex, 
  maxStepReached, 
  isNSFW,
  onJumpToStep, 
  onToggleNSFW,
  onRandomize,
  onStartOver
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStepClick = (index: number) => {
    onJumpToStep(index);
    setIsMobileMenuOpen(false);
  };

  const handleRandomClick = () => {
    onRandomize();
    setIsMobileMenuOpen(false);
  };

  const handleStartOverClick = () => {
    onStartOver();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full md:w-64 bg-[#0d0d0f] border-b md:border-b-0 md:border-r border-[#27272a] flex flex-col flex-shrink-0 relative z-30 md:h-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-[#27272a]/50 md:border-[#27272a] flex items-center justify-between bg-[#0d0d0f] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-900/50">DJ</div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Forge <span className="text-[10px] text-rose-500 border border-rose-900 bg-rose-900/20 px-1.5 rounded ml-1">v6.0</span>
          </h1>
        </div>
        <button 
          className="md:hidden text-zinc-400 hover:text-white p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Content */}
      <div className={`
        ${isMobileMenuOpen ? 'flex' : 'hidden'} 
        md:flex flex-col 
        absolute md:static top-full left-0 w-full 
        h-[calc(100vh-65px)] md:h-auto md:flex-1
        bg-[#0d0d0f]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none
        border-b border-[#27272a] md:border-b-0
        z-50 md:z-auto
        overflow-hidden
      `}>
        <div className="flex-grow p-4 space-y-1 overflow-y-auto min-h-0">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isLocked = index > maxStepReached;
            
            return (
              <button
                key={step.id}
                onClick={() => !isLocked && handleStepClick(index)}
                disabled={isLocked}
                className={`
                  w-full text-left px-4 py-2 rounded-lg mb-1 flex flex-col transition-all duration-200 border-l-2 flex-shrink-0
                  ${isActive 
                    ? 'border-rose-500 bg-gradient-to-r from-rose-500/10 to-transparent' 
                    : 'border-transparent'
                  }
                  ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[#27272a]'}
                `}
              >
                <span className={`text-sm font-bold ${isActive ? 'text-rose-500' : isLocked ? 'text-zinc-600' : 'text-zinc-300'}`}>
                  {step.title}
                </span>
                {step.desc && (
                  <span className={`text-[10px] ${isActive ? 'text-rose-400' : 'text-zinc-500'}`}>
                    {step.desc}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 border-t border-[#27272a] bg-[#09090b]/50 md:bg-[#09090b] flex-shrink-0 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleRandomClick}
              className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors group"
            >
              <Dices size={14} className="group-hover:text-rose-500 transition-colors" />
              RANDOM
            </button>
            <button 
              onClick={handleStartOverClick}
              className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 hover:border-red-900 hover:text-red-400 rounded border border-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center gap-2 transition-all group"
            >
              <RotateCcw size={14} />
              RESET
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold tracking-wider">NSFW MODE</span>
            <div className="relative inline-block align-middle select-none">
              <input 
                type="checkbox" 
                id="nsfwToggle" 
                className="sr-only toggle-checkbox"
                checked={isNSFW}
                onChange={(e) => onToggleNSFW(e.target.checked)}
              />
              <label 
                htmlFor="nsfwToggle" 
                className={`block overflow-hidden h-6 rounded-full bg-zinc-700 cursor-pointer w-12 transition-colors duration-200 ease-in-out ${isNSFW ? 'bg-rose-500' : ''}`}
              >
                <span 
                  className={`block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out mt-1 ml-1 ${isNSFW ? 'translate-x-6' : ''}`} 
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
