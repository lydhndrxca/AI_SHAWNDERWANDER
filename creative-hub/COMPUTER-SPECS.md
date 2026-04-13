# Computer Specs — Shawn's Workstation

> **Machine**: MSI Aegis R2 Desktop (US Desktop Aegis R2)
> **Last scanned**: April 11, 2026

---

## System Overview

| Component | Detail |
|---|---|
| **OS** | Windows 11 Pro — Build 26200 |
| **Hostname** | SHAWN_PERSONAL |
| **System Type** | x64-based PC, Multiprocessor |
| **Motherboard** | MSI PRO B760-VC WIFI 7 BULK (MS-7D98) |
| **BIOS** | American Megatrends International, LLC. B.MC (12/31/2024) |

---

## CPU

| Spec | Value |
|---|---|
| **Model** | Intel Core i9-14900F |
| **Architecture** | Raptor Lake Refresh (14th Gen) |
| **Cores** | 24 (8 P-cores + 16 E-cores) |
| **Threads** | 32 |
| **Base Clock** | 2.0 GHz (P-cores boost to 5.8 GHz) |
| **L2 Cache** | 32 MB |
| **L3 Cache** | 36 MB |
| **Note** | "F" variant — no integrated graphics, all display output via GPU |

---

## GPU

| Spec | Value |
|---|---|
| **Model** | NVIDIA GeForce RTX 5090 |
| **Architecture** | Blackwell (GB202) |
| **Process** | TSMC 4nm |
| **VRAM** | 32 GB GDDR7 |
| **Memory Bus** | 512-bit |
| **Memory Bandwidth** | 1,792 GB/s |
| **CUDA Cores** | 21,760 |
| **Tensor Cores** | 680 (5th gen, native FP4 support) |
| **RT Cores** | 170 (4th gen) |
| **FP32 Performance** | 104.8 TFLOPS |
| **Base Clock** | 2,017 MHz |
| **Boost Clock** | 2,407 MHz |
| **Max SM Clock** | 3,090 MHz |
| **TDP** | 575W |
| **Interface** | PCIe 5.0 x16 |
| **Power Connector** | 1x 16-pin |
| **Driver** | 595.79 |
| **CUDA Version** | 13.2 |
| **DLSS** | 4.5 (6X Multi Frame Generation) |

---

## RAM

| Spec | Value |
|---|---|
| **Total** | 96 GB (2 x 48 GB) |
| **Type** | DDR5 |
| **Speed** | 4800 MHz |
| **Manufacturer** | Kingston |
| **Configuration** | Dual-channel |

---

## Storage

| Spec | Value |
|---|---|
| **Drive** | Kingston SNV3S4000G |
| **Type** | NVMe SSD (M.2) |
| **Capacity** | 4 TB (~3,725 GB usable) |
| **Free Space** | ~2,929 GB (as of scan) |
| **Filesystem** | NTFS |

---

## Networking

| Interface | Detail |
|---|---|
| **Ethernet** | Realtek Gaming 2.5GbE (active, DHCP, 1 Gbps link) |
| **Wi-Fi** | Qualcomm FastConnect 7800 — Wi-Fi 7 HBS (available, not connected) |
| **Bluetooth** | Integrated (via Wi-Fi adapter) |
| **VPN** | Tailscale installed and active |

---

## Audio

- Realtek High Definition Audio (onboard)
- NVIDIA High Definition Audio (HDMI/DP passthrough)
- NVIDIA Virtual Audio Device
- USB Audio Device (external)
- Voicemod (virtual audio driver)

---

## Software Environment

| Tool | Version |
|---|---|
| **Python** | 3.12.10 |
| **pip** | 25.0.1 |
| **Node.js** | 22.16.0 |
| **npm** | 10.9.2 |
| **Git** | 2.53.0 |
| **Ollama** | 0.19.0 (running, GPU-accelerated) |
| **CUDA Toolkit (nvcc)** | Not installed (driver-level CUDA 13.2 available) |
| **Docker** | Not installed |
| **Conda** | Not installed |

### Notable Running Processes
- Ollama (local LLM inference server)
- Steam
- Adobe Creative Cloud
- Discord
- Slack
- Cursor IDE
- Chrome + Edge

---

## Power Budget Estimate

| Component | Draw |
|---|---|
| RTX 5090 | up to 575W |
| i9-14900F | up to 253W (PL2) |
| RAM + SSD + Fans | ~30W |
| **Total Peak** | **~860W** |

> PSU should be 1000W+ for headroom. Confirm PSU wattage if planning sustained GPU training loads.

---

## Key Capabilities at a Glance

- **ML Inference**: Run 70B LLMs (Q4), 32B models at full Q6/Q8 precision, 145 tok/s on 8B models
- **ML Training**: LoRA fine-tune models up to ~20B parameters; full fine-tune up to ~7B
- **Image Generation**: FLUX.1 in ~5 seconds (BF16), ~1.5s in FP4 via Nunchaku. SDXL near-instant.
- **Video Generation**: Real-time 16 FPS video diffusion (MonarchRT), 100-200x accelerated (TurboDiffusion)
- **3D Reconstruction**: Gaussian splatting, NeRF at high resolution
- **Gaming**: 4K path-traced gaming at 240+ FPS with DLSS 4.5 6X frame gen
- **Streaming/Creative**: NVIDIA Broadcast AI effects, real-time voice synthesis
- **Concurrent Services**: Can run 4-6 AI services simultaneously (e.g., LLM + image gen + TTS + bg removal = ~20 GB)

## Blackwell-Exclusive Features

These capabilities are **unique to your 5090** — the 4090 cannot do them:
- **Native FP4 Tensor Core acceleration** via NVFP4 format: 3x faster inference, 4x smaller models, BF16 quality
- **SVDQuant + Nunchaku**: [github.com/mit-han-lab/nunchaku](https://github.com/mit-han-lab/nunchaku) — MIT license FP4 inference engine
- **CUDA 13 cuTile Python**: Write Tensor Core kernels in pure Python
- **Green Contexts**: Fine-grained GPU resource partitioning for multi-service workloads
- **DLSS 4.5 6X Multi Frame Gen**: Up to 5 AI-generated frames per rendered frame

## Ollama Configuration Tips

Ollama is running. Critical settings for optimal VRAM usage:
- Set `OLLAMA_NUM_CTX=4096` — **default 128K context silently eats 65 GB of VRAM**
- Set `OLLAMA_MAX_LOADED_MODELS=4` for concurrent model use
- Use Q4_K_M quantization for best quality/memory balance
- Create Modelfiles with explicit `num_ctx` for each model
