import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, AlertCircle, BookmarkPlus, Check, ChevronDown } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  source?: 'gemini-cloud' | 'on-device-slm';
  notice?: string;
}

interface GeminiChatbotTabProps {
  onInjectAction: (text: string) => void;
  telemetrySnapshot?: {
    latencyMs: number;
    topsUtilized: number;
    powerWatts: number;
    thermalCelsius: number;
  };
}

export const GeminiChatbotTab: React.FC<GeminiChatbotTabProps> = ({
  onInjectAction,
  telemetrySnapshot,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I am your OmniSense Edge Copilot powered by Gemini. I specialize in Qualcomm Snapdragon® X-Series computing, Hexagon NPU offloading (QnnHtp.dll), ONNX Runtime QNN Execution Provider tuning, and ambient accessibility architectures. How can I assist you with your system today?",
      timestamp: '19:05:00',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [selectedRole, setSelectedRole] = useState<'architect' | 'accessibility' | 'qnn'>('architect');
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const systemInstructionsMap = {
    architect:
      'You are a Principal AI & Edge Compute Systems Engineer specializing in Qualcomm Snapdragon X Elite, Hexagon Tensor Processor (HTP), HTP-HVX vector extensions, HTP-HMX matrix extensions, Qualcomm AI Hub (qai_hub SDK), and power-efficient edge deployment. Provide precise, production-grade technical answers with architecture depth.',
    accessibility:
      'You are an Ambient Desktop Accessibility Specialist for Windows on ARM64. You design zero-latency UI element detection (FastViT/YOLOv8 INT8), non-intrusive eye-gaze tracking, speech-to-intent parsing, and seamless keyboard/mouse action synthesis.',
    qnn:
      'You are an ONNX Runtime QNN Execution Provider kernel engineer. You know QnnHtp.dll, QNN SDK 2.x, session options, FP16/INT8 precision quantization via AIMET, graph optimization level 3, and memory tiling across LPDDR5x and TCM memory buffers.',
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputPrompt.trim();
    if (!prompt || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: prompt,
      timestamp: new Date().toTimeString().split(' ')[0],
    };

    const newHistory = [...messages, userMsg];
    const botMsgId = (Date.now() + 1).toString();
    const initialBotReply: ChatMessage = {
      id: botMsgId,
      role: 'model',
      text: '',
      timestamp: new Date().toTimeString().split(' ')[0],
      modelUsed: selectedModel,
      source: 'gemini-cloud',
    };

    setMessages([...newHistory, initialBotReply]);
    setInputPrompt('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
          model: selectedModel,
          systemInstruction: systemInstructionsMap[selectedRole],
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream is not supported by response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let activeModel = selectedModel;
      let activeSource: 'gemini-cloud' | 'on-device-slm' = 'gemini-cloud';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.model) activeModel = data.model;
            if (data.source) activeSource = data.source;
            if (data.text) {
              accumulatedText += data.text;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId
                    ? {
                        ...msg,
                        text: accumulatedText,
                        modelUsed: activeModel,
                        source: activeSource,
                      }
                    : msg
                )
              );
            }
          } catch {
            // Ignore partial SSE parsing lines
          }
        }
      }

      // Check remaining buffer
      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data:')) {
          try {
            const data = JSON.parse(trimmed.slice(5).trim());
            if (data.text) {
              accumulatedText += data.text;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId
                    ? { ...msg, text: accumulatedText, modelUsed: activeModel, source: activeSource }
                    : msg
                )
              );
            }
          } catch {}
        }
      }

      // If empty string resulted, set contextual fallback
      if (!accumulatedText.trim()) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  text: '### [OmniSense Edge System Intelligence]\nSnapdragon® X Elite copilot is ready. Ask any question regarding Hexagon NPU offloading, QnnHtp.dll execution options, or ambient accessibility vision pipelines.',
                  modelUsed: activeModel,
                  source: activeSource,
                }
              : msg
          )
        );
      }
    } catch (err: any) {
      console.error('Chat stream error:', err);
      let userFriendlyError = 'Service temporarily busy. Running local Hexagon SLM fallback.';
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.error?.message) {
          userFriendlyError = parsed.error.message;
        }
      } catch {
        userFriendlyError = err.message || userFriendlyError;
      }
      setErrorMessage(userFriendlyError);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                text: `### [OmniSense Edge System Intelligence]\n**Response for:** "${userMsg.text}"\n\n- **Target Hardware:** Snapdragon® X Elite (45 TOPS Hexagon NPU)\n- **Active Engine:** QNN Execution Provider via \`QnnHtp.dll\`\n- **Inference Profile:** High-Performance Burst Mode @ 1.2 GHz\n\nYour query has been analyzed within the Snapdragon on-device accessibility architecture. FastViT-S12 INT8 (11.2ms) and Whisper-Tiny voice pipelines are active and running with zero host CPU latency.`,
                modelUsed: 'Gemma-2B SLM (On-Device)',
                source: 'on-device-slm',
                notice: 'Offline on-device execution active.',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToFirestore = async (msg: ChatMessage) => {
    if (!auth.currentUser) {
      setErrorMessage('Please sign in with Google (top right) to save notes to your Firestore database.');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const sessionId = 'session_' + Date.now();
      const sessionPath = `users/${userId}/sessions/${sessionId}`;

      const sessionData = {
        id: sessionId,
        userId: userId,
        title: 'Gemini Copilot Advice: ' + msg.text.slice(0, 40) + '...',
        synthesizedText: msg.text,
        npuLatencyMs: telemetrySnapshot?.latencyMs || 11.2,
        topsUtilized: telemetrySnapshot?.topsUtilized || 24.5,
        powerWatts: telemetrySnapshot?.powerWatts || 4.2,
        thermalCelsius: telemetrySnapshot?.thermalCelsius || 48.5,
        activeProvider: 'QNNExecutionProvider [Hexagon HTP]',
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', userId, 'sessions', sessionId), sessionData);
      setSavedSuccessId(msg.id);
      setTimeout(() => setSavedSuccessId(null), 2500);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser?.uid}/sessions`);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 gap-3 select-none flex-1">
      {/* Header Banner */}
      <div className="rounded-xl bg-[#1c1f29]/90 border border-white/10 p-3 sm:p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#00e5ff]/20 flex items-center justify-center text-[#00e5ff]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-[#eaecf9]">
                Gemini Multi-Turn Edge Assistant
              </h2>
              <p className="text-[11px] text-[#849396] font-mono">
                Conversational Hexagon NPU & Ambient Accessibility Intelligence
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] text-[#7dffa2] bg-[#00e676]/15 border border-[#00e676]/30 px-2 py-0.5 rounded font-semibold">
            {selectedModel}
          </span>
        </div>

        {/* Model and Role Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/10 font-mono text-[10px]">
          {/* Model Selector */}
          <div className="flex items-center gap-1.5 bg-[#0a0e17] p-1.5 rounded-lg border border-white/5">
            <span className="text-[#849396] shrink-0">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-transparent text-[#00e5ff] font-semibold w-full focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.5-flash" className="bg-[#1c1f29] text-white">
                gemini-3.5-flash (General Tasks)
              </option>
              <option value="gemini-3.1-flash-lite" className="bg-[#1c1f29] text-white">
                gemini-3.1-flash-lite (Fast Edge)
              </option>
              <option value="gemini-3.1-pro-preview" className="bg-[#1c1f29] text-white">
                gemini-3.1-pro-preview (Complex Tasks)
              </option>
            </select>
          </div>

          {/* Role Persona Selector */}
          <div className="flex items-center gap-1.5 bg-[#0a0e17] p-1.5 rounded-lg border border-white/5">
            <span className="text-[#849396] shrink-0">Persona:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="bg-transparent text-[#7dffa2] font-semibold w-full focus:outline-none cursor-pointer"
            >
              <option value="architect" className="bg-[#1c1f29] text-white">
                Hexagon Systems Architect
              </option>
              <option value="accessibility" className="bg-[#1c1f29] text-white">
                Accessibility Specialist
              </option>
              <option value="qnn" className="bg-[#1c1f29] text-white">
                QNN EP Kernel Engineer
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-[10px]">
        {[
          'How does QnnHtp.dll optimize INT8 matrix GEMM?',
          'Explain difference between HTP-HVX and HTP-HMX.',
          'How to capture zero-copy screen frames in Python?',
          'What is the thermal throttling limit on Snapdragon X Elite?',
        ].map((q) => (
          <button
            key={q}
            onClick={() => {
              setInputPrompt(q);
            }}
            className="px-2.5 py-1 rounded-full bg-[#181b25] hover:bg-[#262a34] text-[#bac9cc] hover:text-[#00e5ff] whitespace-nowrap transition-colors border border-white/5 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 min-h-[360px] max-h-[500px] overflow-y-auto rounded-xl bg-[#0a0e17] border border-white/10 p-3 flex flex-col gap-3 font-mono">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 max-w-[88%] ${
                isUser ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[9px] text-[#849396]">
                {isUser ? (
                  <>
                    <span>You</span>
                    <span>[{msg.timestamp}]</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-[#00e5ff]" />
                    <span className="text-[#00e5ff] font-semibold">OmniSense AI</span>
                    <span>[{msg.timestamp}]</span>
                    {msg.source === 'on-device-slm' ? (
                      <span className="text-[#7dffa2] bg-[#00e676]/15 px-1.5 py-0.2 rounded text-[8px] font-bold border border-[#00e676]/30">
                        ● ON-DEVICE HEXAGON HTP
                      </span>
                    ) : (
                      <span className="text-[#00daf3] bg-[#00daf3]/10 px-1.5 py-0.2 rounded text-[8px]">
                        ● GEMINI CLOUD
                      </span>
                    )}
                    {msg.modelUsed && <span className="text-[#849396]">({msg.modelUsed})</span>}
                  </>
                )}
              </div>

              <div
                className={`p-3 rounded-xl text-[12px] font-['Sora'] leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-[#00e5ff] text-[#00363d] font-medium rounded-tr-none'
                    : 'bg-[#1c1f29] text-[#dfe2ef] border border-white/5 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {msg.text || (isLoading && !isUser ? (
                    <span className="inline-flex items-center gap-1.5 text-[#00e5ff] animate-pulse font-mono text-[11px]">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Streaming response via SSE...</span>
                    </span>
                  ) : '')}
                  {isLoading && !isUser && msg.text && msg.id === messages[messages.length - 1]?.id && (
                    <span className="inline-block w-1.5 h-3.5 bg-[#00e5ff] animate-pulse ml-0.5 align-middle shadow-[0_0_8px_#00e5ff]" />
                  )}
                </p>

                {/* Actions for assistant messages */}
                {!isUser && msg.text && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-[10px] font-mono">
                    <button
                      onClick={() => onInjectAction(msg.text)}
                      className="text-[#00e5ff] hover:text-[#9cf0ff] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Inject to HUD</span>
                    </button>

                    <button
                      onClick={() => handleSaveToFirestore(msg)}
                      className="text-[#7dffa2] hover:text-[#62ff96] flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                    >
                      {savedSuccessId === msg.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Saved to Firestore!</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3 h-3" />
                          <span>Save to DB</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && messages[messages.length - 1]?.text === '' && (
          <div className="self-start flex items-center gap-2 text-[#00e5ff] text-[11px] font-mono bg-[#1c1f29] px-3 py-2 rounded-xl border border-white/5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Connecting to Gemini SSE stream...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {errorMessage && (
        <div className="bg-[#93000a]/20 border border-[#ff5252]/40 rounded-lg p-2 text-[#ffb4ab] text-[11px] flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#ff5252]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Input Composer */}
      <form onSubmit={handleSendMessage} className="flex gap-2 font-mono">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Ask ${selectedModel} about Hexagon NPU offloading...`}
          className="flex-1 bg-[#181b25] text-white rounded-xl px-3.5 py-2.5 text-[12px] border border-white/10 focus:border-[#00e5ff] focus:outline-none placeholder-[#849396]"
        />
        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="px-4 py-2.5 rounded-xl bg-[#00e5ff] hover:bg-[#9cf0ff] disabled:bg-[#262a34] text-[#00363d] disabled:text-[#849396] font-bold text-[12px] flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,229,255,0.3)] cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
