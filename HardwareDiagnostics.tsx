import React, { useState } from 'react';
import { TelemetryData } from '../types';
import { ChevronUp, ChevronDown, AlertTriangle, Thermometer, Fan, Lock, Cpu, MemoryStick } from 'lucide-react';

interface HardwareDiagnosticsProps {
  telemetry: TelemetryData;
  isThrottled: boolean;
  onTogglePreset?: (preset: 'whisper' | 'balanced' | 'overdrive') => void;
}

export const HardwareDiagnostics: React.FC<HardwareDiagnosticsProps> = ({
  telemetry,
  isThrottled,
  onTogglePreset,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<'whisper' | 'balanced' | 'overdrive'>(
    isThrottled ? 'overdrive' : 'balanced'
  );

  const handleSelectPreset = (p: 'whisper' | 'balanced' | 'overdrive') => {
    if (isThrottled && p !== 'overdrive') return; // Locked in emergency override
    setSelectedPreset(p);
    onTogglePreset?.(p);
  };

  return (
    <div
      className={`rounded-xl bg-[#1c1f29]/90 border transition-all duration-300 p-3.5 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${
        isThrottled ? 'border-[#ff5252]/40 shadow-[0_0_20px_rgba(255,82,82,0.15)]' : 'border-white/10'
      }`}
      id="diagnostic-drawer"
    >
      {/* Drawer Header Bar */}
      <div className="flex flex-col gap-1.5 pb-2 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00e5ff] text-[18px] drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
              developer_board
            </span>
            <span className="font-['Space_Grotesk'] text-[13px] text-[#eaecf9] tracking-tight uppercase font-semibold">
              Hardware Diagnostics
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] text-[9px] font-mono font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
              DIAG_STREAM
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label="Collapse diagnostics"
              className="w-6 h-6 rounded bg-[#262a34]/80 hover:bg-[#353943] flex items-center justify-center text-[#bac9cc] transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono">
          <span className="text-[#849396] tracking-wider uppercase">Snapdragon X Elite // Hexagon NPU</span>
          <span className="text-[#7dffa2] font-medium">REV 4.2 • ACTIVE PROFILING</span>
        </div>

        {/* Status Sub-Chips Grid */}
        <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] font-mono">
          <div
            className={`px-2 py-1 rounded flex flex-col gap-0.5 border ${
              isThrottled
                ? 'bg-[#0a0e17]/90 border-[#ff5252]/40 text-[#ffb4ab]'
                : 'bg-[#0a0e17]/90 border-white/5 text-[#dfe2ef]'
            }`}
          >
            <span className="text-[8px] text-[#849396] uppercase truncate">HTP Core</span>
            <span className={`font-semibold truncate ${isThrottled ? 'text-[#ff5252]' : 'text-[#00e5ff]'}`}>
              {isThrottled ? '24.5 TOPS (Throttled)' : '42.8 TOPS (Peak)'}
            </span>
          </div>

          <div className="bg-[#0a0e17]/90 px-2 py-1 rounded flex flex-col gap-0.5 border border-white/5">
            <span className="text-[8px] text-[#849396] uppercase truncate">Memory Bus</span>
            <span className="text-[#00e5ff] font-semibold truncate">8448 MT/s</span>
          </div>

          <div
            className={`px-2 py-1 rounded flex flex-col gap-0.5 border ${
              isThrottled
                ? 'bg-[#ff5252]/20 border-[#ff5252]/60 text-[#ff5252] shadow-[0_0_8px_rgba(255,82,82,0.4)]'
                : 'bg-[#0a0e17]/90 border-white/5 text-[#7dffa2]'
            }`}
          >
            <span className="text-[8px] uppercase truncate text-[#849396]">Thermals</span>
            <span className="font-bold truncate">
              {isThrottled ? '85.2°C CRITICAL' : '48.5°C NOMINAL'}
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Section 1: TOPS Compute Waveform & Engine Breakdown */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className={`w-3.5 h-3.5 ${isThrottled ? 'text-[#ff5252]' : 'text-[#00e5ff]'}`} />
                <span className="font-mono text-[10px] text-[#dfe2ef] tracking-wider uppercase font-semibold">
                  Compute Load (60s Waveform)
                </span>
              </div>
              <div className="flex items-baseline gap-1 font-mono">
                <span
                  className={`text-[14px] font-bold tracking-tight ${
                    isThrottled ? 'text-[#ff5252] drop-shadow-[0_0_8px_rgba(255,82,82,0.7)]' : 'text-[#00e5ff]'
                  }`}
                >
                  {isThrottled ? '24.5' : '38.2'}
                </span>
                <span className="text-[9px] text-[#849396]">(45 TOPS Peak)</span>
                {isThrottled && (
                  <span className="text-[9px] text-[#ff5252] bg-[#ff5252]/20 px-1 rounded ml-1 font-semibold border border-[#ff5252]/40">
                    THROTTLED -45%
                  </span>
                )}
              </div>
            </div>

            {/* SVG Waveform Graphic */}
            <div
              className={`relative h-14 w-full bg-[#0a0e17]/90 rounded-lg p-1.5 overflow-hidden flex flex-col justify-end border ${
                isThrottled ? 'border-[#ff5252]/30' : 'border-[#00e5ff]/20'
              }`}
            >
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 40">
                <defs>
                  <linearGradient id="topsThrottleGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={isThrottled ? '#ff5252' : '#00e5ff'} stopOpacity="0.45" />
                    <stop offset="100%" stopColor={isThrottled ? '#ff5252' : '#00e5ff'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {isThrottled ? (
                  <>
                    <path
                      d="M 0 30 Q 30 28 60 22 T 120 18 T 180 12 T 220 8 L 245 10 L 270 32 L 300 32 L 300 40 L 0 40 Z"
                      fill="url(#topsThrottleGlow)"
                    />
                    <path
                      d="M 0 30 Q 30 28 60 22 T 120 18 T 180 12 T 220 8 L 245 10 L 270 32 L 300 32"
                      fill="none"
                      stroke="#ff5252"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <circle cx="300" cy="32" r="3.5" fill="#ff5252" className="animate-ping" />
                    <circle cx="300" cy="32" r="3" fill="#ff1744" />
                  </>
                ) : (
                  <>
                    <path
                      d="M 0 25 Q 40 18 90 12 T 180 10 T 250 8 L 300 7 L 300 40 L 0 40 Z"
                      fill="url(#topsThrottleGlow)"
                    />
                    <path
                      d="M 0 25 Q 40 18 90 12 T 180 10 T 250 8 L 300 7"
                      fill="none"
                      stroke="#00e5ff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <circle cx="300" cy="7" r="3.5" fill="#00e5ff" className="animate-ping" />
                    <circle cx="300" cy="7" r="3" fill="#00daf3" />
                  </>
                )}
              </svg>

              <div className="flex justify-between items-center text-[8px] font-mono text-[#849396] pt-0.5 px-0.5">
                <span>-60s (Nominal)</span>
                {isThrottled ? (
                  <>
                    <span className="text-[#ff5252]">⚡ T-JUNCTION BREACH</span>
                    <span className="text-[#ff5252] font-semibold">THROTTLE DROP: 24.5 TOPS</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#7dffa2]">STABLE EFFICIENCY ENVELOPE</span>
                    <span className="text-[#00e5ff] font-semibold">4.2W SUSTAINED</span>
                  </>
                )}
              </div>
            </div>

            {/* Sub-Engines: Vector (HTP-HVX), Matrix (HTP-HMX), Scalar */}
            <div className="flex flex-col gap-1.5 pt-0.5 font-mono text-[11px]">
              {/* HVX */}
              <div
                className={`p-1.5 rounded-lg flex flex-col gap-1 border ${
                  isThrottled ? 'bg-[#0a0e17]/70 border-[#ff5252]/20' : 'bg-[#0a0e17]/70 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#dfe2ef] font-medium flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isThrottled ? 'bg-[#ff5252] shadow-[0_0_6px_rgba(255,82,82,0.8)]' : 'bg-[#00e5ff]'
                      }`}
                    ></span>
                    Vector Engine (HTP-HVX)
                  </span>
                  <span className={isThrottled ? 'text-[#ff5252] font-semibold' : 'text-[#00e5ff] font-semibold'}>
                    {isThrottled ? '11.2 TOPS ' : '18.4 TOPS '}
                    <span className="text-[#849396] font-normal text-[9px]">
                      {isThrottled ? '(Clamped -48%)' : '(Active 78%)'}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-[#262a34] h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isThrottled ? 'bg-[#ff5252]' : 'bg-[#00e5ff]'
                    }`}
                    style={{ width: isThrottled ? '48%' : '78%' }}
                  ></div>
                </div>
              </div>

              {/* HMX */}
              <div
                className={`p-1.5 rounded-lg flex flex-col gap-1 border ${
                  isThrottled ? 'bg-[#0a0e17]/70 border-[#ff5252]/20' : 'bg-[#0a0e17]/70 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#dfe2ef] font-medium flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isThrottled ? 'bg-[#ff5252] shadow-[0_0_6px_rgba(255,82,82,0.8)]' : 'bg-[#00daf3]'
                      }`}
                    ></span>
                    Matrix Engine (HTP-HMX)
                  </span>
                  <span className={isThrottled ? 'text-[#ff5252] font-semibold' : 'text-[#00daf3] font-semibold'}>
                    {isThrottled ? '10.1 TOPS ' : '16.8 TOPS '}
                    <span className="text-[#849396] font-normal text-[9px]">
                      {isThrottled ? '(Clamped -46%)' : '(Active 72%)'}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-[#262a34] h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isThrottled ? 'bg-[#ff5252]' : 'bg-[#00daf3]'
                    }`}
                    style={{ width: isThrottled ? '46%' : '72%' }}
                  ></div>
                </div>
              </div>

              {/* Scalar */}
              <div className="bg-[#0a0e17]/70 p-1.5 rounded-lg flex flex-col gap-1 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[#dfe2ef] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c3c6d3]"></span>
                    Scalar Engine (Dispatch)
                  </span>
                  <span className="text-[#00e5ff] font-semibold">
                    {isThrottled ? '3.2 TOPS ' : '3.8 TOPS '}
                    <span className="text-[#849396] font-normal text-[9px]">
                      {isThrottled ? '(Priority throttled)' : '(Nominal)'}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-[#262a34] h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c3c6d3] rounded-full transition-all duration-500"
                    style={{ width: isThrottled ? '62%' : '84%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: LPDDR5x Memory Bandwidth & Allocation Diagnostics */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MemoryStick className="w-3.5 h-3.5 text-[#00daf3]" />
                <span className="text-[10px] text-[#dfe2ef] tracking-wider uppercase font-semibold">
                  LPDDR5x Memory Telemetry
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[14px] text-[#00daf3] font-bold tracking-tight">118.4 GB/s</span>
                <span className="text-[9px] text-[#849396]">(135 GB/s Peak)</span>
                <span className="text-[9px] text-[#00e5ff] bg-[#00e5ff]/10 px-1 rounded ml-1 font-semibold">
                  87.7% Saturation
                </span>
              </div>
            </div>

            {/* Multi-Segment Glowing Saturation Meter */}
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-6 gap-1 h-2 rounded bg-[#0a0e17]/90 p-0.5">
                <div className="h-full rounded-sm bg-[#00e5ff] shadow-[0_0_6px_rgba(0,229,255,0.8)]"></div>
                <div className="h-full rounded-sm bg-[#00e5ff] shadow-[0_0_6px_rgba(0,229,255,0.8)]"></div>
                <div className="h-full rounded-sm bg-[#00daf3] shadow-[0_0_4px_rgba(0,218,243,0.6)]"></div>
                <div className="h-full rounded-sm bg-[#00daf3] shadow-[0_0_4px_rgba(0,218,243,0.6)]"></div>
                <div className="h-full rounded-sm bg-[#262a34]"></div>
                <div className="h-full rounded-sm bg-[#262a34]"></div>
              </div>
              <div className="flex justify-between items-center text-[8px] text-[#849396] px-0.5">
                <span>0 GB/s</span>
                <span>128-bit LPDDR5x @ 8448 MT/s BUS</span>
                <span>135 GB/s Peak</span>
              </div>
            </div>

            {/* Dedicated Memory Buffers Breakdown */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className="bg-[#0a0e17]/80 p-2 rounded-lg flex flex-col justify-between border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-[#849396] uppercase truncate">Weights</span>
                  <Lock className="w-3 h-3 text-[#7dffa2]" />
                </div>
                <div className="mt-1">
                  <span className="font-['Space_Grotesk'] text-[13px] text-[#7dffa2] font-bold">1.85 GB</span>
                  <p className="text-[8px] text-[#849396] truncate">Pinned LPDDR5x</p>
                </div>
              </div>

              <div className="bg-[#0a0e17]/80 p-2 rounded-lg flex flex-col justify-between border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-[#849396] uppercase truncate">KV Cache</span>
                  <span className="material-symbols-outlined text-[12px] text-[#00e5ff]">sync_alt</span>
                </div>
                <div className="mt-1">
                  <span className="font-['Space_Grotesk'] text-[13px] text-[#00e5ff] font-bold">3.42 GB</span>
                  <p className="text-[8px] text-[#849396] truncate">Dynamic alloc</p>
                </div>
              </div>

              <div className="bg-[#0a0e17]/80 p-2 rounded-lg flex flex-col justify-between border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-[#849396] uppercase truncate">Vision DMA</span>
                  <span className="material-symbols-outlined text-[12px] text-[#00daf3]">visibility</span>
                </div>
                <div className="mt-1">
                  <span className="font-['Space_Grotesk'] text-[13px] text-[#00daf3] font-bold">840 MB</span>
                  <p className="text-[8px] text-[#849396] truncate">Zero-copy DMA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Thermal Headroom & Dynamic Fan Profile */}
          <div
            className={`flex flex-col gap-2 pt-2 border-t font-mono ${
              isThrottled ? 'border-[#ff5252]/40' : 'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Thermometer className={`w-3.5 h-3.5 ${isThrottled ? 'text-[#ff5252] animate-pulse' : 'text-[#7dffa2]'}`} />
                <span
                  className={`text-[10px] tracking-wider uppercase font-semibold ${
                    isThrottled ? 'text-[#ff5252]' : 'text-[#dfe2ef]'
                  }`}
                >
                  Thermal Headroom & Throttle State
                </span>
              </div>
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                  isThrottled
                    ? 'bg-[#ff5252]/20 border border-[#ff5252] text-[#ff5252] shadow-[0_0_12px_rgba(255,82,82,0.6)] animate-pulse'
                    : 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30'
                }`}
              >
                {isThrottled ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-[#ff5252]" />
                    CRITICAL: THROTTLE CLAMP ENGAGED (85.2°C)
                  </>
                ) : (
                  <>NOMINAL: +36.5°C HEADROOM (48.5°C)</>
                )}
              </div>
            </div>

            {/* Thermal Bar */}
            <div
              className={`bg-[#0a0e17]/90 p-2 rounded-lg flex flex-col gap-1.5 border ${
                isThrottled ? 'border-[#ff5252]/50 shadow-[0_0_12px_rgba(255,23,68,0.25)]' : 'border-white/5'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span
                    className={`font-['Space_Grotesk'] text-[16px] font-bold tracking-tight ${
                      isThrottled ? 'text-[#ff5252] drop-shadow-[0_0_10px_rgba(255,82,82,0.8)]' : 'text-[#7dffa2]'
                    }`}
                  >
                    {isThrottled ? '85.2°C' : '48.5°C'}
                  </span>
                  <span className={`text-[9px] font-semibold ${isThrottled ? 'text-[#ff5252]' : 'text-[#849396]'}`}>
                    {isThrottled ? '(100% FAN OVERDRIVE • 44.5 dBA)' : '(Fan Quiet 2800 RPM • 21.0 dBA)'}
                  </span>
                </div>
                <span className={`text-[9px] font-semibold ${isThrottled ? 'text-[#ff5252]' : 'text-[#849396]'}`}>
                  85.0°C T-Junction Limit {isThrottled && <span className="font-bold">(EXCEEDED +0.2°C)</span>}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#262a34] h-2.5 rounded-full overflow-hidden p-0.5 relative border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,23,68,0.9)]"
                  style={{
                    width: isThrottled ? '100%' : '52%',
                    background: isThrottled
                      ? 'linear-gradient(90deg, #ff9100 0%, #ff1744 100%)'
                      : 'linear-gradient(90deg, #00e5ff 0%, #00e676 100%)',
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-[8px] text-[#849396] px-0.5">
                <span>30°C Idle</span>
                <span>75°C Warn Threshold</span>
                <span className={isThrottled ? 'text-[#ff5252] font-bold' : ''}>85°C T-Junction Limit</span>
              </div>

              {/* Warning Notice or Margin */}
              <div
                className={`p-1 rounded text-center border ${
                  isThrottled ? 'bg-[#ff5252]/20 border-[#ff5252]/30 text-[#ff5252]' : 'bg-[#00e5ff]/10 border-[#00e5ff]/20 text-[#00e5ff]'
                }`}
              >
                <span className="text-[9px] font-bold tracking-wide">
                  {isThrottled
                    ? '0.0°C Margin • 0% Headroom // DVFS Clamping Clock Frequency -38%'
                    : '+36.5°C Margin • 100% Headroom // DVFS Hexagon HTP High Performance 1.2 GHz'}
                </span>
              </div>

              {/* Temperature breakdown */}
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/10 text-center">
                <div className={`p-1 rounded border ${isThrottled ? 'bg-[#181b25] border-[#ff5252]/30' : 'bg-[#181b25] border-white/5'}`}>
                  <span className="text-[8px] text-[#849396] uppercase">HTP Core</span>
                  <div className={`text-[10px] font-bold ${isThrottled ? 'text-[#ff5252]' : 'text-[#7dffa2]'}`}>
                    {isThrottled ? '85.2°C (OVERHEAT)' : '48.5°C (NOMINAL)'}
                  </div>
                </div>

                <div className="bg-[#181b25] p-1 rounded border border-white/5">
                  <span className="text-[8px] text-[#849396] uppercase">SoC Ambient</span>
                  <div className="text-[10px] font-bold text-amber-300">
                    {isThrottled ? '74.8°C (WARM)' : '42.1°C (NORMAL)'}
                  </div>
                </div>

                <div className="bg-[#181b25] p-1 rounded border border-white/5">
                  <span className="text-[8px] text-[#849396] uppercase">Skin Temp</span>
                  <div className="text-[10px] font-bold text-amber-200">
                    {isThrottled ? '43.6°C (CAUTION)' : '34.2°C (COOL)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Fan Profile & Curve */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Fan className={`w-3.5 h-3.5 ${isThrottled ? 'text-[#ff5252] animate-spin' : 'text-[#00e5ff]'}`} />
                  <span className="text-[10px] text-[#dfe2ef] tracking-wider uppercase font-semibold">
                    Dynamic Fan Profile: {isThrottled ? 'Emergency Max Flow' : 'Acoustic Balanced'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`font-['Space_Grotesk'] text-[13px] font-bold ${isThrottled ? 'text-[#ff5252]' : 'text-[#00e5ff]'}`}>
                    {isThrottled ? '4,850 RPM' : '2,800 RPM'}
                  </span>
                  <span className="text-[9px] text-[#849396]">
                    {isThrottled ? '(100% Duty • 44.5 dBA)' : '(45% Duty • 21.0 dBA)'}
                  </span>
                </div>
              </div>

              {/* Fan Curve Graphic */}
              <div
                className={`relative h-14 w-full bg-[#0a0e17]/90 rounded-lg p-1.5 overflow-hidden flex flex-col justify-end border ${
                  isThrottled ? 'border-[#ff5252]/30' : 'border-[#00e5ff]/20'
                }`}
              >
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 40">
                  <defs>
                    <linearGradient id="fanCurveEmergency" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={isThrottled ? '#ff5252' : '#00e5ff'} stopOpacity="0.45" />
                      <stop offset="100%" stopColor={isThrottled ? '#ff5252' : '#00e5ff'} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={
                      isThrottled
                        ? 'M 0 38 L 80 38 L 120 32 L 180 25 L 240 12 L 300 4 L 300 40 L 0 40 Z'
                        : 'M 0 38 L 100 38 L 160 30 L 220 22 L 300 15 L 300 40 L 0 40 Z'
                    }
                    fill="url(#fanCurveEmergency)"
                  />
                  <path
                    d={
                      isThrottled
                        ? 'M 0 38 L 80 38 L 120 32 L 180 25 L 240 12 L 300 4'
                        : 'M 0 38 L 100 38 L 160 30 L 220 22 L 300 15'
                    }
                    fill="none"
                    stroke={isThrottled ? '#ff5252' : '#00e5ff'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="300"
                    cy={isThrottled ? '4' : '15'}
                    r="4"
                    fill={isThrottled ? '#ff5252' : '#00e5ff'}
                    className="animate-ping"
                  />
                  <circle cx="300" cy={isThrottled ? '4' : '15'} r="3" fill={isThrottled ? '#ff1744' : '#00daf3'} />
                </svg>

                <div className="flex justify-between items-center text-[8px] text-[#849396] pt-0.5 px-0.5">
                  <span>50°C (0 RPM)</span>
                  <span>70°C (2,800 RPM)</span>
                  <span className={isThrottled ? 'text-[#ff5252] font-bold' : 'text-[#00e5ff]'}>
                    {isThrottled ? '85°C APEX (4,850 RPM MAX)' : 'Target 2,800 RPM'}
                  </span>
                </div>
              </div>

              {/* Fan Profile Presets */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-[#849396] uppercase tracking-wider">Fan Profile Preset</span>
                  <span className={isThrottled ? 'text-[#ff5252] font-bold' : 'text-[#7dffa2]'}>
                    {isThrottled ? 'EMERGENCY DISSIPATION // 100% DUTY OVERDRIVE' : 'DYNAMIC ACOUSTIC OPTIMIZATION'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-[#0a0e17] border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('whisper')}
                    disabled={isThrottled}
                    className={`flex flex-col items-start p-1.5 rounded-md text-left transition-all ${
                      isThrottled
                        ? 'bg-[#181b25] opacity-40 cursor-not-allowed'
                        : selectedPreset === 'whisper'
                        ? 'bg-[#00e5ff]/20 border border-[#00e5ff]'
                        : 'bg-[#181b25] hover:bg-[#262a34]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-medium text-[#bac9cc] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#849396]"></span>
                        Whisper
                      </span>
                      <span className="text-[8px] text-[#849396]">Quiet</span>
                    </div>
                    <span className="text-[8px] text-[#849396] mt-0.5 truncate w-full">
                      {isThrottled ? 'Overridden' : '< 18 dBA'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset('balanced')}
                    disabled={isThrottled}
                    className={`flex flex-col items-start p-1.5 rounded-md text-left transition-all ${
                      isThrottled
                        ? 'bg-[#181b25] opacity-40 cursor-not-allowed'
                        : selectedPreset === 'balanced'
                        ? 'bg-[#00e5ff]/20 border border-[#00e5ff]'
                        : 'bg-[#181b25] hover:bg-[#262a34]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-medium text-[#eaecf9] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]"></span>
                        Balanced
                      </span>
                      <span className="text-[8px] text-[#849396]">35W</span>
                    </div>
                    <span className="text-[8px] text-[#849396] mt-0.5 truncate w-full">
                      {isThrottled ? 'Overridden' : '2,800 RPM'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset('overdrive')}
                    className={`flex flex-col items-start p-1.5 rounded-md text-left relative overflow-hidden transition-all ${
                      isThrottled || selectedPreset === 'overdrive'
                        ? 'bg-[#ff5252]/20 border border-[#ff5252] text-[#ff5252] shadow-[0_0_10px_rgba(255,82,82,0.4)]'
                        : 'bg-[#181b25] hover:bg-[#262a34]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-bold text-[#ff5252] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5252] shadow-[0_0_6px_rgba(255,82,82,0.9)] animate-pulse"></span>
                        OVERDRIVE
                      </span>
                      <span className="text-[8px] text-[#ffdad6] bg-[#93000a] px-1 rounded font-bold">
                        {isThrottled ? 'LOCKED' : 'MAX'}
                      </span>
                    </div>
                    <span className="text-[8px] text-[#ffb4ab] mt-0.5 truncate w-full">
                      4,850 RPM • Max Cool
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
