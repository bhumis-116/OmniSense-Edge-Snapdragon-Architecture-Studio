import React from 'react';
import { Cpu, Accessibility, Network, Terminal, Code2, Bot } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'hud',
      label: 'HUD',
      icon: Cpu,
    },
    {
      id: 'controls',
      label: 'Controls',
      icon: Accessibility,
    },
    {
      id: 'neural',
      label: 'Neural',
      icon: Network,
    },
    {
      id: 'chatbot',
      label: 'Gemini',
      icon: Bot,
    },
    {
      id: 'python',
      label: 'Python',
      icon: Code2,
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: Terminal,
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#0a0e17]/95 backdrop-blur-xl border-t border-white/5 shadow-[0_-2px_12px_rgba(0,0,0,0.6)]">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1 flex flex-col items-center justify-center transition-all gap-1 cursor-pointer ${
                isActive
                  ? 'text-[#00e5ff] scale-105 font-semibold'
                  : 'text-[#849396] hover:text-[#dfe2ef]'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-[#00e5ff]/15 shadow-[0_0_10px_rgba(0,229,255,0.4)]' : ''
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-mono text-[9px] sm:text-[10px] tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

