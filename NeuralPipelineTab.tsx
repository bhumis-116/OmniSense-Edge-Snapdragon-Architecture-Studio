import React, { useState } from 'react';
import { QUALCOMM_AI_HUB_MODELS } from '../data/models';
import { AIHubModel } from '../types';
import { Cpu, CheckCircle2, ArrowRight, Zap, ShieldCheck, Activity, Terminal } from 'lucide-react';

export const NeuralPipelineTab: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<AIHubModel>(QUALCOMM_AI_HUB_MODELS[0]);
  const [compilingStep, setCompilingStep] = useState<number>(4);

  const pipelineSteps = [
    {
      step: 1,
      title: 'Model Ingestion',
      desc: 'PyTorch / TorchScript source model with dynamic shapes uploaded to Qualcomm AI Hub.',
      detail: 'hub.upload_model(model)',
    },
    {
      step: 2,
      title: 'AIMET Quantization',
      desc: 'Calibration for INT8 weights & activations targeting Hexagon Tensor Processor hardware.',
      detail: '--quantization int8 --calibrate_dataset',
    },
    {
      step: 3,
      title: 'Qualcomm AI Hub Compilation',
      desc: 'Graph fusion and operator scheduling compiled for Snapdragon X Elite (SoC Model 60).',
      detail: 'hub.submit_compile_job(device="Snapdragon X Elite")',
    },
    {
      step: 4,
      title: 'QNN Execution Provider Offload',
      desc: 'Direct binary dispatch to Hexagon HTP (QnnHtp.dll) without host CPU context switching.',
      detail: 'ort.InferenceSession(providers=["QNNExecutionProvider"])',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 gap-3.5 select-none">
      {/* Overview Banner */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#00e5ff]/20 flex items-center justify-center text-[#00e5ff]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-[#eaecf9]">
              Qualcomm® AI Hub Neural Pipeline
            </h2>
            <p className="text-[11px] text-[#849396] font-mono">
              PyTorch → Qualcomm AI Hub Compiler → Snapdragon X Elite Hexagon NPU
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] text-[#7dffa2] bg-[#00e676]/15 border border-[#00e676]/30 px-2 py-0.5 rounded font-semibold">
          45 TOPS ENVELOPE
        </span>
      </div>

      {/* Model Selection Selector */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] text-[#bac9cc] uppercase tracking-wider">
          Target Accessibility Models in Pipeline
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUALCOMM_AI_HUB_MODELS.map((m) => {
            const isSelected = selectedModel.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m)}
                className={`p-2.5 rounded-lg text-left transition-all border font-mono ${
                  isSelected
                    ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : 'bg-[#181b25] border-white/10 text-[#bac9cc] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase font-bold text-[#7dffa2]">{m.precision}</span>
                  <span className="text-[9px] text-[#849396]">{m.type}</span>
                </div>
                <div className="text-[11px] font-semibold text-white truncate">{m.name.split(' ')[0]}</div>
                <div className="text-[9px] text-[#00daf3] mt-0.5">{m.npuLatencyMs}ms NPU</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Model Deep Dive Card */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-['Space_Grotesk'] text-[15px] font-bold text-white flex items-center gap-2">
              {selectedModel.name}
              <span className="font-mono text-[10px] text-[#7dffa2] bg-[#00e676]/15 px-2 py-0.5 rounded font-normal">
                {selectedModel.speedup}
              </span>
            </h3>
            <p className="text-[11px] text-[#bac9cc] mt-1 font-['Sora'] leading-relaxed">
              {selectedModel.description}
            </p>
          </div>
        </div>

        {/* 3-Column Silicon Benchmark Metric comparison */}
        <div className="grid grid-cols-3 gap-2 font-mono pt-1">
          {/* Hexagon NPU */}
          <div className="bg-[#0a0e17] p-2.5 rounded-lg border border-[#00e5ff]/40 shadow-[0_0_12px_rgba(0,229,255,0.15)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[9px] text-[#00e5ff] font-bold">
              <span>HEXAGON HTP NPU</span>
              <span className="material-symbols-outlined text-[12px]">bolt</span>
            </div>
            <div className="my-1">
              <span className="font-['Space_Grotesk'] text-[20px] font-bold text-[#00e5ff]">
                {selectedModel.npuLatencyMs}
              </span>
              <span className="text-[10px] text-[#00e5ff] ml-1">ms</span>
            </div>
            <div className="text-[9px] text-[#7dffa2]">
              Power: <span className="font-bold">{selectedModel.powerWatts}W</span>
            </div>
          </div>

          {/* Oryon CPU Fallback */}
          <div className="bg-[#0a0e17] p-2.5 rounded-lg border border-white/10 flex flex-col justify-between opacity-80">
            <div className="flex items-center justify-between text-[9px] text-[#849396]">
              <span>ORYON 12-CORE CPU</span>
              <span className="material-symbols-outlined text-[12px]">laptop</span>
            </div>
            <div className="my-1">
              <span className="font-['Space_Grotesk'] text-[20px] font-bold text-[#dfe2ef]">
                {selectedModel.cpuLatencyMs}
              </span>
              <span className="text-[10px] text-[#849396] ml-1">ms</span>
            </div>
            <div className="text-[9px] text-[#ffb4ab]">
              Power: <span className="font-bold">28.5W</span>
            </div>
          </div>

          {/* Adreno GPU */}
          <div className="bg-[#0a0e17] p-2.5 rounded-lg border border-white/10 flex flex-col justify-between opacity-80">
            <div className="flex items-center justify-between text-[9px] text-[#849396]">
              <span>ADRENO GPU</span>
              <span className="material-symbols-outlined text-[12px]">view_in_ar</span>
            </div>
            <div className="my-1">
              <span className="font-['Space_Grotesk'] text-[20px] font-bold text-[#dfe2ef]">
                {(selectedModel.npuLatencyMs * 2.8).toFixed(1)}
              </span>
              <span className="text-[10px] text-[#849396] ml-1">ms</span>
            </div>
            <div className="text-[9px] text-amber-300">
              Power: <span className="font-bold">19.8W</span>
            </div>
          </div>
        </div>

        {/* Sub-engine register utilization */}
        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
          <div className="bg-[#0a0e17] p-2 rounded border border-white/5 flex items-center justify-between">
            <span className="text-[#849396]">HTP-HVX Vector Load:</span>
            <span className="text-[#00e5ff] font-bold">{selectedModel.hvxUtil}%</span>
          </div>
          <div className="bg-[#0a0e17] p-2 rounded border border-white/5 flex items-center justify-between">
            <span className="text-[#849396]">HTP-HMX Matrix Load:</span>
            <span className="text-[#00daf3] font-bold">{selectedModel.hmxUtil}%</span>
          </div>
        </div>
      </div>

      {/* Qualcomm AI Hub Compilation Flow Stepper */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex flex-col gap-3 font-mono">
        <span className="text-[11px] text-[#bac9cc] uppercase tracking-wider font-semibold">
          Automated Compilation Pipeline Lifecycle
        </span>

        <div className="flex flex-col gap-2">
          {pipelineSteps.map((step) => {
            const isCompleted = compilingStep >= step.step;
            return (
              <div
                key={step.step}
                className="bg-[#0a0e17] p-2.5 rounded-lg border border-white/10 flex items-start gap-3"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold ${
                    isCompleted
                      ? 'bg-[#00e676]/20 text-[#00e676] border border-[#00e676]/60 shadow-[0_0_8px_rgba(5,231,119,0.5)]'
                      : 'bg-[#262a34] text-[#849396]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.step}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-white font-['Space_Grotesk']">
                      {step.title}
                    </span>
                    <span className="text-[9px] text-[#7dffa2]">VERIFIED</span>
                  </div>
                  <p className="text-[11px] text-[#849396] font-['Sora'] mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                  <div className="mt-1 bg-[#181b25] px-2 py-0.5 rounded text-[10px] text-[#00e5ff] truncate border border-white/5">
                    <code>{step.detail}</code>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
