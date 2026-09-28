import React, { useState } from 'react';
import { Mic, Eye, MousePointer, Volume2, Sparkles, Check, Zap, Layers } from 'lucide-react';

interface AccessibilityControlsTabProps {
  onInjectAction: (text: string) => void;
  isThrottled: boolean;
}

export const AccessibilityControlsTab: React.FC<AccessibilityControlsTabProps> = ({
  onInjectAction,
  isThrottled,
}) => {
  const [activeElementId, setActiveElementId] = useState<number>(1);
  const [selectedVoiceIntent, setSelectedVoiceIntent] = useState<string | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [actionOutput, setActionOutput] = useState(
    'Document contains 3 action items regarding budget approval: 1. Sign off Q3 budget 2. Allocate Snapdragon testbed 3. Submit Unstop deck.'
  );

  const uiElements = [
    {
      id: 1,
      name: 'Active Document Editor (PID: 8840)',
      type: 'Text Area',
      confidence: 0.994,
      bbox: { top: '15%', left: '8%', width: '84%', height: '50%' },
      tag: 'FASTVIT INT8 // FOCUSED',
      action: 'Extract & Synthesize Action Items',
    },
    {
      id: 2,
      name: 'Q3 Budget Approval CTA Button',
      type: 'Interactive Button',
      confidence: 0.982,
      bbox: { top: '72%', left: '55%', width: '37%', height: '14%' },
      tag: 'YOLOV8n // CLICKABLE',
      action: 'Trigger Click Event',
    },
    {
      id: 3,
      name: 'Document Navigation Ribbon',
      type: 'Toolbar',
      confidence: 0.941,
      bbox: { top: '4%', left: '8%', width: '84%', height: '8%' },
      tag: 'ACCESSIBILITY NAV',
      action: 'Enumerate Menu Items',
    },
  ];

  const handleVoiceCommand = (cmd: string) => {
    setSelectedVoiceIntent(cmd);
    setIsProcessingVoice(true);

    setTimeout(() => {
      setIsProcessingVoice(false);
      if (cmd === 'Summarize screen') {
        const text = 'Gemma-2B Local Summary: Budget proposal is awaiting signature for Qualcomm Snapdragon X Elite testbed hardware.';
        setActionOutput(text);
        onInjectAction(text);
      } else if (cmd === 'Read action items') {
        const text = 'Action items identified: 1. Approve 45 TOPS NPU allocation 2. Validate QnnHtp.dll driver 3. Submit pitch.';
        setActionOutput(text);
        onInjectAction(text);
      } else if (cmd === 'Click Submit Button') {
        const text = 'UI Action Dispatched: Simulated mouse click event sent to PID 8840 widget #2 (Coordinates: 1040, 760).';
        setActionOutput(text);
        onInjectAction(text);
      } else {
        const text = `Command "${cmd}" parsed and executed locally on Hexagon HTP.`;
        setActionOutput(text);
        onInjectAction(text);
      }
    }, 450);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 gap-3.5 select-none">
      {/* Tab Header Banner */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#00e5ff]/20 flex items-center justify-center text-[#00e5ff]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-[#eaecf9]">
              Ambient Screen Reticle & Accessibility Hub
            </h2>
            <p className="text-[11px] text-[#849396] font-mono">
              FastViT-S12 INT8 Zero-Copy Screen Tagging • Windows Desktop Duplication API
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] text-[#7dffa2] bg-[#00e676]/15 border border-[#00e676]/30 px-2 py-0.5 rounded font-semibold">
          {isThrottled ? '28.4ms / CLAMPED' : '11.2ms / 60 FPS'}
        </span>
      </div>

      {/* Screen Simulation Canvas Container */}
      <div className="relative w-full aspect-[16/10] bg-[#0a0e17] rounded-xl border border-[#00e5ff]/30 overflow-hidden shadow-[0_0_24px_rgba(0,229,255,0.15)] flex flex-col justify-between p-3">
        {/* Synthetic Desktop UI simulation layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#181b25] to-[#0a0e17] opacity-80 pointer-events-none"></div>

        {/* Top Window Chrome */}
        <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono text-[#849396]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5252]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e676]"></span>
            <span className="text-[#dfe2ef] ml-1 font-semibold">Document_Editor.exe - PID 8840 [Windows 11 ARM64]</span>
          </div>
          <span className="text-[#00e5ff]">FRAMEBUFFER: 1920x1080 @ 60Hz</span>
        </div>

        {/* Dynamic Bounding Boxes detected by FastViT INT8 */}
        <div className="relative flex-1 w-full my-2">
          {uiElements.map((el) => {
            const isActive = activeElementId === el.id;
            return (
              <div
                key={el.id}
                onClick={() => setActiveElementId(el.id)}
                style={{
                  top: el.bbox.top,
                  left: el.bbox.left,
                  width: el.bbox.width,
                  height: el.bbox.height,
                }}
                className={`absolute rounded transition-all cursor-pointer border ${
                  isActive
                    ? 'border-[#00e5ff] bg-[#00e5ff]/15 shadow-[0_0_16px_rgba(0,229,255,0.4)] z-20'
                    : 'border-white/20 bg-white/5 hover:border-[#00e5ff]/60 hover:bg-[#00e5ff]/10 z-10'
                }`}
              >
                {/* Element Tag Overlay */}
                <div className="absolute -top-3.5 left-1 flex items-center gap-1 bg-[#0a0e17] px-1.5 py-0.2 rounded border border-[#00e5ff]/40 text-[9px] font-mono text-[#00e5ff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping"></span>
                  <span>{el.tag}</span>
                  <span className="text-[#7dffa2] font-semibold">{(el.confidence * 100).toFixed(1)}%</span>
                </div>

                {/* Content preview */}
                <div className="p-2 text-[10px] text-[#dfe2ef] h-full flex flex-col justify-between font-mono">
                  <span className="truncate text-white font-medium">{el.name}</span>
                  {isActive && (
                    <div className="flex items-center justify-between text-[9px] text-[#00e5ff]">
                      <span>Action: {el.action}</span>
                      <span className="text-[#7dffa2]">Targeted [Enter]</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Eye Gaze Crosshair Reticle Simulation */}
          <div
            className="absolute z-30 pointer-events-none transition-all duration-300"
            style={{
              top: '40%',
              left: '48%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#00e676] animate-spin"></div>
              <div className="w-3 h-3 rounded-full bg-[#00e676] shadow-[0_0_12px_rgba(5,231,119,0.9)] absolute"></div>
              <div className="absolute -bottom-4 bg-[#0a0e17]/90 px-1.5 py-0.5 rounded text-[8px] font-mono text-[#00e676] whitespace-nowrap border border-[#00e676]/40">
                GAZE 99.4% (x: 920, y: 440)
              </div>
            </div>
          </div>
        </div>

        {/* Reticle guide footer */}
        <div className="relative z-10 flex items-center justify-between pt-1 border-t border-white/10 text-[9px] font-mono text-[#849396]">
          <span>QUALCOMM QNN HTP INGESTION: 840 MB ZERO-COPY DMA</span>
          <span className="text-[#7dffa2]">EYE GAZE & ACCESSIBILITY RETICLE LOCKED</span>
        </div>
      </div>

      {/* Voice Intent Command Simulator */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-[#00daf3]" />
            <span className="font-['Space_Grotesk'] text-[13px] font-semibold text-[#eaecf9]">
              Whisper-Tiny Voice Intent Parsing (On-Device)
            </span>
          </div>
          {isProcessingVoice && (
            <span className="text-[10px] font-mono text-[#00e5ff] animate-pulse">
              Offloading to Hexagon NPU...
            </span>
          )}
        </div>

        {/* Voice Trigger Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            'Summarize screen',
            'Read action items',
            'Click Submit Button',
            'Tag form fields',
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleVoiceCommand(cmd)}
              className={`p-2 rounded-lg text-left font-mono text-[10px] transition-all border ${
                selectedVoiceIntent === cmd
                  ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'bg-[#0a0e17] border-white/10 text-[#bac9cc] hover:border-[#00e5ff]/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1 text-[#00daf3] mb-1">
                <Volume2 className="w-3 h-3" />
                <span className="text-[9px] uppercase">Command</span>
              </div>
              <span className="font-medium">"{cmd}"</span>
            </button>
          ))}
        </div>

        {/* Synthesized Output Display */}
        <div className="bg-[#0a0e17] p-2.5 rounded-lg border border-white/10 flex flex-col gap-1 font-mono text-[11px]">
          <div className="flex items-center justify-between text-[9px] text-[#849396]">
            <span className="flex items-center gap-1 text-[#00e5ff]">
              <Sparkles className="w-3 h-3" />
              Gemma-2B SLM Synthesized Output
            </span>
            <span>INT8 Quantized • 4.2W</span>
          </div>
          <p className="text-[#dfe2ef] font-['Sora'] text-[12px] leading-relaxed">
            "{actionOutput}"
          </p>
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onInjectAction(actionOutput)}
              className="px-3 py-1 rounded bg-[#00e5ff] hover:bg-[#9cf0ff] text-[#00363d] font-bold text-[10px] flex items-center gap-1 transition-all shadow-[0_0_8px_rgba(0,229,255,0.4)] cursor-pointer"
            >
              <span>Inject into Active Application</span>
              <Zap className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
