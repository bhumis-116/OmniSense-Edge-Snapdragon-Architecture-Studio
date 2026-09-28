import React, { useState, useEffect } from 'react';
import { TelemetryData, LogMessage } from '../types';
import { HardwareDiagnostics } from './HardwareDiagnostics';
import { PauseCircle, Play, Check, CornerDownLeft } from 'lucide-react';

interface HudTelemetryTabProps {
  isThrottled: boolean;
  onToggleThermalStress: () => void;
  onInjectAction: (actionText: string) => void;
  onNavigateToControls?: () => void;
}

export const HudTelemetryTab: React.FC<HudTelemetryTabProps> = ({
  isThrottled,
  onToggleThermalStress,
  onInjectAction,
  onNavigateToControls,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [latencyVal, setLatencyVal] = useState(isThrottled ? 28.4 : 11.2);
  const [fpsVal, setFpsVal] = useState(isThrottled ? 48 : 89);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  const [injectedSuccess, setInjectedSuccess] = useState(false);

  // Realistic micro-jitter effect for live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        if (isThrottled) {
          setLatencyVal(parseFloat((27.8 + Math.random() * 1.4).toFixed(1)));
          setFpsVal(Math.floor(46 + Math.random() * 5));
        } else {
          setLatencyVal(parseFloat((10.9 + Math.random() * 0.6).toFixed(1)));
          setFpsVal(Math.floor(88 + Math.random() * 4));
        }
      }
    }, 1600);

    return () => clearInterval(interval);
  }, [isPaused, isThrottled]);

  // Sync latency/fps default when throttle state changes
  useEffect(() => {
    setLatencyVal(isThrottled ? 28.4 : 11.2);
    setFpsVal(isThrottled ? 48 : 89);
  }, [isThrottled]);

  const handleInject = () => {
    onInjectAction('Document contains 3 action items regarding budget approval: 1. Sign off Q3 budget 2. Allocate Snapdragon testbed 3. Submit Unstop deck.');
    setInjectedSuccess(true);
    setTimeout(() => setInjectedSuccess(false), 2200);
  };

  const telemetryState: TelemetryData = {
    timestamp: '19:05:15',
    latencyMs: latencyVal,
    fps: fpsVal,
    computeLoadPct: isThrottled ? 54.4 : 15.0,
    topsUtilized: isThrottled ? 24.5 : 38.2,
    peakTops: 45.0,
    powerWatts: isThrottled ? 2.8 : 4.2,
    thermalCelsius: isThrottled ? 85.2 : 48.5,
    isThrottled,
    activeProvider: isThrottled
      ? 'QNNExecutionProvider [DVFS Throttled 680MHz]'
      : 'QNNExecutionProvider [Hexagon HTP High Performance 1.2GHz]',
    npuActive: !isPaused,
    focusedElement: 'Active Document Editor (PID: 8840)',
    eyeGazePct: 99.4,
    vectorEngineTops: isThrottled ? 11.2 : 18.4,
    matrixEngineTops: isThrottled ? 10.1 : 16.8,
    scalarEngineTops: isThrottled ? 3.2 : 3.8,
    memoryBandwidthGbps: 118.4,
    memorySaturationPct: 87.7,
    weightsMemoryGb: 1.85,
    kvCacheGb: 3.42,
    visionDmaMb: 840,
    fanRpm: isThrottled ? 4850 : 2800,
    fanDutyPct: isThrottled ? 100 : 45,
    fanDba: isThrottled ? 44.5 : 21.0,
    fanPreset: isThrottled ? 'overdrive' : 'balanced',
    synthesizedOutput: 'Document contains 3 action items regarding budget approval...',
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 gap-3 relative select-none">
      {/* Desktop Ambient Canvas Simulation Background */}
      <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-[#00e5ff]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#00e676]/10 blur-3xl pointer-events-none"></div>

      {/* Floating HUD Window Core Container */}
      <div
        className={`relative w-full rounded-xl bg-[#0a0e17]/90 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,229,255,0.18),0_20px_50px_rgba(0,0,0,0.85)] border border-white/10 flex flex-col p-3 sm:p-4 gap-3 transition-all duration-300 ${
          isMinimized ? 'opacity-60 scale-[0.99]' : ''
        }`}
        id="hud-window"
      >
        {/* Reticle Spatial Guide (Decorative Corner Tech Marks) */}
        <div className="absolute top-2 left-2 text-[8px] font-mono text-[#849396] tracking-tighter opacity-60">
          HUD//SNPR-8CX
        </div>
        <div className="absolute top-2 right-12 text-[8px] font-mono text-[#849396] tracking-tighter opacity-60">
          WIN11_ARM64
        </div>
        <div className="absolute bottom-2 left-2 text-[8px] font-mono text-[#849396] tracking-tighter opacity-40">
          CALIB: NOMINAL
        </div>
        <div className="absolute bottom-2 right-2 text-[8px] font-mono text-[#849396] tracking-tighter opacity-40">
          NODE_0x7FE
        </div>

        {/* HUD Header Bar with Acrylic Window Controls */}
        <div className="flex items-center justify-between pt-1 pb-1">
          {/* Title & Live NPU Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00e5ff] text-[20px] drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
                visibility
              </span>
              <span className="font-['Space_Grotesk'] text-[16px] sm:text-[18px] font-bold text-[#eaecf9] tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                OmniSense Edge HUD
              </span>
            </div>

            {/* Pulsing Chip: Emerald (Active) or Red (Throttled) */}
            {isThrottled ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff5252]/15 text-[#ff5252] border border-[#ff5252]/40 shadow-[0_0_10px_rgba(255,82,82,0.35)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5252] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5252] shadow-[0_0_6px_rgba(255,82,82,0.9)]"></span>
                </span>
                <span className="font-mono text-[9px] font-bold tracking-wider uppercase">NPU THROTTLED (85°C)</span>
              </div>
            ) : isPaused ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ffb4ab]/10 text-[#ffb4ab] border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                <span className="font-mono text-[9px] font-semibold tracking-wider">PAUSED</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00e676]/15 text-[#00e676] shadow-[0_0_10px_rgba(5,231,119,0.35)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e676] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e676] shadow-[0_0_6px_rgba(5,231,119,0.9)]"></span>
                </span>
                <span className="font-mono text-[9px] text-[#00e676] tracking-wider font-semibold">NPU ACTIVE</span>
              </div>
            )}
          </div>

          {/* Acrylic Windows-Style Close Action */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label="Minimize HUD"
              className="w-7 h-7 rounded-lg bg-[#262a34]/60 hover:bg-[#353943] flex items-center justify-center text-[#bac9cc] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">horizontal_rule</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('hud-window');
                if (el) {
                  el.style.opacity = '0.35';
                  el.style.transform = 'scale(0.97)';
                  setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1)';
                  }, 400);
                }
              }}
              aria-label="Close HUD"
              className="w-7 h-7 rounded-lg bg-[#262a34]/60 hover:bg-[#93000a] hover:text-[#ffdad6] flex items-center justify-center text-[#bac9cc] transition-colors group"
            >
              <span className="material-symbols-outlined text-[16px] group-hover:text-[#ffb4ab]">close</span>
            </button>
          </div>
        </div>

        {/* Active Gaze / Focus Crosshair Status Strip */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#181b25]/80 border border-white/5">
          <div className="flex items-center gap-2 truncate">
            <span className="material-symbols-outlined text-[#00e5ff] text-[15px] animate-pulse shrink-0">
              center_focus_strong
            </span>
            <span className="font-mono text-[10px] text-[#bac9cc] tracking-wide shrink-0">FOCUSED ELEMENT:</span>
            <span className="font-mono text-[10px] text-[#00e5ff] font-medium tracking-tight truncate">
              Active Document Editor (PID: 8840)
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#00e676] bg-[#00e676]/15 border border-[#00e676]/30 px-1.5 py-0.5 rounded font-semibold shrink-0">
            EYE GAZE 99.4%
          </span>
        </div>

        {/* Telemetry & Performance Dashboard Card */}
        <div className="rounded-xl bg-[#1c1f29]/85 p-3 flex flex-col gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)] border border-white/5">
          {/* Upper Metrics Dual Column */}
          <div className="grid grid-cols-2 gap-2">
            {/* Latency Telemetry Tile */}
            <div
              className={`rounded-lg bg-[#0a0e17]/80 p-2.5 flex flex-col justify-between relative overflow-hidden border ${
                isThrottled ? 'border-[#ff5252]/40 shadow-[0_0_10px_rgba(255,82,82,0.2)]' : 'border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-[10px] tracking-wider uppercase flex items-center gap-1 ${
                    isThrottled ? 'text-[#ff5252]' : 'text-[#bac9cc]'
                  }`}
                >
                  {isThrottled && <span className="w-1.5 h-1.5 rounded-full bg-[#ff5252] animate-pulse"></span>}
                  NPU Latency {isThrottled ? '(Throttled)' : ''}
                </span>
                <span
                  className={`material-symbols-outlined text-[14px] ${isThrottled ? 'text-[#ff5252]' : 'text-[#00e5ff]'}`}
                >
                  {isThrottled ? 'warning' : 'bolt'}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-1 font-mono">
                <span
                  className={`font-['Space_Grotesk'] text-[24px] sm:text-[26px] font-bold tracking-tighter ${
                    isThrottled
                      ? 'text-[#ff5252] drop-shadow-[0_0_10px_rgba(255,82,82,0.6)]'
                      : 'text-[#00e5ff] drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]'
                  }`}
                  id="latency-val"
                >
                  {latencyVal.toFixed(1)}
                </span>
                <span className={`text-[11px] ${isThrottled ? 'text-[#ff5252]' : 'text-[#00e5ff]'}`}>ms</span>
                {isThrottled && <span className="text-[9px] text-[#849396] ml-1">(+154%)</span>}
              </div>
              <div className="w-full bg-[#262a34] h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isThrottled
                      ? 'bg-[#ff5252] w-[88%] shadow-[0_0_8px_rgba(255,82,82,0.8)]'
                      : 'bg-[#00e5ff] w-[28%] shadow-[0_0_8px_rgba(0,229,255,0.8)]'
                  }`}
                ></div>
              </div>
            </div>

            {/* FPS Telemetry Tile */}
            <div
              className={`rounded-lg bg-[#0a0e17]/80 p-2.5 flex flex-col justify-between relative overflow-hidden border ${
                isThrottled ? 'border-[#ff5252]/20' : 'border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#bac9cc] tracking-wider uppercase">Overlay FPS</span>
                <span className="material-symbols-outlined text-[#00daf3] text-[14px]">speed</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1 font-mono">
                <span
                  className={`font-['Space_Grotesk'] text-[24px] sm:text-[26px] font-bold tracking-tighter ${
                    isThrottled ? 'text-[#dfe2ef]' : 'text-[#00daf3] drop-shadow-[0_0_10px_rgba(0,218,243,0.5)]'
                  }`}
                  id="fps-val"
                >
                  {fpsVal}
                </span>
                <span className="text-[11px] text-[#00daf3]">fps</span>
                {isThrottled && <span className="text-[9px] text-[#ff5252] ml-1">-46% DROP</span>}
              </div>
              <div className="w-full bg-[#262a34] h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isThrottled ? 'bg-[#849396] w-[40%]' : 'bg-[#00daf3] w-[74%] shadow-[0_0_8px_rgba(0,218,243,0.7)]'
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Compute Load Progress Meter */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span
                className={`tracking-wide flex items-center gap-1.5 ${
                  isThrottled ? 'text-[#ff5252] font-semibold' : 'text-[#dfe2ef]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isThrottled ? 'bg-[#ff5252] shadow-[0_0_6px_rgba(255,82,82,0.9)] animate-ping' : 'bg-[#00e5ff]'
                  }`}
                ></span>
                {isThrottled ? 'Hexagon NPU: DVFS THROTTLE CLAMP' : 'Hexagon NPU Compute: Low'}
              </span>
              <span
                className={`font-semibold tracking-wider ${
                  isThrottled
                    ? 'text-[#ff5252] font-bold drop-shadow-[0_0_8px_rgba(255,82,82,0.8)]'
                    : 'text-[#00e5ff]'
                }`}
              >
                {isThrottled ? '24.5 TOPS (54.4%)' : '15%'}
              </span>
            </div>

            {/* Track & Glow Bar */}
            <div
              className={`w-full h-2.5 rounded-full bg-[#0a0e17] p-0.5 overflow-hidden border ${
                isThrottled ? 'border-[#ff5252]/30' : 'border-white/5'
              }`}
            >
              <div
                className="h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,229,255,0.85)]"
                style={{
                  width: isThrottled ? '54.4%' : '15%',
                  background: isThrottled
                    ? 'linear-gradient(90deg, #ff9100, #ff1744)'
                    : 'linear-gradient(90deg, #00e5ff, #00daf3)',
                }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-[#849396] px-0.5 pt-0.5">
              <span>0 TOPS</span>
              <span className={isThrottled ? 'text-[#ff5252] font-medium' : ''}>
                {isThrottled
                  ? 'DVFS FREQ THROTTLED 680 MHz (was 1.2 GHz)'
                  : 'EFFICIENCY ENVELOPE (45 TOPS PEAK)'}
              </span>
              <span className={isThrottled ? 'line-through text-[#849396]' : ''}>45 TOPS</span>
            </div>
          </div>
        </div>

        {/* Expandable Hardware Diagnostics Drawer (Image 3) */}
        {showDiagnostics && (
          <HardwareDiagnostics
            telemetry={telemetryState}
            isThrottled={isThrottled}
            onTogglePreset={(p) => {
              if (p === 'overdrive') onToggleThermalStress();
            }}
          />
        )}

        {/* Live Context Feed (Terminal Container) */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]"></span>
              </span>
              <span className="font-mono text-[11px] text-[#eaecf9] tracking-widest uppercase font-semibold">
                Live Context Feed
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#849396]">STREAM_ACTIVE</span>
          </div>

          {/* Terminal Log Console Box */}
          <div className="rounded-xl bg-[#0a0e17] p-2.5 flex flex-col gap-1.5 shadow-inner font-mono text-[11px] border border-white/5">
            {/* Log Line 1 */}
            <div className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#849396] shrink-0">[19:05:12]</span>
              <span className="text-[#00e5ff] font-medium shrink-0">NPU Vision:</span>
              <span className="text-[#dfe2ef] break-words">
                Interactive UI elements tagged <span className="text-[#7dffa2] font-medium">(11.2ms)</span>
              </span>
            </div>

            {/* Log Line 2 */}
            <div className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#849396] shrink-0">[19:05:13]</span>
              <span className="text-[#00daf3] font-medium shrink-0">Whisper-Tiny:</span>
              <span className="text-[#dfe2ef] break-words">
                Voice intent{' '}
                <span className="text-[#eaecf9] bg-[#262a34] px-1 py-0.5 rounded text-[10px]">
                  'Summarize screen'
                </span>{' '}
                detected
              </span>
            </div>

            {/* Log Line 3 */}
            <div className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#849396] shrink-0">[19:05:14]</span>
              <span className="text-[#7dffa2] font-medium shrink-0">Gemma-2B SLM:</span>
              <span className="text-[#dfe2ef] break-words">Context summary generated locally</span>
            </div>

            {/* Log Line 4 */}
            <div className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#849396] shrink-0">[19:05:15]</span>
              <span className="text-[#00e5ff] font-medium shrink-0">Low Power State:</span>
              <span className="text-[#dfe2ef] break-words">
                Offloaded to Hexagon HTP <span className="text-[#7dffa2] font-semibold">(4.2W)</span>
              </span>
            </div>

            {/* Conditional Thermal Daemon Warning Log (shown when throttled, per Image 3) */}
            {isThrottled && (
              <div className="flex items-start gap-2 leading-relaxed bg-[#93000a]/20 p-1.5 rounded border border-[#ff5252]/40 text-[#ffb4ab]">
                <span className="text-[#ff5252] font-medium shrink-0">[19:05:18]</span>
                <span className="text-[#ff5252] font-bold shrink-0 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">warning</span>
                  Thermal Daemon:
                </span>
                <span className="text-[#ffb4ab] font-medium break-words">
                  T-Junction 85°C breached. Hexagon HTP clock clamped to protect silicon{' '}
                  <span className="font-bold drop-shadow-[0_0_6px_rgba(255,82,82,0.8)] text-[#ff5252]">
                    (-42% compute throughput)
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Active Inferred Intent Interactive Micro-Widget */}
        <div className="rounded-lg bg-[#262a34]/60 p-2.5 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#00e5ff] text-[18px]">auto_read_pause</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[9px] text-[#849396] uppercase tracking-wider">
                Synthesized Output Ready
              </span>
              <span className="text-[11px] text-[#dfe2ef] truncate font-['Sora']">
                "Document contains 3 action items regarding budget approval..."
              </span>
            </div>
          </div>
          <button
            onClick={handleInject}
            className={`shrink-0 px-2.5 py-1 rounded font-mono text-[10px] transition-all flex items-center gap-1 cursor-pointer ${
              injectedSuccess
                ? 'bg-[#00e676] text-[#003918] font-bold shadow-[0_0_8px_rgba(5,231,119,0.8)]'
                : 'bg-[#31353f] hover:bg-[#353943] text-[#00e5ff]'
            }`}
          >
            {injectedSuccess ? (
              <>
                <span>Injected!</span>
                <Check className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>Inject</span>
                <CornerDownLeft className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-col gap-1.5 pt-1">
          {/* Full-Width Primary CTA Button: Pause Assistance */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`w-full py-3 px-4 rounded-xl font-['Space_Grotesk'] text-[15px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isPaused
                ? 'bg-[#31353f] text-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.2)] hover:bg-[#353943]'
                : 'bg-[#00e5ff] text-[#00363d] shadow-[0_0_20px_rgba(0,229,255,0.45)] hover:shadow-[0_0_28px_rgba(0,229,255,0.7)] hover:bg-[#9cf0ff] active:scale-[0.99]'
            }`}
            id="toggle-assist-btn"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <PauseCircle className="w-5 h-5" />}
            <span className="tracking-tight">{isPaused ? 'Resume Assistance' : 'Pause Assistance'}</span>
          </button>

          {/* Qualcomm Hexagon NPU Hardware Attestation Footer */}
          <div className="flex items-center justify-center gap-1.5 py-1 text-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] shadow-[0_0_6px_rgba(5,231,119,0.8)]"></span>
            <p className="font-mono text-[9px] text-[#849396] tracking-wider">
              100% On-Device • Qualcomm Hexagon NPU Accelerated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
