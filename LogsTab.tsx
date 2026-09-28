import React, { useState } from 'react';
import { LogMessage } from '../types';
import { Search, Filter, Download, Trash2, Terminal, CheckCircle2, AlertTriangle } from 'lucide-react';

interface LogsTabProps {
  isThrottled: boolean;
}

export const LogsTab: React.FC<LogsTabProps> = ({ isThrottled }) => {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const initialLogs: LogMessage[] = [
    {
      id: '1',
      timestamp: '19:05:10.120',
      tag: 'QNN EP',
      message: 'Qualcomm QNN SDK 2.22 initialized. Loading backend QnnHtp.dll (Hexagon Tensor Processor).',
      level: 'info',
    },
    {
      id: '2',
      timestamp: '19:05:10.450',
      tag: 'QNN EP',
      message: 'Hexagon HTP performance mode set to HIGH_PERFORMANCE. Enable HTP FP16: 1. Graph opt mode: 3.',
      level: 'success',
    },
    {
      id: '3',
      timestamp: '19:05:11.020',
      tag: 'AI Hub',
      message: 'FastViT-S12 INT8 compiled model context bound to Hexagon Vector Engine (HVX).',
      level: 'info',
    },
    {
      id: '4',
      timestamp: '19:05:12.100',
      tag: 'NPU Vision',
      message: 'Interactive UI elements tagged in active viewport (PID 8840). 3 elements localized.',
      highlight: '(11.2ms)',
      level: 'success',
    },
    {
      id: '5',
      timestamp: '19:05:13.240',
      tag: 'Whisper-Tiny',
      message: 'Voice intent "Summarize screen" detected with 98.4% confidence via microphone buffer.',
      level: 'info',
    },
    {
      id: '6',
      timestamp: '19:05:14.050',
      tag: 'Gemma-2B SLM',
      message: 'Context summary generated locally on Hexagon Matrix Engine (HMX). 42 tokens/sec.',
      level: 'success',
    },
    {
      id: '7',
      timestamp: '19:05:15.110',
      tag: 'Low Power State',
      message: 'Offloaded forward execution to Hexagon HTP core. Host CPU in C-State.',
      highlight: '(4.2W)',
      level: 'info',
    },
  ];

  if (isThrottled) {
    initialLogs.push({
      id: '8',
      timestamp: '19:05:18.420',
      tag: 'Thermal Daemon',
      message: 'T-Junction 85°C breached. Hexagon HTP clock clamped to protect silicon (-42% compute throughput).',
      highlight: 'THROTTLED (24.5 TOPS)',
      level: 'warn',
    });
  }

  const filteredLogs = initialLogs.filter((log) => {
    const matchesTag = filterTag === 'all' || log.tag === filterTag;
    const matchesSearch =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 gap-3.5 select-none font-mono">
      {/* Header Banner */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#00e5ff]/20 flex items-center justify-center text-[#00e5ff]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-[#eaecf9]">
              Hexagon NPU Execution Provider Logs
            </h2>
            <p className="text-[11px] text-[#849396]">
              Real-time hardware dispatch, DMA buffer allocation, and DVFS events
            </p>
          </div>
        </div>
        <span className="text-[9px] text-[#7dffa2] bg-[#00e676]/15 border border-[#00e676]/30 px-2 py-0.5 rounded font-semibold">
          STREAM ACTIVE
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#849396]" />
          <input
            type="text"
            placeholder="Search event logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0e17] rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-[#dfe2ef] border border-white/10 focus:border-[#00e5ff] focus:outline-none placeholder-[#849396]"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'NPU Vision', 'Whisper-Tiny', 'Gemma-2B SLM', 'Low Power State', 'Thermal Daemon'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-2 py-1 rounded text-[10px] whitespace-nowrap transition-all border ${
                  filterTag === tag
                    ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff]'
                    : 'bg-[#181b25] border-white/5 text-[#849396] hover:text-[#dfe2ef]'
                }`}
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Log Feed Container */}
      <div className="rounded-xl bg-[#0a0e17] p-3 flex flex-col gap-2 border border-white/10 max-h-[460px] overflow-y-auto">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`p-2 rounded-lg border text-[11px] flex flex-col gap-1 transition-all ${
              log.level === 'warn'
                ? 'bg-[#93000a]/20 border-[#ff5252]/40 text-[#ffb4ab]'
                : log.level === 'success'
                ? 'bg-[#181b25] border-[#00e676]/30 text-[#dfe2ef]'
                : 'bg-[#181b25] border-white/5 text-[#dfe2ef]'
            }`}
          >
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-[#849396]">[{log.timestamp}]</span>
                <span
                  className={`font-semibold px-1.5 py-0.2 rounded text-[9px] ${
                    log.tag === 'Thermal Daemon'
                      ? 'bg-[#ff5252]/20 text-[#ff5252]'
                      : log.tag === 'NPU Vision'
                      ? 'bg-[#00e5ff]/20 text-[#00e5ff]'
                      : log.tag === 'Whisper-Tiny'
                      ? 'bg-[#00daf3]/20 text-[#00daf3]'
                      : log.tag === 'Gemma-2B SLM'
                      ? 'bg-[#00e676]/20 text-[#00e676]'
                      : 'bg-white/10 text-[#dfe2ef]'
                  }`}
                >
                  {log.tag}
                </span>
              </div>
              {log.highlight && (
                <span className="text-[#7dffa2] font-semibold">{log.highlight}</span>
              )}
            </div>
            <p className="font-['Sora'] text-[11px] leading-relaxed pl-1 text-[#dfe2ef]">
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
