# OmniSense Edge — Snapdragon Architecture Studio

**OmniSense Edge** is an on-device AI architecture studio engineered specifically to showcase low-latency, hardware-accelerated edge processing on **Qualcomm Snapdragon X Elite / X Plus** architectures (Windows 11 ARM64).

By leveraging native Qualcomm Hexagon NPU offloading combined with dynamic cloud fallbacks, OmniSense Edge delivers real-time ambient vision processing, local Small Language Model (SLM) inferencing, and hardware telemetry with minimal power overhead.

---

## Key Features

* **Direct NPU Offloading:** Native execution via ONNX Runtime’s `QNNExecutionProvider` targeting `QnnHtp.dll`.
* **Hardware Engine Mapping:**
* **HTP-HVX (Vector Extensions):** FastViT vision processing for real-time screen parsing & eye-gaze tracking.
* **HTP-HMX (Matrix Extensions):** Quantized INT8 local SLM execution (Gemma-2B).
* **Scalar Engine:** Event dispatching, intent parsing, and dynamic DVFS clock management.


* **Ambient Accessibility HUD:** Real-time screen capture analysis, eye-gaze tracking reticles, and local voice intent processing (Whisper-Tiny).
* **Real-time Telemetry & Stress Analytics:** Dynamic thermal, clock speed, and fan speed tracking with interactive DVFS thermal throttling controls.
* **Resilient Fallback Pipeline:** Multi-tiered architecture (`QNN Execution Provider` $\rightarrow$ `CPU Execution Provider` $\rightarrow$ Telemetry Emulation) ensuring full cross-platform compatibility for testing.

---

## Tech Stack

* **Hardware Target:** Qualcomm Snapdragon X Elite (45 TOPS NPU)
* **Backend:** Python 3.11+, ONNX Runtime (QNN / CPU), Qualcomm AI Hub SDK (`qai_hub`), `PyQt6` / `asyncio`
* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
* **Persistence & Streaming:** Firebase Authentication, Firestore, Server-Sent Events (SSE)

---

## Quick Start

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/omnisense-edge.git
cd omnisense-edge

```


2. **Backend Setup:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

```


3. **Frontend Setup:**
```bash
npm install

```



### Execution

* **Start Backend Engine:**
```bash
python backend_engine.py

```


* **Start Web Interface:**
```bash
npm run dev

```



---

## License

Distributed under the MIT License. See `LICENSE` for details. 

The deployed link for the prototype- 
## 🚀 Live Demo

Experience the **OmniSense Edge AI** copilot and Qualcomm Snapdragon® X Elite Hexagon NPU offloading simulator live in your browser:

🔗 **[Launch OmniSense Edge Web App](https://ais-pre-yfke4luhr5mxnyvksijlca-277507101094.asia-east1.run.app)**
Development Preview Link:
https://ais-dev-yfke4luhr5mxnyvksijlca-277507101094.asia-east1.run.app
