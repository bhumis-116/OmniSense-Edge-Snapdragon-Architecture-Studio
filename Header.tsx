import React, { useState, useEffect } from 'react';
import { Sliders, Flame, Cpu, User as UserIcon } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface HeaderProps {
  isThrottled: boolean;
  onToggleThermalStress: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isThrottled,
  onToggleThermalStress,
  onOpenProfile,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#0a0e17]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.6)] border-b border-white/5">
      <div className="max-w-2xl mx-auto h-14 px-4 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isThrottled ? 'bg-[#ff5252]' : 'bg-[#00e676]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 shadow-[0_0_8px_rgba(5,231,119,0.8)] ${
                isThrottled ? 'bg-[#ff5252] shadow-[0_0_8px_rgba(255,82,82,0.8)]' : 'bg-[#00e676]'
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-mono text-[9px] tracking-widest uppercase font-semibold ${
                isThrottled ? 'text-[#ffb4ab]' : 'text-[#7dffa2]'
              }`}
            >
              Snapdragon NPU // 45 TOPS {isThrottled ? '(CLAMPED)' : ''}
            </span>
            <h1 className="font-['Space_Grotesk'] text-[17px] font-semibold text-[#00e5ff] tracking-tight leading-tight">
              Hud Telemetry
            </h1>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Thermal Stress Simulation Toggle Button */}
          <button
            onClick={onToggleThermalStress}
            title={isThrottled ? 'Switch to Nominal State (48°C / 11ms)' : 'Simulate 85°C Thermal Breach (Image 3 mode)'}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium flex items-center gap-1.5 transition-all border ${
              isThrottled
                ? 'bg-[#ff5252]/20 text-[#ffb4ab] border-[#ff5252]/60 shadow-[0_0_10px_rgba(255,82,82,0.4)] animate-pulse'
                : 'bg-[#1c1f29] text-[#bac9cc] border-white/10 hover:text-[#00e5ff] hover:border-[#00e5ff]/40'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${isThrottled ? 'text-[#ff5252]' : 'text-amber-400'}`} />
            <span>{isThrottled ? '85.2°C CLAMP' : 'Nominal 48°C'}</span>
          </button>

          {/* User Profile / Firebase Auth Button */}
          <button
            onClick={onOpenProfile}
            title={currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Sign in with Google'}
            className="w-8 h-8 rounded-full bg-[#00e5ff] flex items-center justify-center text-[#00363d] shadow-[0_0_10px_rgba(0,229,255,0.4)] cursor-pointer hover:scale-105 transition-all overflow-hidden border border-[#00e5ff]"
          >
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[18px]">person</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

