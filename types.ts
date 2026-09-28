export interface UIElementDetection {
  id: number;
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, w, h] in percentages or px
  interactive: boolean;
  suggestedAction: string;
  type: 'button' | 'input' | 'text' | 'editor' | 'nav';
}

export interface TelemetryData {
  timestamp: string;
  latencyMs: number;
  fps: number;
  computeLoadPct: number;
  topsUtilized: number;
  peakTops: number;
  powerWatts: number;
  thermalCelsius: number;
  isThrottled: boolean;
  activeProvider: string;
  npuActive: boolean;
  focusedElement: string;
  eyeGazePct: number;
  vectorEngineTops: number;
  matrixEngineTops: number;
  scalarEngineTops: number;
  memoryBandwidthGbps: number;
  memorySaturationPct: number;
  weightsMemoryGb: number;
  kvCacheGb: number;
  visionDmaMb: number;
  fanRpm: number;
  fanDutyPct: number;
  fanDba: number;
  fanPreset: 'whisper' | 'balanced' | 'overdrive';
  synthesizedOutput: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  tag: 'NPU Vision' | 'Whisper-Tiny' | 'Gemma-2B SLM' | 'Low Power State' | 'Thermal Daemon' | 'QNN EP' | 'AI Hub';
  message: string;
  highlight?: string;
  level: 'info' | 'warn' | 'error' | 'success';
}

export interface AIHubModel {
  id: string;
  name: string;
  type: 'vision' | 'slm' | 'audio' | 'multimodal';
  inputShape: string;
  precision: 'INT8' | 'FP16';
  targetDevice: string;
  targetRuntime: string;
  npuLatencyMs: number;
  cpuLatencyMs: number;
  speedup: string;
  powerWatts: number;
  hvxUtil: number;
  hmxUtil: number;
  description: string;
}
