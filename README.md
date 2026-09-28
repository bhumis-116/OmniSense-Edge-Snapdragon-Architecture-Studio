# OmniSense Edge — Snapdragon Architecture Studio

**OmniSense Edge** is an on-device AI architecture studio built specifically to demonstrate hardware-accelerated, real-time edge processing on **Qualcomm Snapdragon X Elite / X Plus** architectures (Windows 11 ARM64). 

By leveraging native Qualcomm NPU offloading alongside dynamic cloud fallbacks, OmniSense Edge provides low-latency visual screen processing, local Small Language Model (SLM) interaction, and real-time hardware telemetry without incurring high thermal or power overhead.

```

---

## Key Features

* **Direct NPU Offloading:** Full integration with Qualcomm’s Hexagon Tensor Processor (`QnnHtp.dll`) via ONNX Runtime’s `QNNExecutionProvider`.
* **Hardware Engine Mapping:**
* **HTP-HVX (Vector Extensions):** FastViT structural vision operators for screen parsing & gaze tracking.
* **HTP-HMX (Matrix Extensions):** Quantized INT8 local SLM execution (Gemma-2B).
* **Scalar Engine:** Dynamic event dispatching & DVFS clock throttling.


* **Ambient Accessibility HUD:** Real-time screen capture, eye-gaze tracking reticles, and voice intent processing (Whisper-Tiny) tailored for mobile ARM PCs.
* **Hardware Telemetry & Stress Analytics:** Live thermal, clock speed, and fan speed visualization with simulated DVFS thermal throttling triggers.
* **Resilient Fallback Pipeline:** Multi-tiered architecture (`QNN Execution Provider` → `CPU Execution Provider` → Telemetry Emulation) ensuring seamless cross-platform testing and development.
* **Modern Studio UI:** Built with React 19, TypeScript, Tailwind CSS, and acrylic glassmorphism styling, supported by an asynchronous, multi-threaded Python backend (`PyQt6`).

---

## Tech Stack

* **Hardware Target:** Qualcomm Snapdragon X Elite (45 TOPS NPU)
* **Backend:** Python 3.11+, ONNX Runtime (QNN / CPU), `qai_hub` (Qualcomm AI Hub SDK), `PyQt6` / `asyncio`
* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
* **Persistence & Cloud:** Firebase Authentication, Firestore, Server-Sent Events (SSE) streaming API

---

## System Architecture

```
                 +-----------------------------------+
                 |        OmniSense Edge UI         |
                 |   (React 19 / TypeScript / SSE)  |
                 +-----------------+-----------------+
                                   |
                                   v
                 +-----------------+-----------------+
                 |       Python Backend Engine       |
                 |   (Async Worker / PyQt6 / CLI)    |
                 +-----------------+-----------------+
                                   |
        +--------------------------+--------------------------+
        |                                                     |
        v                                                     v
+-------+-------------------------+         +-----------------+-----------------+
|   Qualcomm QNN Execution Provider|         |    Fallback CPU / Cloud Stream    |
| (QnnHtp.dll - Hexagon NPU Engine)|         |     (ONNX CPU / Gemini APIs)    |
+---------------------------------+         +---------------------------------+

```

---

## Getting Started

### Prerequisites

* **OS:** Windows 11 ARM64 (Recommended for physical NPU acceleration) or Windows/Linux/macOS for CPU simulation.
* **Python:** 3.11+
* **Node.js:** 18+

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/your-username/omnisense-edge.git](https://github.com/your-username/omnisense-edge.git)
cd omnisense-edge

```


2. **Backend Setup:**
```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

```


3. **Frontend Setup:**
```bash
npm install

```



### Running the Project

* **Start the Python Engine:**
```bash
python backend_engine.py

```


* **Start the Web Interface:**
```bash
npm run dev

```



---

## License

Distributed under the MIT License. See `LICENSE` for more information.

```

```
## 🚀 Live Demo

Experience the **OmniSense Edge AI** copilot and Qualcomm Snapdragon® X Elite Hexagon NPU offloading simulator live in your browser:

🔗 **[Launch OmniSense Edge Web App](https://ais-pre-yfke4luhr5mxnyvksijlca-277507101094.asia-east1.run.app)**
