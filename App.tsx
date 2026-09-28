import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HudTelemetryTab } from './components/HudTelemetryTab';
import { AccessibilityControlsTab } from './components/AccessibilityControlsTab';
import { NeuralPipelineTab } from './components/NeuralPipelineTab';
import { GeminiChatbotTab } from './components/GeminiChatbotTab';
import { PythonEngineTab } from './components/PythonEngineTab';
import { LogsTab } from './components/LogsTab';
import { FirebaseProfileModal } from './components/FirebaseProfileModal';
import { testFirestoreConnection } from './firebase';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'hud' | 'controls' | 'neural' | 'chatbot' | 'python' | 'logs'>('hud');
  const [isThrottled, setIsThrottled] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Test Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  const handleToggleThermalStress = () => {
    setIsThrottled((prev) => {
      const next = !prev;
      setNotification(
        next
          ? 'Thermal breach simulated: T-Junction reached 85.2°C. Hexagon HTP DVFS clock clamped.'
          : 'Nominal profile restored: 48.5°C operating envelope (11.2ms latency, 45 TOPS peak).'
      );
      return next;
    });
  };

  const handleInjectAction = (text: string) => {
    setNotification(`Action Injected to Host OS: "${text.slice(0, 45)}..."`);
  };

  const handleLoadSession = (synthesizedText: string) => {
    setNotification(`Loaded Session: "${synthesizedText.slice(0, 45)}..."`);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#dfe2ef] font-['Sora'] flex flex-col relative selection:bg-[#00e5ff] selection:text-[#00363d]">
      {/* Top Fixed Header */}
      <Header
        isThrottled={isThrottled}
        onToggleThermalStress={handleToggleThermalStress}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Action Notification Toast */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#1c1f29]/95 border border-[#00e5ff]/50 rounded-xl p-3 shadow-[0_0_20px_rgba(0,229,255,0.3)] backdrop-blur-xl flex items-center justify-between gap-2 animate-fade-in font-mono text-[11px]">
          <div className="flex items-center gap-2 text-[#00e5ff]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#7dffa2]" />
            <span className="text-[#dfe2ef] font-['Sora']">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[#849396] hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Viewport Content Area */}
      <main className="flex-1 w-full pt-16 pb-24 flex flex-col">
        {activeTab === 'hud' && (
          <HudTelemetryTab
            isThrottled={isThrottled}
            onToggleThermalStress={handleToggleThermalStress}
            onInjectAction={handleInjectAction}
            onNavigateToControls={() => setActiveTab('controls')}
          />
        )}

        {activeTab === 'controls' && (
          <AccessibilityControlsTab
            onInjectAction={handleInjectAction}
            isThrottled={isThrottled}
          />
        )}

        {activeTab === 'neural' && <NeuralPipelineTab />}

        {activeTab === 'chatbot' && (
          <GeminiChatbotTab
            onInjectAction={handleInjectAction}
            telemetrySnapshot={{
              latencyMs: isThrottled ? 28.4 : 11.2,
              topsUtilized: isThrottled ? 24.5 : 38.2,
              powerWatts: isThrottled ? 2.8 : 4.2,
              thermalCelsius: isThrottled ? 85.2 : 48.5,
            }}
          />
        )}

        {activeTab === 'python' && <PythonEngineTab />}

        {activeTab === 'logs' && <LogsTab isThrottled={isThrottled} />}
      </main>

      {/* Firebase Profile & Saved Sessions Modal */}
      <FirebaseProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLoadSession={handleLoadSession}
      />

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
      />
    </div>
  );
}

