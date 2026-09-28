import React, { useState } from 'react';
import { BACKEND_ENGINE_PYTHON_CODE } from '../data/pythonCode';
import { Download, Copy, Check, Play, Terminal, FileCode, Cpu, ShieldCheck } from 'lucide-react';

export const PythonEngineTab: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [cliOutput, setCliOutput] = useState<string[]>([]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(BACKEND_ENGINE_PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([BACKEND_ENGINE_PYTHON_CODE], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backend_engine.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunTest = () => {
    setIsRunningTest(true);
    setCliOutput([
      '>>> python3 backend_engine.py --cli',
      '19:05:10 [INFO] [MainThread] Initializing NPUEngine...',
      '19:05:10 [INFO] [MainThread] Detected provider: QNNExecutionProvider [Snapdragon X Elite Hexagon NPU]',
      '19:05:10 [INFO] [MainThread] Configured QnnHtp.dll with htp_performance_mode: high_performance, fp16: True',
      '19:05:10 [INFO] [MainThread] InferenceWorker background pipeline started.',
    ]);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      const timeStr = new Date().toTimeString().split(' ')[0];
      const lat = (10.9 + Math.random() * 0.7).toFixed(1);
      const fps = Math.floor(88 + Math.random() * 4);
      const line = ` [${timeStr}] NPU: ${lat}ms | FPS: ${fps} | HTP Power: 4.2W | TOPS: 24.5/45 | Temp: 48.2°C | Detections: 3`;

      setCliOutput((prev) => [...prev, line]);

      if (count >= 8) {
        clearInterval(interval);
        setCliOutput((prev) => [
          ...prev,
          '19:05:15 [INFO] [MainThread] InferenceWorker terminated.',
          '✓ Telemetry test run completed cleanly. Emitted 8 cycle events on Hexagon HTP.',
        ]);
        setIsRunningTest(false);
      }
    }, 450);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 gap-3.5 select-none">
      {/* Header Banner */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#00e5ff]/20 flex items-center justify-center text-[#00e5ff] shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-[#eaecf9]">
              backend_engine.py Studio
            </h2>
            <p className="text-[11px] text-[#849396] font-mono">
              Production-Grade Python Architecture for Snapdragon® X-Series PCs
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-[#262a34] hover:bg-[#353943] text-[#00e5ff] font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00e676]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-[#00e5ff] hover:bg-[#9cf0ff] text-[#00363d] font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,229,255,0.4)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .py</span>
          </button>
        </div>
      </div>

      {/* Technical Architecture Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono">
        <div className="bg-[#181b25] p-2.5 rounded-lg border border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[#00e5ff] font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>QnnHtp.dll Offloading</span>
          </div>
          <p className="text-[#849396] font-['Sora'] leading-tight">
            Targeting Qualcomm Hexagon Tensor Processor with HTP high-performance burst mode and FP16/INT8 precision.
          </p>
        </div>

        <div className="bg-[#181b25] p-2.5 rounded-lg border border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[#7dffa2] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CPU Fallback Protection</span>
          </div>
          <p className="text-[#849396] font-['Sora'] leading-tight">
            Gracefully degrades to CPUExecutionProvider when run on development machines without crashing the application.
          </p>
        </div>

        <div className="bg-[#181b25] p-2.5 rounded-lg border border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[#00daf3] font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>PyQt6 / CLI Dual-Mode</span>
          </div>
          <p className="text-[#849396] font-['Sora'] leading-tight">
            Runs as a native acrylic dark overlay with Qt signals or directly in ANSI CLI mode for headless testing.
          </p>
        </div>
      </div>

      {/* Interactive CLI Test Runner Box */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-[#00e5ff]" />
            <span className="font-['Space_Grotesk'] text-[13px] font-semibold text-[#eaecf9]">
              In-Browser Python Pipeline Simulation
            </span>
          </div>
          <button
            onClick={handleRunTest}
            disabled={isRunningTest}
            className={`px-3 py-1 rounded font-mono text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isRunningTest
                ? 'bg-[#262a34] text-[#849396] cursor-not-allowed'
                : 'bg-[#00e676] text-[#003918] hover:bg-[#62ff96] shadow-[0_0_10px_rgba(5,231,119,0.5)]'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>{isRunningTest ? 'Executing...' : 'Run Test (CLI Stream)'}</span>
          </button>
        </div>

        {/* Console view */}
        <div className="bg-[#0a0e17] rounded-lg p-2.5 h-36 overflow-y-auto font-mono text-[10px] text-[#dfe2ef] border border-white/5 flex flex-col gap-1">
          {cliOutput.length === 0 ? (
            <div className="text-[#849396] italic py-2 text-center">
              Click "Run Test" to simulate invoking <code className="text-[#00e5ff]">backend_engine.py --cli</code> on Snapdragon X Elite.
            </div>
          ) : (
            cliOutput.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.startsWith('>>>')
                    ? 'text-[#00e5ff] font-bold'
                    : line.includes('NPU:')
                    ? 'text-[#7dffa2]'
                    : line.includes('completed')
                    ? 'text-[#00e676] font-bold'
                    : 'text-[#849396]'
                }
              >
                {line}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex flex-col gap-2 font-mono">
        <div className="flex items-center justify-between text-[11px] text-[#849396]">
          <span>SOURCE FILE: /backend_engine.py (Python 3.10+)</span>
          <span className="text-[#7dffa2]">STANDALONE • NO SYNTAX ERRORS</span>
        </div>

        {/* Code Snippet Scroll Area */}
        <div className="relative w-full bg-[#0a0e17] rounded-lg p-3 max-h-96 overflow-y-auto border border-white/5 text-[11px] text-[#bac9cc] leading-relaxed selection:bg-[#00e5ff]/30">
          <pre className="whitespace-pre overflow-x-auto font-mono">{BACKEND_ENGINE_PYTHON_CODE}</pre>
        </div>
      </div>
    </div>
  );
};
