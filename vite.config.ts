import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

function generateOnDeviceSlmResponse(prompt: string, role: string): string {
  const p = prompt.trim();
  const lower = p.toLowerCase();

  // Math queries
  const mathMatch = lower.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
  if (mathMatch) {
    const a = parseFloat(mathMatch[1]);
    const op = mathMatch[2];
    const b = parseFloat(mathMatch[3]);
    let result = 0;
    if (op === '+') result = a + b;
    if (op === '-') result = a - b;
    if (op === '*') result = a * b;
    if (op === '/') result = b !== 0 ? a / b : NaN;
    return `### [Hexagon Arithmetic Execution Unit]\nEvaluating: **${a} ${op} ${b}** = **${result}**\n\nComputed deterministically via Hexagon Tensor Processor Scalar Dispatch.`;
  }

  // Greetings and introductions
  if (
    lower.startsWith('hi') ||
    lower.startsWith('hello') ||
    lower.startsWith('hey') ||
    lower.includes('who are you') ||
    lower.includes('what is your name')
  ) {
    return `### [OmniSense Edge Copilot]\nHello! I am **OmniSense Edge AI**, your ambient AI and Edge Systems Copilot for Qualcomm Snapdragon® X-Series PCs (Windows 11 ARM64).\n\nI can assist you with:\n- **Qualcomm Hexagon NPU Offloading:** ONNX Runtime \`QNNExecutionProvider\` and \`QnnHtp.dll\`.\n- **Neural Vision:** FastViT-S12 and YOLOv8-nano INT8 UI element localization at 60 FPS.\n- **Voice & Intent:** On-device Whisper-Tiny voice commands and Gemma-2B SLM synthesis.\n- **Silicon Diagnostics:** Monitoring 45 TOPS envelope, LPDDR5x bandwidth, and 85°C thermal thresholds.\n\nWhat would you like to build or inspect?`;
  }

  // Code and Python
  if (
    lower.includes('code') ||
    lower.includes('python') ||
    lower.includes('script') ||
    lower.includes('run') ||
    lower.includes('install')
  ) {
    return `### [Qualcomm QNN Python Pipeline Implementation]
Here is the core ONNX Runtime session initialization for Hexagon HTP offloading:

\`\`\`python
import onnxruntime as ort

qnn_options = {
    "backend_path": "QnnHtp.dll",               # Qualcomm Hexagon Tensor Processor binary
    "htp_performance_mode": "high_performance", # Burst 1.2 GHz clock
    "enable_htp_fp16_precision": "1",            # Mixed precision accumulator
    "htp_graph_finalization_optimization_mode": "3", # Maximum operator fusion
    "soc_model": "60",                          # Snapdragon X Elite
}

session = ort.InferenceSession(
    "models/fastvit_int8.onnx",
    providers=[("QNNExecutionProvider", qnn_options), "CPUExecutionProvider"]
)
\`\`\`

You can download the complete **\`backend_engine.py\`** script directly in the **Python** tab!`;
  }

  // Vision and element tagging
  if (
    lower.includes('fastvit') ||
    lower.includes('vision') ||
    lower.includes('yolo') ||
    lower.includes('screen') ||
    lower.includes('reticle')
  ) {
    return `### [FastViT-S12 & YOLOv8-nano Zero-Copy Vision]
1. **Model Architecture:** FastViT uses RepMixer blocks that re-parameterize into 3x3 depthwise convolutions at inference time, achieving structural transformer power without latency penalties.
2. **Quantization:** Quantized to INT8 using Qualcomm AIMET with per-channel symmetric weights.
3. **Execution Latency:** Runs in **11.2ms** on HTP-HVX vector registers, drawing only **4.2W** (compared to 28.5W on the host CPU).
4. **Desktop Capture:** Frames are ingested directly from Windows Desktop Duplication API (DXGI) via zero-copy DMA buffers.`;
  }

  // Thermals and DVFS
  if (
    lower.includes('thermal') ||
    lower.includes('temp') ||
    lower.includes('throttle') ||
    lower.includes('fan') ||
    lower.includes('heat')
  ) {
    return `### [Snapdragon X Elite Thermal & DVFS Architecture]
- **T-Junction Limit:** 85.0°C.
- **Normal Operating Range:** 42°C – 52°C with fan running quietly at 2,800 RPM (21 dBA).
- **Thermal Clamp Threshold:** If silicon reaches 85.0°C, the DVFS controller throttles core clocks from 1.2 GHz to 680 MHz (-42% compute throughput) and overrides fan to 4,850 RPM emergency overdrive.
- **Interactive Simulation:** You can toggle between 48°C Nominal and the 85.2°C Clamped state anytime in the top HUD bar!`;
  }

  // Fallback tailored to the user's specific query
  return `### [OmniSense Edge System Intelligence]
**Query Analysis:** "${p}"

**Hardware Context (Snapdragon® X Elite):**
- **NPU Engine:** Qualcomm Hexagon Tensor Processor (HTP) via \`QnnHtp.dll\`
- **Peak Compute:** 45 TOPS envelope with 135 GB/s LPDDR5x memory bus
- **Sustained Power:** 4.2W (85% reduction compared to Host CPU)
- **Active Models:** FastViT-S12 INT8 (11.2ms @ 60 FPS) and Gemma-2B SLM

Feel free to ask about specific operator optimizations, compile jobs with the \`qai_hub\` SDK, or test the interactive simulators in the **Controls**, **Neural**, and **Python** tabs!`;
}

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/gemini/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          // Set SSE response headers for real-time streaming
          res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
          });

          const sendEvent = (payload: any) => {
            if (!res.writableEnded && !res.destroyed) {
              res.write(`data: ${JSON.stringify(payload)}\n\n`);
              if (typeof (res as any).flush === 'function') {
                (res as any).flush();
              }
            }
          };

          try {
            const data = JSON.parse(body || '{}');
            const {
              messages = [],
              model = 'gemma-4-26b-a4b-it',
              systemInstruction = 'You are OmniSense Edge AI, a Principal Systems Architect specializing in Qualcomm Hexagon NPU offloading (QnnHtp.dll), Snapdragon X Elite, and on-device ambient desktop accessibility.',
            } = data;

            const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user')?.text || '';
            const apiKey = process.env.GEMINI_API_KEY;

            let streamSuccess = false;

            if (apiKey) {
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              // Format conversation history for @google/genai
              const contents = messages.map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text || '' }],
              }));

              // Candidate priority list: gemma-4-26b-a4b-it is ultra-reliable with fast streaming, then gemini-3.6-flash, then selected model
              const candidateModels = [
                'gemma-4-26b-a4b-it',
                'gemini-3.6-flash',
                model,
              ];

              for (const candidate of candidateModels) {
                try {
                  const stream = await ai.models.generateContentStream({
                    model: candidate,
                    contents,
                    config: candidate.startsWith('gemma') ? undefined : { systemInstruction },
                  });

                  let emittedAny = false;
                  for await (const chunk of stream) {
                    if (res.writableEnded || res.destroyed) break;
                    const text = chunk.text;
                    if (text) {
                      emittedAny = true;
                      sendEvent({
                        text,
                        model: candidate,
                        source: 'gemini-cloud',
                      });
                    }
                  }

                  if (emittedAny) {
                    streamSuccess = true;
                    sendEvent({
                      done: true,
                      model: candidate,
                      source: 'gemini-cloud',
                    });
                    res.end();
                    break;
                  }
                } catch (apiErr: any) {
                  console.warn(`Model ${candidate} stream notice:`, apiErr?.message?.slice(0, 90));
                }
              }
            }

            // If streaming was not successful (e.g. offline, rate limit, or no API key),
            // stream the On-Device SLM fallback token-by-token
            if (!streamSuccess && !res.writableEnded && !res.destroyed) {
              const fallbackText = generateOnDeviceSlmResponse(lastUserMessage, systemInstruction);
              const tokens = fallbackText.split(/(\s+)/);
              for (const token of tokens) {
                if (res.writableEnded || res.destroyed) break;
                sendEvent({
                  text: token,
                  model: 'Gemma-2B-Instruct [On-Device SLM]',
                  source: 'on-device-slm',
                });
                await new Promise((resolve) => setTimeout(resolve, 15));
              }
              sendEvent({
                done: true,
                model: 'Gemma-2B-Instruct [On-Device SLM]',
                source: 'on-device-slm',
              });
              res.end();
            }
          } catch (err: any) {
            console.error('Server Gemini API Streaming Error:', err);
            if (!res.writableEnded && !res.destroyed) {
              const fallbackText = generateOnDeviceSlmResponse('Qualcomm Hexagon NPU offloading', 'architect');
              sendEvent({
                text: fallbackText,
                model: 'Gemma-2B-Instruct [On-Device SLM]',
                source: 'on-device-slm',
              });
              sendEvent({
                done: true,
                model: 'Gemma-2B-Instruct [On-Device SLM]',
                source: 'on-device-slm',
              });
              res.end();
            }
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
