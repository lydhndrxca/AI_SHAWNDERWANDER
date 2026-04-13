# What You Can Do With an RTX 5090 (32 GB VRAM)

A categorized guide to free, open-source projects and capabilities for Shawn's RTX 5090 workstation.  
Organized from most immediately useful to most experimental.

---

## Table of Contents

1. [Local Large Language Models (LLMs)](#1-local-large-language-models-llms)
2. [Image Generation & Editing](#2-image-generation--editing)
3. [Video Generation & Animation](#3-video-generation--animation)
4. [Voice, Speech & Audio](#4-voice-speech--audio)
5. [Music Generation](#5-music-generation)
6. [3D & Spatial Computing](#6-3d--spatial-computing)
7. [AI Coding Assistants](#7-ai-coding-assistants)
8. [Autonomous AI Agents](#8-autonomous-ai-agents)
9. [Model Training & Fine-Tuning](#9-model-training--fine-tuning)
10. [Computer Vision & Real-Time Perception](#10-computer-vision--real-time-perception)
11. [NVIDIA Ecosystem Tools](#11-nvidia-ecosystem-tools)
12. [Gaming & Simulation AI](#12-gaming--simulation-ai)
13. [Document & Knowledge AI](#13-document--knowledge-ai)
14. [Creative & Experimental](#14-creative--experimental)

---

## 1. Local Large Language Models (LLMs)

You already have Ollama running. Here's what fits in your 32 GB.

### Models You Can Run

| Model | Size (Q4) | Speed (est.) | Best For |
|---|---|---|---|
| **Qwen3.5 35B** | ~20 GB | ~41 tok/s | Reasoning, agents, tool calling |
| **Qwen3.5 27B** | ~16 GB | ~52 tok/s | Chat, complex reasoning |
| **DeepSeek-R1 32B** | ~20 GB | ~40 tok/s | Deep reasoning, chain-of-thought |
| **Qwen2.5 Coder 32B** | ~20 GB | ~40 tok/s | Code generation (GPT-4o level) |
| **LFM2 24B** | ~14 GB | ~57 tok/s | Tool calling, AI agents |
| **Llama 3.1 70B** | ~36 GB | ~20 tok/s | General knowledge (needs Q3/Q4 + CPU offload) |
| **Mistral Nemo 12B** | ~9.5 GB | ~103 tok/s | Fast chat, quick tasks |
| **Gemma 3 12B** | ~9.5 GB | ~103 tok/s | Lightweight reasoning |
| **Phi-3 Medium 14B** | ~11 GB | ~90 tok/s | Microsoft's efficient model |
| **LLaVA 34B** | ~20 GB | ~35 tok/s | Image understanding + chat |

### LLM Frontends & Servers

| Project | GitHub | What It Does |
|---|---|---|
| **Ollama** | [ollama/ollama](https://github.com/ollama/ollama) | One-command local LLM server (already installed) |
| **Open WebUI** | [open-webui/open-webui](https://github.com/open-webui/open-webui) | ChatGPT-like web interface for Ollama |
| **LM Studio** | [lmstudio.ai](https://lmstudio.ai) | Desktop app, drag-and-drop model loading |
| **Jan** | [janhq/jan](https://github.com/janhq/jan) | Offline-first ChatGPT alternative |
| **text-generation-webui** | [oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui) | Gradio UI with every backend |
| **vLLM** | [vllm-project/vllm](https://github.com/vllm-project/vllm) | High-throughput inference server (batch workloads) |
| **llama.cpp** | [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp) | The C++ engine under Ollama — for advanced use |
| **AnythingLLM** | [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) | All-in-one local RAG + chat app |
| **PrivateGPT** | [zylon-ai/private-gpt](https://github.com/zylon-ai/private-gpt) | Chat with your documents, 100% offline |
| **LibreChat** | [danny-avila/LibreChat](https://github.com/danny-avila/LibreChat) | Multi-model chat UI (local + cloud) |
| **SillyTavern** | [SillyTavern/SillyTavern](https://github.com/SillyTavern/SillyTavern) | Advanced roleplay/character chat frontend |

---

## 2. Image Generation & Editing

Your 5090 generates SDXL images nearly instantly and FLUX images in ~5 seconds.

| Project | GitHub | What It Does |
|---|---|---|
| **ComfyUI** | [comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI) | Node-based image gen workflow (107K+ stars). THE tool for SD/FLUX. |
| **Stable Diffusion WebUI (A1111)** | [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) | Classic SD interface, massive extension ecosystem |
| **Fooocus** | [lllyasviel/Fooocus](https://github.com/lllyasviel/Fooocus) | Midjourney-like simplicity, offline, one-click |
| **InvokeAI** | [invoke-ai/InvokeAI](https://github.com/invoke-ai/InvokeAI) | Professional creative tool, canvas + layers + inpainting |
| **Sana** | [NVlabs/Sana](https://github.com/NVlabs/Sana) | NVIDIA's efficient high-res image synthesis with linear diffusion |
| **Krita AI Diffusion** | [Acly/krita-ai-diffusion](https://github.com/Acly/krita-ai-diffusion) | AI generation built into Krita (Photoshop alternative) |
| **FLUX.1** | via ComfyUI | Black Forest Labs' flagship — photorealistic, 5s on your 5090 |
| **SD3.5 / SDXL** | via ComfyUI | Stability AI models — near-instant on your hardware |
| **ControlNet** | [lllyasviel/ControlNet](https://github.com/lllyasviel/ControlNet) | Pose, depth, edge-guided image generation |
| **IP-Adapter** | [tencent-ailab/IP-Adapter](https://github.com/tencent-ailab/IP-Adapter) | Image-prompted generation (style/character transfer) |

### What You Can Do
- Generate photorealistic images from text in seconds
- Inpaint/outpaint to edit real photos
- Style transfer: turn photos into paintings, anime, etc.
- Train custom LoRA models on your own face/style/characters (see section 9)
- Real-time live canvas generation while drawing

---

## 3. Video Generation & Animation

This is where the 5090 shines — previous-gen GPUs struggled with video diffusion.

| Project | GitHub | What It Does |
|---|---|---|
| **TurboDiffusion** | [thu-ml/TurboDiffusion](https://github.com/thu-ml/TurboDiffusion) | 100-200x faster video gen. Minutes → seconds on your 5090. Apache 2.0. |
| **MonarchRT** | [Infini-AI-Lab/MonarchRT](https://github.com/Infini-AI-Lab/MonarchRT) | Real-time 16 FPS video generation on single 5090 |
| **Wan2.1** | via TurboDiffusion | Text-to-video and image-to-video, 480p-720p |
| **CogVideoX** | [THUDM/CogVideo](https://github.com/THUDM/CogVideo) | Open-source text-to-video, multiple resolutions |
| **AnimateDiff** | [guoyww/AnimateDiff](https://github.com/guoyww/AnimateDiff) | Animate any SD image into video clips |
| **Deforum** | via A1111/ComfyUI | Trippy animated zoom/pan videos from prompts |
| **FILM** | [google-research/frame-interpolation](https://github.com/google-research/frame-interpolation) | Frame interpolation for smooth slow-mo |
| **Locally Uncensored** | [Desktop app](https://dev.to/purpledoubled/v230) | One-click image-to-video, wraps ComfyUI |

### What You Can Do
- Generate short video clips from text descriptions
- Animate still images into motion
- Real-time video generation for creative tools
- Frame interpolation for smooth slow-motion from any video
- Image-to-video character animation

---

## 4. Voice, Speech & Audio

| Project | GitHub | What It Does |
|---|---|---|
| **Qwen3-TTS** | via HuggingFace | 50ms latency streaming TTS on your 5090 |
| **Voxtral TTS** | [Mistral AI](https://huggingface.co/mistralai) | 4B model, 9 languages, 70ms latency, clone voice from 3s sample |
| **OpenAI Whisper** | [openai/whisper](https://github.com/openai/whisper) | Best-in-class speech-to-text, runs locally |
| **Faster Whisper** | [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) | 4x faster Whisper using CTranslate2 |
| **OpenWhisper** | [Knuckles92/OpenWhisper](https://github.com/Knuckles92/OpenWhisper) | Desktop app with hotkeys, real-time transcription |
| **Bark** | [suno-ai/bark](https://github.com/suno-ai/bark) | Text-to-speech with emotion, laughing, music |
| **Coqui TTS** | [coqui-ai/TTS](https://github.com/coqui-ai/TTS) | Multi-speaker voice cloning, 16+ languages |
| **RVC** | [RVC-Project/Retrieval-based-Voice-Conversion-WebUI](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI) | Real-time voice conversion (sing in anyone's voice) |
| **NVIDIA Broadcast** | [nvidia.com/broadcast](https://www.nvidia.com/en-us/geforce/broadcasting/broadcast-app/) | Studio Voice, noise removal, virtual backgrounds, eye contact |
| **Piper** | [rhasspy/piper](https://github.com/rhasspy/piper) | Lightweight fast TTS for embedded/real-time use |

### What You Can Do
- Real-time voice cloning from a 3-second sample
- Transcribe hours of audio in minutes (Whisper large-v3)
- Live voice changing for streaming/Discord
- AI podcast generation with multiple synthetic voices
- Real-time meeting transcription with speaker diarization

---

## 5. Music Generation

| Project | GitHub | What It Does |
|---|---|---|
| **Stable Audio Open** | [Stability-AI/stable-audio-tools](https://github.com/Stability-AI/stable-audio-tools) | Text-to-music and audio generation |
| **AudioCraft (MusicGen)** | [facebookresearch/audiocraft](https://github.com/facebookresearch/audiocraft) | Meta's music generation from text/melody |
| **Udio** / **Suno** | Web-based (free tiers) | State-of-the-art song generation |
| **Demucs** | [facebookresearch/demucs](https://github.com/facebookresearch/demucs) | Separate vocals/drums/bass/other from any song |
| **DDSP** | [magenta/ddsp](https://github.com/magenta/ddsp) | Neural audio synthesis, timbre transfer |
| **Riffusion** | [riffusion/riffusion](https://github.com/riffusion/riffusion) | Real-time music gen using spectrograms + diffusion |

### What You Can Do
- Generate original music tracks from text descriptions
- Isolate stems (vocals, drums, bass) from any song
- Create soundtracks for your games
- Transfer musical styles between instruments

---

## 6. 3D & Spatial Computing

| Project | GitHub | What It Does |
|---|---|---|
| **gsplat** | [nerfstudio-project/gsplat](https://github.com/nerfstudio-project/gsplat) | Optimized 3D Gaussian Splatting (4,787 stars) |
| **3DGS RTX 5090 Setup** | [Keloyi531/3D-Gaussian-Splatting-RTX5090-Setup](https://github.com/Keloyi531/3D-Gaussian-Splatting-RTX5090-Setup) | 5090-specific build with CUDA 12.8 fixes |
| **Nerfstudio** | [nerfstudio-project/nerfstudio](https://github.com/nerfstudio-project/nerfstudio) | Full NeRF toolkit — turn photos into 3D scenes |
| **InstantNGP** | [NVlabs/instant-ngp](https://github.com/NVlabs/instant-ngp) | NVIDIA's instant NeRF — seconds to build a 3D scene |
| **Luma AI** | [lumalabs.ai](https://lumalabs.ai) | Web-based 3D scanning (phone → 3D model) |
| **Meshroom** | [alicevision/Meshroom](https://github.com/alicevision/Meshroom) | Open-source photogrammetry pipeline |
| **Shap-E** | [openai/shap-e](https://github.com/openai/shap-e) | Text/image → 3D model generation |
| **TripoSR** | [VAST-AI-Research/TripoSR](https://github.com/VAST-AI-Research/TripoSR) | Single image → 3D model in ~0.5 seconds |

### What You Can Do
- Walk around your house with a phone camera → full 3D model
- Generate 3D assets from text for your games
- Real-time 3D scene reconstruction from video
- Create VR/AR content from real-world captures

---

## 7. AI Coding Assistants

| Project | GitHub | What It Does |
|---|---|---|
| **Tabby** | [TabbyML/tabby](https://github.com/TabbyML/tabby) | Self-hosted GitHub Copilot alternative |
| **Continue.dev** | [continuedev/continue](https://github.com/continuedev/continue) | VS Code/Cursor extension, local model support |
| **Aider** | [paul-gauthier/aider](https://github.com/paul-gauthier/aider) | Terminal-based AI pair programmer |
| **Cline** | [cline/cline](https://github.com/cline/cline) | Autonomous coding agent in VS Code |
| **Qwen2.5 Coder 32B** | via Ollama | GPT-4o-level code gen, fits entirely in your VRAM |

### What You Can Do
- Run a Copilot-quality code assistant 100% locally, zero cloud costs
- Pair program with AI in terminal
- Auto-complete, refactor, explain code — all offline

---

## 8. Autonomous AI Agents

| Project | GitHub | What It Does |
|---|---|---|
| **CrewAI** | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) | Multi-agent orchestration framework |
| **AutoGen** | [microsoft/autogen](https://github.com/microsoft/autogen) | Microsoft's multi-agent conversation framework |
| **LangGraph** | [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | Build stateful agent workflows |
| **BabyAGI** | [yoheinakajima/babyagi](https://github.com/yoheinakajima/babyagi) | Task-driven autonomous agent |
| **Open Interpreter** | [OpenInterpreter/open-interpreter](https://github.com/OpenInterpreter/open-interpreter) | Natural language → runs code on your computer |
| **Browser Use** | [browser-use/browser-use](https://github.com/browser-use/browser-use) | AI agents that browse the web |
| **Computer Use** | various | AI agents that control your mouse/keyboard |

### What You Can Do
- Build multi-agent systems that research, plan, and execute autonomously
- Natural language computer control
- Automated web scraping and research
- Self-improving code generation pipelines

---

## 9. Model Training & Fine-Tuning

This is where your 32 GB VRAM creates real differentiation.

| Project | GitHub | What It Does |
|---|---|---|
| **Unsloth** | [unslothai/unsloth](https://github.com/unslothai/unsloth) | 2x faster LoRA fine-tuning, 60% less memory |
| **Axolotl** | [OpenAccess-AI-Collective/axolotl](https://github.com/OpenAccess-AI-Collective/axolotl) | Easy fine-tuning toolkit, supports everything |
| **PEFT** | [huggingface/peft](https://github.com/huggingface/peft) | HuggingFace's parameter-efficient fine-tuning |
| **kohya-ss** | [kohya-ss/sd-scripts](https://github.com/kohya-ss/sd-scripts) | LoRA/DreamBooth training for SD/SDXL/FLUX |
| **SimpleTuner** | [bghira/SimpleTuner](https://github.com/bghira/SimpleTuner) | Easy FLUX/SDXL fine-tuning |

### What Fits in 32 GB

| Task | Max Model Size |
|---|---|
| **Full fine-tune** | ~7B parameters |
| **LoRA fine-tune (QLoRA)** | ~20B parameters |
| **LoRA fine-tune (BF16)** | ~13B parameters |
| **Image LoRA (SDXL/FLUX)** | Full models, 512-1024px |
| **DreamBooth** | SDXL/FLUX with 10-30 images of a subject |

### What You Can Do
- Train a model on your own writing style
- Create LoRA of your face for consistent AI portraits
- Fine-tune a coding model on your codebase
- Train custom Stable Diffusion styles
- LoRA fine-tune 14B-20B LLMs on domain-specific data

---

## 10. Computer Vision & Real-Time Perception

| Project | GitHub | What It Does |
|---|---|---|
| **YOLOv8/v9** | [ultralytics/ultralytics](https://github.com/ultralytics/ultralytics) | Real-time object detection |
| **SAM 2** | [facebookresearch/sam2](https://github.com/facebookresearch/sam2) | Segment anything in images or video |
| **DepthAnything v2** | [DepthAnything/Depth-Anything-V2](https://github.com/DepthAnything/Depth-Anything-V2) | Monocular depth estimation from any image |
| **Florence-2** | via HuggingFace | Microsoft's vision foundation model |
| **Grounding DINO** | [IDEA-Research/GroundingDINO](https://github.com/IDEA-Research/GroundingDINO) | Open-set object detection with text prompts |
| **DWPose** | [IDEA-Research/DWPose](https://github.com/IDEA-Research/DWPose) | Full-body pose estimation |
| **MediaPipe** | [google-ai-edge/mediapipe](https://github.com/google-ai-edge/mediapipe) | Face, hand, body tracking — real-time |

### What You Can Do
- Real-time object detection in video feeds
- Segment any object in any image with a click
- Depth mapping from 2D photos
- Full body/hand/face tracking for games or motion capture
- Build custom visual search engines

---

## 11. NVIDIA Ecosystem Tools

These are purpose-built for your hardware.

| Tool | What It Does |
|---|---|
| **NVIDIA Broadcast** | Studio Voice, noise removal, virtual backgrounds, eye contact AI |
| **DLSS 4.5** | 6X multi-frame gen, dynamic adjustment, transformer upscaling |
| **TensorRT** | Optimize any model for max GPU throughput |
| **TensorRT-LLM** | Optimized LLM inference engine |
| **CUDA Toolkit** | (Not yet installed) Required for training — install v12.8+ |
| **cuDNN** | Deep learning primitives library |
| **Nsight Systems** | GPU profiling and performance analysis |
| **Omniverse** | 3D collaboration and simulation platform |

### Important Setup Note
You have CUDA 13.2 at the driver level but **nvcc (CUDA Toolkit) is not installed**. To do any model training or compile CUDA extensions, install the CUDA Toolkit:
```
https://developer.nvidia.com/cuda-downloads
```

---

## 12. Gaming & Simulation AI

| Project | GitHub | What It Does |
|---|---|---|
| **Inworld AI** | [inworld-ai](https://www.inworld.ai/) | AI NPCs with personality and memory |
| **NVIDIA ACE** | [nvidia.com/ace](https://developer.nvidia.com/ace) | AI character engine for games |
| **Unity ML-Agents** | [Unity-Technologies/ml-agents](https://github.com/Unity-Technologies/ml-agents) | Train game AI with reinforcement learning |
| **Gymnasium** | [Farama-Foundation/Gymnasium](https://github.com/Farama-Foundation/Gymnasium) | RL environments (successor to OpenAI Gym) |
| **Stable-Baselines3** | [DLR-RM/stable-baselines3](https://github.com/DLR-RM/stable-baselines3) | Reliable RL algorithm implementations |
| **GameNGen** | [Google Research](https://gamengen.github.io/) | Neural game engine — plays DOOM via diffusion |

### What You Can Do
- Train game AI agents via reinforcement learning
- Create AI NPCs with persistent memory and personality
- Build neural game engines
- Real-time AI character animation and dialogue

---

## 13. Document & Knowledge AI

| Project | GitHub | What It Does |
|---|---|---|
| **PrivateGPT** | [zylon-ai/private-gpt](https://github.com/zylon-ai/private-gpt) | Chat with your documents, 100% offline |
| **AnythingLLM** | [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) | All-in-one RAG platform |
| **Chroma** | [chroma-core/chroma](https://github.com/chroma-core/chroma) | Vector database for embeddings |
| **DocTR** | [mindee/doctr](https://github.com/mindee/doctr) | Document text recognition (OCR) |
| **Marker** | [VikParuchuri/marker](https://github.com/VikParuchuri/marker) | Convert PDFs to markdown with high accuracy |
| **Surya** | [VikParuchuri/surya](https://github.com/VikParuchuri/surya) | OCR, layout analysis, reading order detection |

### What You Can Do
- Build a personal knowledge base from all your documents
- Chat with PDFs, codebases, notes — offline
- OCR and digitize any document
- Semantic search across your entire file system

---

## 14. Creative & Experimental

| Project | GitHub | What It Does |
|---|---|---|
| **StreamDiffusion** | [cumulo-autumn/StreamDiffusion](https://github.com/cumulo-autumn/StreamDiffusion) | Real-time interactive image gen (webcam → AI) |
| **AI Minecraft** | [BAAI-Agents/Cradle](https://github.com/BAAI-Agents/Cradle) | AI agent that plays any game |
| **Live Portrait** | [KwaiVGI/LivePortrait](https://github.com/KwaiVGI/LivePortrait) | Animate photos with your webcam expressions |
| **FaceFusion** | [facefusion/facefusion](https://github.com/facefusion/facefusion) | Face swapping and enhancement |
| **Roop** | [s0md3v/roop](https://github.com/s0md3v/roop) | One-click face swap |
| **DragGAN** | [XingangPan/DragGAN](https://github.com/XingangPan/DragGAN) | Drag to edit images |
| **TranslateGemma** | via ComfyUI | Local multilingual translation (4B model) |

### What You Can Do
- Real-time AI art from your webcam
- Animate any portrait photo with your facial expressions
- AI agents that play video games
- Interactive image editing by dragging

---

## Quick-Start Recommendations

If you want to get started today, here's what I'd do in order:

### 1. Install CUDA Toolkit (unlocks training)
```bash
# Download from https://developer.nvidia.com/cuda-downloads
# Select: Windows > x86_64 > 11 > exe (network)
```

### 2. Try ComfyUI (image generation)
```bash
# Download portable: https://github.com/comfyanonymous/ComfyUI/releases
# No install needed — extract and run
```

### 3. Pull a big LLM (you already have Ollama)
```bash
ollama pull qwen2.5-coder:32b
ollama pull deepseek-r1:32b
```

### 4. Try real-time video generation
```bash
git clone https://github.com/thu-ml/TurboDiffusion
pip install -r requirements.txt
```

### 5. Set up Open WebUI (chat interface for Ollama)
```bash
pip install open-webui
open-webui serve
```

---

## Addendum: Discoveries from Deep Research (April 2026)

### Blackwell FP4 — Your 5090's Unique Superpower

The RTX 5090's 5th-gen Tensor Cores have **native FP4 hardware acceleration** — the 4090 cannot do this at all. Using NVIDIA's NVFP4 format + SVDQuant:
- **3x speedup** over BF16 for diffusion models
- **4x smaller** model footprint with 16-bit quality
- FLUX.1 runs at near-instant speeds in FP4

To use it: [github.com/mit-han-lab/nunchaku](https://github.com/mit-han-lab/nunchaku) (MIT license, works with TensorRT)

### CUDA 13 New Features
- **cuTile Python**: Write Tensor Core kernels in Python (no C++ needed). `pip install cutile`.
- **Green Contexts**: Fine-grained GPU resource partitioning — run multiple AI services without fighting over VRAM.
- CUDA 13.2 supports recursive functions, closures, custom reductions in Python.

### Running Multiple AI Services Simultaneously

Your 32 GB can run 6 AI services at once with proper VRAM management:
- Set `OLLAMA_NUM_CTX=4096` and `OLLAMA_MAX_LOADED_MODELS=4` to prevent VRAM bloat
- Create Modelfiles with explicit `num_ctx` — default 128K context silently eats 65 GB
- Q4_K_M quantization is the sweet spot for concurrent models
- Example combo: 14B LLM (11 GB) + FLUX (12 GB) + Whisper (2 GB) = 25 GB, 7 GB headroom

### New Categories Discovered

**AI Music Generation**

| Project | GitHub | What It Does |
|---|---|---|
| **ACE-Step 1.5 XL** | [ACE-Step/ACE-Step-1.5](https://github.com/ACE-Step/ACE-Step-1.5) | 2026's best open-source music gen. 50+ languages, voice cloning, 10s-10min tracks. 4B params, needs ~12 GB VRAM. Rivals Suno v4.5. |
| **ACE-Step (base)** | [ace-step/ACE-Step](https://github.com/ace-step/ACE-Step) | Lighter version, <4 GB VRAM. Cover gen, vocal-to-BGM, lyric editing. |

**AI Lip Sync & Talking Heads**

| Project | GitHub | What It Does |
|---|---|---|
| **IMTalker** | [cbsjtu01/IMTalker](https://github.com/cbsjtu01/IMTalker) | Audio → talking face from portrait. 40+ FPS. Controllable gaze/pose. |
| **ARTalk** | [xg-chu/ARTalk](https://github.com/xg-chu/ARTalk) | Real-time 3D lip sync + expressions from audio. MIT. |
| **SyncTalk** | [ziqiaopeng/SyncTalk](https://github.com/ziqiaopeng/SyncTalk) (1.6K stars) | CVPR 2024. Synchronized talking head videos. |
| **RealtimeVoiceChat** | [KoljaB/RealtimeVoiceChat](https://github.com/KoljaB/RealtimeVoiceChat) (4K stars) | ~500ms voice assistant. Ollama backend. FastAPI + WebSocket. |

**Character Consistency (Same Character Across Images)**

| Project | GitHub | What It Does |
|---|---|---|
| **ConsistentID** | [JackAILab/ConsistentID](https://github.com/JackAILab/ConsistentID) | TPAMI 2026. Identity-preserving portrait gen. No LoRA training needed. |
| **WithAnyone** | [Doby-Xu/WithAnyone](https://github.com/doby-xu/WithAnyone) | ICLR 2026. Multi-ID consistent gen on FLUX. ComfyUI integration. |
| **UMO** | [bytedance/UMO](https://github.com/bytedance/UMO) | CVPR 2026. ByteDance's multi-identity consistency via RL. |

**AI Voice Agents (Speech-to-Speech)**

| Project | GitHub | What It Does |
|---|---|---|
| **RealtimeVoiceChat** | [KoljaB/RealtimeVoiceChat](https://github.com/KoljaB/RealtimeVoiceChat) | 500ms response. Ollama + Whisper + Kokoro TTS. Docker-ready. |
| **Speech-to-Speech Local** | [Ankur2606/Speech-to-Speech-Low-Latency-Local-AI](https://github.com/Ankur2606/Speech-to-Speech-Low-Latency-Local-AI) | Continuous streaming, natural interrupts. Runs on CPU+GPU. |

**AI World Building & Game Writing**

| Project | GitHub | What It Does |
|---|---|---|
| **WorldLoom** | [acornfish/WorldLoom](https://github.com/acornfish/WorldLoom) | Offline worldbuilding tool. Articles, maps, timelines, manuscript writing. GPL-3.0. |
| **StoryCraftr** | [raestrada/storycraftr](https://github.com/raestrada/storycraftr) | CLI story/book creation with Ollama support. Manages worldbuilding details. |
| **Aventuras** | [AventurasTeam/Aventuras](https://github.com/AventurasTeam/Aventuras) | 2026. Interactive fiction with memory system, dynamic lorebook, AI lore agents. |
| **Lorewalker** | [Rukongai/Lorewalker](https://github.com/Rukongai/Lorewalker) | Lorebook editor with graph visualization and health analysis. |

**AI NPC Dialogue**

| Project | GitHub | What It Does |
|---|---|---|
| **Interactive LLM NPCs** | [AkshitIreddy/Interactive-LLM-Powered-NPCs](https://github.com/AkshitIreddy/Interactive-LLM-Powered-NPCs) (705 stars) | LLM NPCs with memory, emotion detection, lip sync. Works in existing games. |
| **Generative NPC Dialogue** | [V-o-id/generative-npc-dialogue](https://github.com/V-o-id/generative-npc-dialogue) | Godot + FastAPI. RAG-based NPC dialogue with persistent memory. |
| **AI Village RPG** | [ai-village-agents/rpg-game-rest](https://github.com/ai-village-agents/rpg-game-rest) | 2026. Browser RPG with NPC dialogue, quests, companion relationships. |

**Text-to-3D Scenes & Environments**

| Project | GitHub | What It Does |
|---|---|---|
| **WorldGen** | [ZiYang-xie/WorldGen](https://github.com/ZiYang-xie/WorldGen) | Text → full 3D environment in seconds. 360° exploration. Indoor/outdoor. |
| **RealmDreamer** | [jaidevshriram/realmdreamer](https://github.com/jaidevshriram/realmdreamer) | Text → 3D scenes via Gaussian Splatting. 3DV 2025. |
| **ArtiScene** | [NVlabs/ArtiScene](https://github.com/NVlabs/ArtiScene) | NVIDIA. CVPR 2025. Language-driven artistic 3D scenes. |
| **Gravimera** | [gravimera/gravimera](https://github.com/gravimera/gravimera) | 2026. LLM-driven 3D world editor on Bevy engine. Natural language → 3D. |

**Real-Time Interactive Canvas**

| Project | GitHub | What It Does |
|---|---|---|
| **StreamDiffusion** | [cumulo-autumn/StreamDiffusion](https://github.com/cumulo-autumn/StreamDiffusion) (10.7K stars) | 90+ FPS real-time image gen. Draw on canvas → AI fills in real-time. ICCV 2025. |

**Screenshot-to-Code**

| Project | GitHub | What It Does |
|---|---|---|
| **screenshot-to-code** | [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) (72K stars) | Screenshot/Figma → HTML/React/Vue/Tailwind. FastAPI backend. |
| **ScreenCoder** | [leigest519/ScreenCoder](https://github.com/leigest519/ScreenCoder) (2.6K stars) | Multi-agent visual-to-code. UI detection + layout planning. |

**RAG & Personal Knowledge Bases**

| Project | GitHub | What It Does |
|---|---|---|
| **OpenRAG** | [langflow-ai/openrag](https://github.com/langflow-ai/openrag) (3.8K stars) | Full RAG platform. Drag-and-drop workflows. Ollama compatible. |
| **Second Brain** | [henrydaum/second-brain](https://github.com/henrydaum/second-brain) | Desktop app. Watches directories. Self-extending AI agent. |
| **Local RAG** | [jonfairbanks/local-rag](https://github.com/jonfairbanks/local-rag) | Fully offline RAG. Files + GitHub + web. Ollama. |

**Pixel Art & Sprite Generation**

| Project | GitHub | What It Does |
|---|---|---|
| **DGX-Pixels** | [raibid-labs/dgx-pixels](https://github.com/raibid-labs/dgx-pixels) | SDXL + custom LoRA for pixel art sprites. Bevy engine integration. |
| **PixelRefiner** | [HappyOnigiri/PixelRefiner](https://github.com/HappyOnigiri/PixelRefiner) | Post-process AI art into clean pixel art. NES/SNES/Game Boy palettes. |

**AI Coding Agents (2026 Trending)**

| Project | GitHub | What It Does |
|---|---|---|
| **Plandex** | [plandex-ai/plandex](https://github.com/plandex-ai/plandex) (15.2K stars) | Terminal AI dev tool. 2M token context. Plans + implements + debugs. |
| **Aperant** | [AndyMik90/Aperant](https://github.com/AndyMik90/Aperant) (13.8K stars) | Autonomous multi-agent coding framework. Plans, builds, validates. |
| **OpenDev** | [opendev-to/opendev](https://github.com/opendev-to/opendev) | Rust. 4.3ms startup. Multi-model routing. 128x faster than alternatives. |
| **yoyo-evolve** | [yologdev/yoyo-evolve](https://github.com/yologdev/yoyo-evolve) (1.5K stars) | Self-evolving AI agent. Grew from 200 → 42K lines autonomously. |

**Seamless Tileable Textures**

| Project | GitHub | What It Does |
|---|---|---|
| **Tiled Diffusion** | [madaror/tiled-diffusion](https://github.com/madaror/tiled-diffusion) | CVPR 2025. Seamlessly tileable images via diffusion. |
| **TEXTtoPBR** | [Vasco888888/text-to-pbr](https://github.com/Vasco888888/text-to-pbr) | Text → seamless PBR textures. Client-side tiling. React + Three.js. |

**Motion Capture**

| Tool | Info | What It Does |
|---|---|---|
| **Theia3D** | [theiamarkerless.com](https://theiamarkerless.com) | Markerless mocap. 3x faster person detection on 5090 vs 4090. |
