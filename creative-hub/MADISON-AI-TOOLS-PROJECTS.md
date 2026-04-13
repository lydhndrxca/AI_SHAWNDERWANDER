# Free GitHub Projects for Madison AI Tools

Projects and tools that directly map to features in Madison AI Suite.  
Organized by which Madison feature they enhance or could replace.

> **Your Hardware**: RTX 5090 (32 GB), i9-14900F, 96 GB RAM, 4 TB NVMe  
> **Madison Stack**: Electron + React + FastAPI + Gemini/Imagen/Veo  
> **Key Opportunity**: Many of Madison's paid API calls (Gemini, Imagen, Veo, Meshy) can be replaced or augmented with free local models running on your 5090.

---

## Table of Contents

1. [Local Image Generation (Replace/Supplement Imagen)](#1-local-image-generation)
2. [Local Vision & Chat (Replace/Supplement Gemini)](#2-local-vision--chat)
3. [3D Generation (Replace/Supplement Meshy & Hitem3D)](#3-3d-generation)
4. [Video Generation (Replace/Supplement Veo)](#4-video-generation)
5. [Texture & PBR Material Generation (Texture Lab)](#5-texture--pbr-material-generation)
6. [Background Removal, Inpainting & Outpainting (Image Editing)](#6-background-removal-inpainting--outpainting)
7. [Upscaling & Super-Resolution (Output Quality)](#7-upscaling--super-resolution)
8. [Sketch-to-Image & ControlNet (Designer Blockout)](#8-sketch-to-image--controlnet)
9. [Character Turnaround & Multi-View (Multiview Feature)](#9-character-turnaround--multi-view)
10. [Style Transfer (Style Library)](#10-style-transfer)
11. [Depth & Normal Maps (Environment/Texture Labs)](#11-depth--normal-maps)
12. [Color Palette & Mood Board (Art Direction)](#12-color-palette--mood-board)
13. [Pose Estimation & Character Rigging (Character Lab)](#13-pose-estimation--character-rigging)
14. [Reference Search & Image Understanding](#14-reference-search--image-understanding)
15. [Cost Savings Summary](#15-cost-savings-summary)

---

## 1. Local Image Generation

Madison currently sends every image gen request to Imagen 4 via API. With your 5090, you could generate locally in seconds for zero cost.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **ComfyUI** | [comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI) (107K stars) | Node-based engine. Can be called via API from Madison's FastAPI backend. Supports FLUX, SDXL, ControlNet, IP-Adapter, LoRA — everything. |
| **OllamaDiffuser** | [ollamadiffuser/ollamadiffuser](https://github.com/ollamadiffuser/ollamadiffuser) | FastAPI server with 40+ models, async API, img2img, inpainting, ControlNet, LoRA. Drop-in API for Madison's backend. |
| **flux-fp8-api** | [aredden/flux-fp8-api](https://github.com/aredden/flux-fp8-api) | FastAPI FLUX server with FP8 quantization. ~5s per FLUX image on your 5090. Minimal integration effort. |
| **Exogen Backend** | [andyngdz/exogen_backend](https://github.com/andyngdz/exogen_backend) | FastAPI SD server with WebSocket progress (Madison already uses WS for progress). Text-to-image, img2img, 18 samplers, LoRA. |
| **FLUX (official)** | [black-forest-labs/Flux](https://github.com/black-forest-labs/Flux) | Official FLUX repo with TensorRT support. FLUX.1 Schnell = ~2-3s on 5090. |
| **Fooocus** | [lllyasviel/Fooocus](https://github.com/lllyasviel/Fooocus) | One-click Midjourney-like UI. Great for quick concept art iteration outside the app. |
| **InvokeAI** | [invoke-ai/InvokeAI](https://github.com/invoke-ai/InvokeAI) | Professional creative tool with canvas, layers, inpainting — concept art focused. |

### Integration Path
Madison's `core.py` routes all image gen through `generate_image_from_model()`. You could add a `LOCAL_FLUX` model option alongside the Imagen models, routing to a local OllamaDiffuser or flux-fp8-api server. Cost = $0.

---

## 2. Local Vision & Chat

Madison's Creative Consultant, auto-review, and all text reasoning use Gemini API. Running a local model would eliminate the biggest recurring cost.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **Ollama** | [ollama/ollama](https://github.com/ollama/ollama) | Already installed on your machine. Serves LLMs via REST API. |
| **Qwen2.5 32B** | `ollama pull qwen2.5:32b` | Fits your VRAM. Quality comparable to GPT-4 for creative writing/analysis. |
| **LLaVA 34B** | `ollama pull llava:34b` | Vision model — can analyze concept art, give feedback, describe images. Direct replacement for Gemini vision calls. |
| **Qwen3.5 35B** | `ollama pull qwen3.5:35b` | Newest reasoning model, ~20 GB Q4. Excellent for the Creative Consultant's "deep mode." |
| **DeepSeek-R1 32B** | `ollama pull deepseek-r1:32b` | Chain-of-thought reasoning. Great for the brainstorming pipeline's deeper analysis steps. |
| **Open WebUI** | [open-webui/open-webui](https://github.com/open-webui/open-webui) | ChatGPT-like interface. Useful for testing prompts outside Madison. |

### Integration Path
Madison's FastAPI backend calls Gemini via `google-genai`. Ollama exposes an OpenAI-compatible API at `localhost:11434`. You could add a toggle in the settings: "Use Local AI" → route Creative Consultant, auto-review, and brainstorming to Ollama instead of Gemini. The prompt structures stay the same.

---

## 3. 3D Generation

Madison uses Meshy ($) and Hitem3D ($) for 3D gen. These local alternatives are free.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **TripoSR** | [VAST-AI-Research/TripoSR](https://github.com/VAST-AI-Research/TripoSR) (6.3K stars) | Image → 3D mesh in <0.5 seconds. MIT license. Only ~6 GB VRAM. Direct replacement for Meshy's image-to-3D. |
| **InstantMesh** | [TencentARC/InstantMesh](https://github.com/TencentARC/InstantMesh) | Multi-view reconstruction from single image. Higher quality than TripoSR for complex geometry. |
| **Shap-E** | [openai/shap-e](https://github.com/openai/shap-e) | Text/image → 3D model. OpenAI's open-source entry. |
| **TripoSR for Unity** | [mapluisch/TripoSR-for-Unity](https://github.com/mapluisch/TripoSR-for-Unity) | If you ever need 3D gen inside a game engine directly. |
| **gsplat** | [nerfstudio-project/gsplat](https://github.com/nerfstudio-project/gsplat) (4.8K stars) | 3D Gaussian Splatting. Turn reference photos into explorable 3D scenes for environment concept art. |
| **TexGaussian** | [ymxbj/TexGaussian](https://github.com/ymxbj/TexGaussian) | CVPR 2025. PBR-textured 3D generation from text. Outputs game-ready assets. |

### Integration Path
Madison's `threedgen.py` routes call Meshy/Hitem3D APIs. TripoSR can run as a local Python process — add a `LOCAL_TRIPO` option in `threedgen.py` that calls TripoSR directly, returns the mesh file, and serves it to the Three.js viewer in the frontend. Zero API cost, sub-second generation.

---

## 4. Video Generation

Madison uses Google Veo for video. Local alternatives now exist that run on a single 5090.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **LTX-2 / LTX Desktop** | [Lightricks/LTX-Desktop](https://github.com/Lightricks/LTX-Desktop) | First complete open-source audio+video model. 20s 4K clips with synced audio. Runs on RTX GPUs. ComfyUI integration. |
| **TurboDiffusion** | [thu-ml/TurboDiffusion](https://github.com/thu-ml/TurboDiffusion) | 100-200x faster video diffusion. Minutes → seconds on your 5090. |
| **MonarchRT** | [Infini-AI-Lab/MonarchRT](https://github.com/Infini-AI-Lab/MonarchRT) | Real-time 16 FPS video generation on single 5090. |
| **CogVideoX** | [THUDM/CogVideo](https://github.com/THUDM/CogVideo) | Text-to-video and image-to-video. Multiple resolutions. |
| **AnimateDiff** | [guoyww/AnimateDiff](https://github.com/guoyww/AnimateDiff) | Animate any SD-generated concept art into short clips. Great for animating character concepts. |

### Integration Path
Madison's `veo.py` routes handle Veo API calls. LTX-2 has a Python inference API — add a `LOCAL_LTX` mode that calls it directly and returns the video file. AnimateDiff via ComfyUI could power an "Animate This Concept" button in any lab.

---

## 5. Texture & PBR Material Generation

Directly relevant to Madison's **Texture Lab** and **Substance Sampler bridge**.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **PlaneToPBR** | [ScarlettStudios/PlaneToPBR](https://github.com/ScarlettStudios/PlaneToPBR) | Single image → full PBR maps (diffuse, normal, roughness, depth). One click. GPL-3.0. |
| **LumiTex** | [LumiTexPBR/LumiTex](https://github.com/LumiTexPBR/LumiTex) | ICLR 2026. High-fidelity PBR texture gen with illumination awareness. Apache 2.0. |
| **Texture Extractor** | [sagieppel/Unsupervised-extraction-of-textures-and-PBR-materials-from-images](https://github.com/sagieppel/Unsupervised-extraction-of-textures-and-PBR-materials-from-images) | Extract textures + PBR materials from random images. CC0 license. |
| **TexGaussian** | [ymxbj/TexGaussian](https://github.com/ymxbj/TexGaussian) | Text → PBR-textured 3D objects. Could feed directly into the Sampler pipeline. |

### Integration Path
Madison's Texture Lab generates textures via Imagen. These tools could add a "Generate PBR Maps" button that takes a generated texture and produces normal/roughness/depth maps locally. Feed those directly into the Sampler bridge (`sampler_plugin/`) for material creation — no Substance subscription needed for the PBR decomposition step.

---

## 6. Background Removal, Inpainting & Outpainting

Madison already uses `rembg`. These tools go further.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **IOPaint** | [Sanster/IOPaint](https://github.com/Sanster/IOPaint) (23K stars) | Web UI for inpainting, outpainting, object removal, upscaling, face restoration. All in one. GPU-accelerated. |
| **PowerPaint** | [zhuang2002/PowerPaint](https://github.com/zhuang2002/PowerPaint) | ECCV 2024. Text-guided inpainting, object removal, shape-guided insertion, outpainting. MIT. |
| **HoneyClean** | [Zayn1312/HoneyClean](https://github.com/Zayn1312/HoneyClean) | 9 background removal models, CUDA-accelerated, batch processing. Better than rembg for complex cases. |
| **withoutbg** | [withoutbg/withoutbg](https://github.com/withoutbg/withoutbg) | Docker-ready bg removal with Python SDK. Good for batch processing generated images. |
| **SAM 2** | [facebookresearch/sam2](https://github.com/facebookresearch/sam2) | Segment Anything Model 2. Click on any object → perfect mask. Essential for concept art compositing. |

### Integration Path
Madison's concept art often needs bg removal + compositing. SAM 2 could power a "Select Object" tool in the Art Table. IOPaint's API could add inpainting/outpainting to any lab — extend a character's environment, remove unwanted elements from generated art, etc.

---

## 7. Upscaling & Super-Resolution

AI-generated concept art often needs upscaling for handoff to production.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **Real-ESRGAN** | [upscayl/Real-ESRGAN](https://github.com/upscayl/Real-ESRGAN) | Industry standard 4x upscaler. Portable executables for Windows. |
| **Real-ESRGAN TensorRT** | [hishambarakat16/RealESRGAN-TensorRT-Upscaler](https://github.com/hishambarakat16/RealESRGAN-TensorRT-Upscaler) | 3-5x faster via NVIDIA TensorRT. Perfect for your 5090. Image + video. |
| **Upscayl** | [upscayl/upscayl](https://github.com/upscayl/upscayl) | Desktop app for AI upscaling. One-click, GPU-accelerated. |
| **Upscaler (web)** | [robertsLando/upscaler](https://github.com/robertsLando/upscaler) | REST API + web UI for upscaling. Docker-ready. Could integrate into Madison's backend. |

### Integration Path
Madison's Export & Handoff feature could include a "4x Upscale" toggle. Call Real-ESRGAN TensorRT from the FastAPI backend before exporting — concept art goes from 1024px gen to 4096px handoff quality automatically.

---

## 8. Sketch-to-Image & ControlNet

Directly enhances Madison's **Designer Blockout** and all concept art labs.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **ControlNet++** | [xinsir6/ControlNetPlus](https://github.com/xinsir6/ControlNetPlus) (2.1K stars) | All-in-one: 10+ control types (pose, depth, edge, scribble, tile). SDXL ProMax with super-res and inpainting. |
| **Block and Detail** | [BlockDetail/Block-and-Detail](https://github.com/BlockDetail/Block-and-Detail) | UIST 2024. Sketch-to-image that follows iterative artist workflow. Two-pass: fidelity + variation. |
| **IP-Adapter** | [tencent-ailab/IP-Adapter](https://github.com/tencent-ailab/IP-Adapter) | Image-prompted generation. Feed a style reference → generate new concepts in that style. Perfect for Madison's "Style Fusion" feature. |
| **ControlNet (original)** | [lllyasviel/ControlNet](https://github.com/lllyasviel/ControlNet) (33.8K stars) | The foundation. Pose, depth, canny edge → controlled image gen. |

### Integration Path
Madison's Designer Blockout lets users sketch layouts. ControlNet could turn those rough blockouts into fully rendered concept art locally. IP-Adapter plugs directly into the Style Library — pick a reference image, generate new art in that style.

---

## 9. Character Turnaround & Multi-View

Madison has a **Multiview** feature and the roadmap mentions turnaround sheets.

| Project | GitHub / Source | Why It Matters for Madison |
|---|---|---|
| **FLUX Kontext LoRA (Multi-View)** | [ComfyUI Workflow](https://runcomfy.com/comfyui-workflows/flux-kontext-lora-multi-view-turnaround-sheet) | Single image → front/profile/3-4/back views. Open-source ComfyUI workflow. |
| **Qwen Turnaround LoRA** | [HuggingFace](https://huggingface.co/tarn59/character_turnaround_sheet_qwen_image_edit_2509) | Generates character turnaround sheets from single reference. |
| **Zero123++** | [SUDO-AI-3D/zero123plus](https://github.com/SUDO-AI-3D/zero123plus) | Consistent multi-view generation from single image. Key input for 3D reconstruction. |
| **SyncDreamer** | [liuyuan-pal/SyncDreamer](https://github.com/liuyuan-pal/SyncDreamer) | Generates synchronized multi-view images maintaining 3D consistency. |

### Integration Path
Madison's Multiview feature currently uses Gemini. A local FLUX Kontext workflow could generate turnaround sheets from the Character Lab's output — click "Generate Turnaround" → get front/side/back/3-4 views locally in ~20 seconds on your 5090.

---

## 10. Style Transfer

Madison has a **Style Library** and "Style Fusion" across all labs.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **TeleStyle** | [Tele-AI/TeleStyle](https://github.com/Tele-AI/TeleStyle) | 2026. Image + video style transfer via Diffusion Transformers. Content-preserving. SOTA quality. |
| **StyleStudio** | [Westlake-AGI-Lab/StyleStudio](https://github.com/Westlake-AGI-Lab/StyleStudio) | CVPR 2025. Text-driven style transfer with selective control — choose which style elements to apply. |
| **Zen-style** | [FotographerAI/Zen-style](https://github.com/FotographerAI/Zen-style) | Structure-preserving style transfer using FLUX. Blends style into spatial geometry. Ideal for concept art. |
| **IP-Adapter** | (see above) | Image-prompted style transfer via diffusion. The best approach for "apply this art style to this new concept." |

### Integration Path
Madison's Style Library stores reference images. These tools could power a "Transfer Style" action: pick a style reference from the library → apply it to any generated concept → local, instant, free. TeleStyle's video support could also style-transfer concept animations.

---

## 11. Depth & Normal Maps

Valuable for Madison's **Environment Lab** and the **Texture Lab → Sampler bridge**.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **Depth Anything v2** | [DepthAnything/Depth-Anything-V2](https://github.com/DepthAnything/Depth-Anything-V2) | Best-in-class monocular depth from any image. Real-time on your 5090. |
| **Marigold** | [prs-eth/Marigold](https://github.com/prs-eth/Marigold) | Diffusion-based depth estimation. Extremely high quality for concept art. |
| **imaginairy-normal-map** | [brycedrennan/imaginairy-normal-map](https://github.com/brycedrennan/imaginairy-normal-map) | AI normal map generation from images. pip install. |
| **D2NT** | [fengyi233/depth-to-normal-translator](https://github.com/fengyi233/depth-to-normal-translator) | Depth → normal map conversion. 28x faster than Open3D. |
| **depthmap script** | [thygate/stable-diffusion-webui-depthmap-script](https://github.com/thygate/stable-diffusion-webui-depthmap-script) (1.8K stars) | Depth maps, normal maps, 3D meshes, stereo pairs from SD generations. |

### Integration Path
Add a "Generate Depth/Normal" button to Environment Lab and Texture Lab. Take any generated concept art → extract depth + normal maps → feed into Sampler bridge for material creation. Also useful for ControlNet-guided generation (depth-guided environment concepts).

---

## 12. Color Palette & Mood Board

Enhances Madison's **Art Direction Logs** and Creative Consultant mood boards.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **Image-Palette-Extractor** | [josh-weston-g/Image-Palette-Extractor](https://github.com/josh-weston-g/Image-Palette-Extractor) | Python CLI. K-means clustering for dominant colors. HEX/RGB/HSL export. |
| **AI-Color-Palette-Generator** | [Swyphry/AI-Color-Palette-Generator](https://github.com/Swyphry/AI-Color-Palette-Generator) | Text/image → color palette. Accessibility checks. Color harmony modes. |
| **colormagic** | [FlowindAI/colormagic](https://github.com/FlowindAI/colormagic) | Nuxt + TS. AI palette generation. 12K palettes/day. Could inspire a Madison palette feature. |

### Integration Path
Madison's Art Direction Logs could auto-extract palettes from every generated image. Feed into the Creative Consultant context so it can reference "the warm amber palette from your last environment concept" in feedback.

---

## 13. Pose Estimation & Character Rigging

For Madison's **Character Lab** — guide character generation with poses.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **DWPose** | [IDEA-Research/DWPose](https://github.com/IDEA-Research/DWPose) | Full-body pose estimation. Feed detected poses into ControlNet for pose-guided character gen. |
| **MediaPipe** | [google-ai-edge/mediapipe](https://github.com/google-ai-edge/mediapipe) | Google's real-time face, hand, body tracking. Lightweight. |
| **OpenPose** | [CMU-Perceptual-Computing-Lab/openpose](https://github.com/CMU-Perceptual-Computing-Lab/openpose) | The classic. Body + hand + face keypoints. |
| **Live Portrait** | [KwaiVGI/LivePortrait](https://github.com/KwaiVGI/LivePortrait) | Animate character portraits with webcam. Could bring generated characters to life. |

### Integration Path
Character Lab could offer a "Pose Reference" tool — upload a pose photo or use webcam → extract skeleton → use as ControlNet input for character generation. Ensures characters match the intended action pose.

---

## 14. Reference Search & Image Understanding

Madison's **Deep Reference Search** uses Gemini + Google Search grounding + Pexels/Pixabay.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **CLIP** | [openai/CLIP](https://github.com/openai/CLIP) | Image-text matching. Could power semantic search across your Generated Images library. |
| **Facet** | [ncoevoet/facet](https://github.com/ncoevoet/facet) | FastAPI local photo analysis. Scores images across 9 dimensions (composition, quality, etc.). |
| **Florence-2** | via HuggingFace | Microsoft's vision foundation model. Image understanding, captioning, detection. Local alternative to Gemini vision for auto-review. |
| **Grounding DINO** | [IDEA-Research/GroundingDINO](https://github.com/IDEA-Research/GroundingDINO) | "Find the sword in this image" → bounding box. Text-prompted object detection in concept art. |

### Integration Path
CLIP could power a local "Find Similar" feature across all generated images — no API needed. Florence-2 could handle the auto-review functionality locally. Grounding DINO could label elements in concept art for art direction logs.

---

## 15. Cost Savings Summary

Madison tracks costs in `config/`. Here's the estimated impact of going local:

| Current API | Cost | Local Replacement | New Cost |
|---|---|---|---|
| **Gemini (text/vision)** | Per-token billing | Ollama + Qwen2.5 32B / LLaVA 34B | $0 |
| **Imagen 4 (image gen)** | Per-image billing | FLUX.1 via OllamaDiffuser | $0 |
| **Veo (video gen)** | Per-video billing | LTX-2 / TurboDiffusion | $0 |
| **Meshy (3D gen)** | Subscription/per-model | TripoSR | $0 |
| **Hitem3D (3D gen)** | Per-model billing | InstantMesh / TripoSR | $0 |
| **Pexels/Pixabay** | Free tier limits | CLIP-based local search | Unlimited |

**Total local cost**: Electricity (~$0.10-0.30/hour at 575W TDP under load).  
**Your 5090's 32 GB VRAM** can run image gen AND an LLM simultaneously (e.g., 14B LLM at ~9 GB + FLUX at ~12 GB = 21 GB, leaving 11 GB headroom).

### Priority Integration Order

1. **Ollama + Qwen2.5 32B** — Already installed. Wire into Creative Consultant for zero-cost chat. Biggest immediate win.
2. **flux-fp8-api or OllamaDiffuser** — Local image gen server. Drop-in for Imagen calls.
3. **TripoSR** — Free 3D gen. Direct replacement for Meshy.
4. **Real-ESRGAN TensorRT** — Auto-upscale all exports. Instant quality boost.
5. **ControlNet + IP-Adapter via ComfyUI** — Sketch-to-concept and style transfer. Transforms the Blockout and Style Library features.
6. **LTX-2** — Local video gen when you need it.
7. **Depth Anything v2 + PlaneToPBR** — Feed concept art into the Sampler pipeline automatically.

---

## Addendum: Deep Research Discoveries (April 2026)

### 16. FP4 Acceleration — Your 5090's Secret Weapon

Madison can make image generation **3x faster** using Blackwell's native FP4 Tensor Cores.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **Nunchaku (SVDQuant + NVFP4)** | [mit-han-lab/nunchaku](https://github.com/mit-han-lab/nunchaku) | 3x speedup, 4x smaller FLUX models, BF16-quality output. Your 5090 is the only consumer GPU that can do this. |
| **TensorRT** | [NVIDIA/TensorRT](https://github.com/NVIDIA/TensorRT) | Optimize any model for max throughput on your GPU. Official NVIDIA. |

**Integration Path**: Run FLUX through Nunchaku's FP4 pipeline instead of BF16. Same quality, 3x faster. Madison's image gen goes from ~5s to ~1.5s per image.

### 17. Character Consistency Across Generations

Madison generates characters across multiple labs but can't guarantee the same character looks the same. These solve that.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **ConsistentID** | [JackAILab/ConsistentID](https://github.com/JackAILab/ConsistentID) | TPAMI 2026. Generate same character in different poses/scenes without LoRA training. Seconds, not minutes. |
| **WithAnyone** | [Doby-Xu/WithAnyone](https://github.com/doby-xu/WithAnyone) | ICLR 2026. Multi-ID consistency on FLUX. ComfyUI integration. Can put multiple consistent characters in one scene. |
| **UMO** | [bytedance/UMO](https://github.com/bytedance/UMO) | CVPR 2026. ByteDance. Multi-identity consistency via RL. Works as adapter on existing models. |

**Integration Path**: Character Lab generates a hero image → ConsistentID preserves that identity across all subsequent generations (different poses, environments, expressions). No more "same character looks different every time."

### 18. Real-Time Interactive Canvas

Transforms how artists work in Madison — draw rough strokes, see AI fill in real-time.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **StreamDiffusion** | [cumulo-autumn/StreamDiffusion](https://github.com/cumulo-autumn/StreamDiffusion) (10.7K stars) | 90+ FPS real-time image gen. ICCV 2025. Draw → AI renders instantly. |

**Integration Path**: Add a "Live Canvas" mode to Art Table. Artist draws rough shapes → StreamDiffusion renders them into concept art in real-time on the canvas. Your 5090 can easily handle 60+ FPS.

### 19. AI Lip Sync for Character Concepts

Bring generated character art to life.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **IMTalker** | [cbsjtu01/IMTalker](https://github.com/cbsjtu01/IMTalker) | Audio → talking face from any portrait. 40+ FPS. Controllable gaze/pose. |
| **ARTalk** | [xg-chu/ARTalk](https://github.com/xg-chu/ARTalk) | Real-time 3D head motion + lip sync from audio. MIT license. |

**Integration Path**: Character Lab → "Animate Character" button → feed portrait + sample dialogue audio → get talking-head video. Great for presenting character concepts to stakeholders.

### 20. AI Music & Sound for Concept Presentations

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **ACE-Step 1.5 XL** | [ACE-Step/ACE-Step-1.5](https://github.com/ACE-Step/ACE-Step-1.5) | Generate background music from text. 50+ languages, voice cloning. ~12 GB VRAM. Rivals Suno. |

**Integration Path**: Environment Lab → "Generate Ambient Audio" for concept art presentations. Automatically create mood-appropriate music for art reviews.

### 21. Seamless Tileable Textures

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **Tiled Diffusion** | [madaror/tiled-diffusion](https://github.com/madaror/tiled-diffusion) | CVPR 2025. Generate seamlessly tileable images. |
| **TEXTtoPBR** | [Vasco888888/text-to-pbr](https://github.com/Vasco888888/text-to-pbr) | Text → seamless PBR textures. React + Three.js. |

**Integration Path**: Texture Lab's generated textures often aren't seamless. Run through Tiled Diffusion as a post-processing step → guaranteed tileable output for game environments.

### 22. Screenshot-to-Code for UI Lab

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **screenshot-to-code** | [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) (72K stars) | Screenshot → HTML/React/Vue/Tailwind. FastAPI backend. |

**Integration Path**: UI Lab generates concept UIs → "Export as Code" button → screenshot-to-code converts the concept into working HTML/CSS. Bridges the gap between concept and implementation.

### 23. World Building for Valor Lore

Madison has a Valor World Bible and lore system. These tools could enhance it.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **WorldLoom** | [acornfish/WorldLoom](https://github.com/acornfish/WorldLoom) | Offline worldbuilding. Articles, maps, timelines. Export to HTML wiki. |
| **Lorewalker** | [Rukongai/Lorewalker](https://github.com/Rukongai/Lorewalker) | Lorebook editor with graph visualization and health analysis. |

**Integration Path**: Feed the `LORE/` folder into WorldLoom for visual graph exploration of the Valor Bible. Lorewalker can validate consistency across lore entries.

### 24. RAG for the Creative Consultant

Make the Creative Consultant aware of ALL previous art, lore, and decisions.

| Project | GitHub | Why It Matters for Madison |
|---|---|---|
| **OpenRAG** | [langflow-ai/openrag](https://github.com/langflow-ai/openrag) (3.8K stars) | Full RAG platform with drag-and-drop workflows. Ollama compatible. |
| **Second Brain** | [henrydaum/second-brain](https://github.com/henrydaum/second-brain) | Watches directories automatically. Self-extending AI agent. |

**Integration Path**: Index all of Madison's `ALL GENERATED IMAGES/`, `LORE/`, `STYLE_LIBRARY/`, and `ARTBOARD_LIBRARY/` into a local RAG system. The Creative Consultant can then reference "that character you designed last Tuesday" or "the color palette from the desert environment." Total context awareness, zero API cost.

### 25. Concurrent Model Running

Your 5090 can run image gen AND text AND voice simultaneously:

**Recommended concurrent setup for Madison:**

| Service | Model | VRAM |
|---|---|---|
| Creative Consultant | Qwen2.5 14B Q4 | ~11 GB |
| Image Gen | FLUX.1 Schnell FP4 | ~8 GB |
| Voice Preview | Kokoro TTS | ~1 GB |
| Background Removal | rembg | ~0.5 GB |
| **Total** | | **~20.5 GB** |
| **Headroom** | | **~11.5 GB free** |

**Critical tip**: Set `OLLAMA_NUM_CTX=4096` in environment. Default 128K context silently eats 65 GB of VRAM.

---

## Addendum 2: Lightweight Tools (No 5090 Required)

These run on **any team member's machine** — CPU-only or basic GPU. High value, zero hardware barrier.

### 26. Before/After Compare Slider

Madison's `FEATURE_IDEAS.md` already lists this as a gap.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **img-comparison-slider** | [sneas/img-comparison-slider](https://github.com/sneas/img-comparison-slider) (844 stars) | Browser (JS, <4 KB) | Drop into any lab's mainstage. Show original sketch vs generated art, or V1 vs V2 of a concept. React/Vue compatible. |
| **js-cloudimage-before-after** | [scaleflex/js-cloudimage-before-after](https://github.com/scaleflex/js-cloudimage-before-after) | Browser (JS, <12 KB) | Drag/hover/click modes. Zoom + pan. WCAG accessible. |

### 27. Image Annotation & Art Direction Markup

Let artists draw directly on concept art to give feedback — boxes, arrows, notes.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **Annotorious** | [recogito/annotorious](https://github.com/recogito/annotorious) (830 stars) | Browser (TS) | Boxes, polygons, freehand on any image. React bindings included. Save annotations as JSON. Perfect for art direction review. |
| **MarkinJS** | [datamarkin/MarkinJS](https://github.com/datamarkin/MarkinJS) | Browser (JS, 49 KB) | Zero dependencies. Boxes, polygons, keypoints, groups. Undo/redo. Zoom. |

### 28. Composition Analysis & Auto-Critique

Auto-score concept art for composition quality — rule of thirds, golden ratio, symmetry.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **Facet** | [ncoevoet/facet](https://github.com/ncoevoet/facet) | CPU / optional GPU | Scores 14 composition patterns (rule of thirds, golden ratio, diagonal, vanishing point). Also scores aesthetic quality, sharpness, exposure. FastAPI-based — same stack as Madison. |
| **CADB SAMP-Net** | [bcmi/Image-Composition-Assessment-Dataset-CADB](https://github.com/bcmi/Image-Composition-Assessment-Dataset-CADB) | CPU / small GPU | 13 composition classes. Rates composition 1-5. MIT. |
| **Photo Quality Analyzer** | [prasadabhishek/photo-quality-analyzer](https://github.com/prasadabhishek/photo-quality-analyzer) | CPU only | Sharpness, exposure (Ansel Adams Zone System), noise, dynamic range, color balance. pip install. |

**Use case**: Creative Consultant auto-review could include "Composition score: 4.2/5 — strong diagonal leading lines, consider shifting subject toward thirds intersection."

### 29. Duplicate / Similar Image Detection

The `ALL GENERATED IMAGES/` folder grows fast. Find duplicates and near-matches.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **imagededup** | [idealo/imagededup](https://github.com/idealo/imagededup) (5.6K stars) | CPU only | Perceptual hashing + CNN for near-duplicate detection. pip install. Finds "you generated something almost identical last week." |
| **imagehash** | [JohannesBuchner/imagehash](https://github.com/JohannesBuchner/imagehash) (3.8K stars) | CPU only | Lightweight perceptual hashing. Compare any two images in milliseconds. |

**Use case**: "Deduplicate Library" button in Generated Images browser. Or auto-flag when a new generation looks too similar to an existing one.

### 30. Raster-to-Vector (SVG Export)

Export clean vector versions of concept art for production handoff.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **VTracer** | [visioncortex/vtracer](https://github.com/visioncortex/vtracer) (5.8K stars) | CPU only (Rust) | Raster → clean SVG. Better than Adobe Illustrator's Image Trace for colored images. Presets for different art styles. |
| **PixelToPath** | [lorrisc/PixelToPath](https://github.com/lorrisc/PixelToPath) | CPU only | GUI wrapper for VTracer. Packaged EXE for Windows. Live preview. |
| **Vectalab** | [raphaelmansuy/vectalab](https://github.com/raphaelmansuy/vectalab) | CPU only | VTracer + color quantization + SVGO compression. Python. |

**Use case**: "Export as SVG" button in Export & Handoff. Concept art logos, icons, UI elements → production-ready vectors.

### 31. Line Art Extraction

Pull clean linework from any concept art — useful for style guides, coloring, handoff.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **Anime2Sketch** | [mukosame/anime2sketch](https://github.com/mukosame/anime2sketch) (2.1K stars) | CPU or GPU | Any illustration → clean sketch lines. Works on concept art, not just anime. Docker support. |
| **AniLines** | [zhenglinpan/AniLines-Anime-Lineart-Extractor](https://github.com/zhenglinpan/AniLines-Anime-Lineart-Extractor) | CPU (FP16) | Two modes: basic and detailed. Image + video support. Gradio UI. |

**Use case**: "Extract Linework" button in any lab. Feed the output back into ControlNet for guided regeneration, or include in handoff packages.

### 32. Smart Crop & Thumbnail Generation

Auto-crop generated art to focus on the subject. Generate consistent thumbnails for the library.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **AI Image Cropper v2** | [garystafford/ai-image-cropper-v2](https://github.com/garystafford/ai-image-cropper-v2) | CPU / small GPU | YOLO/DETR subject detection → smart crop. Batch processing. React UI included. |
| **Smart Crop** | [tsuijten/smart-crop](https://github.com/tsuijten/smart-crop) | CPU only | Face-aware cropping with MTCNN. Batch + multi-core. EXIF preserved. |

**Use case**: Generated Images browser shows auto-cropped thumbnails focused on the subject instead of random center-crops.

### 33. Contact Sheet / Grid Layout

Present multiple concept art variations in a single image for review.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **Pixeli** | [pakdad-mousavi/pixeli](https://github.com/pakdad-mousavi/pixeli) | CPU only (Node.js) | Grid, masonry, template, and collage modes. npm install. |
| **GridWiggle** | [kclemson/gridwiggle](https://github.com/kclemson/gridwiggle) | Browser (React) | AI smart crop + hero selection + constraint-based packing. Exports high-res PNG. |

**Use case**: "Generate Contact Sheet" button in any lab. Select 4-8 variations → auto-layout into a presentation-ready grid image.

### 34. Color Grading & LUT Generation

Match color mood across concept art sets. Extract and apply color grades.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **3dlut-creator** | [bjzhou/3dlut-creator](https://github.com/bjzhou/3dlut-creator) | CPU / optional GPU | Feed two images (before/after) → generates a .cube LUT. Apply that LUT to unify color across all art in a project. |
| **pycubelut** | [yoonsikp/pycubelut](https://github.com/yoonsikp/pycubelut) | CPU only | Apply .cube LUTs to images. CLI. Batch. |

**Use case**: Art director grades one hero image → extract LUT → apply to all concept art in the project for unified color mood.

### 35. Font Detection from UI Concepts

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **Lens** | [mixfont/lens](https://github.com/mixfont/lens) | CPU / small GPU | Identifies 1,000+ font families from images. ResNet18 (tiny). |
| **font-classify** | [Storia-AI/font-classify](https://github.com/Storia-AI/font-classify) | CPU (ONNX) | Identifies Google Fonts from screenshots. Pre-trained ONNX model. |

**Use case**: UI Lab → "What Font Is This?" tool. Upload a reference screenshot → identify fonts used → note them in the handoff spec.

### 36. Watermark & Metadata Stamping

Protect concept art and embed production metadata before sharing externally.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **TrustMark** | [adobe/trustmark](https://github.com/adobe/trustmark) | CPU (ONNX) | Adobe's invisible watermark. Embed + detect. Python/JS/Rust. Survives compression, crops, screenshots. |
| **piexifjs** | [hMatoba/piexifjs](https://github.com/hMatoba/piexifjs) | Browser (JS) | Read/write EXIF metadata. Embed project name, artist, version, timestamp into exports. |
| **image-watermark** | [luthraG/image-watermark](https://github.com/luthraG/image-watermark) | Node.js | Visible text watermarks. Customizable. |

**Use case**: Export & Handoff auto-embeds invisible TrustMark watermark + EXIF metadata (project, artist, date, version) into every exported image.

### 37. Batch Format Conversion & Optimization

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **Sharp** | [lovell/sharp](https://github.com/lovell/sharp) (32K stars) | CPU (Node.js) | 4-5x faster than ImageMagick. JPEG/PNG/WebP/AVIF. Resize, crop, convert, compress. |
| **wasm-image-optimization** | [node-libraries/wasm-image-optimization](https://github.com/node-libraries/wasm-image-optimization) | Browser (WASM) | Client-side conversion. PNG/JPEG/WebP/AVIF/GIF. No server needed. |

**Use case**: Export & Handoff → "Export as WebP (optimized)" or "Resize all to 2048px max". Batch convert the whole project's art for web/engine delivery.

### 38. Layer Compositing & Blend Modes

Combine concept art elements programmatically — overlay characters onto environments, etc.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **BlendModes** | [PyPI](https://pypi.org/project/blendmodes/) (353K+ monthly downloads) | CPU (Python) | Photoshop/GIMP blend modes: multiply, screen, overlay, soft light, etc. |
| **Image4Layer** | [pashango2/Image4Layer](https://github.com/pashango2/Image4Layer) | CPU (Python/Pillow) | CSS3 blend modes. Separable + non-separable (hue, saturation, luminosity). |
| **Maskilayer** | [twardoch/maskilayer](https://github.com/twardoch/maskilayer) | CPU (Python) | Alpha compositing with mask-based blending. Multi-mask support. |

**Use case**: Art Table → "Composite Layers" tool. Place a character (bg removed) onto an environment concept with multiply/overlay blending. All CPU, instant.

### 39. Symmetry Analysis

Auto-detect if a character, weapon, or prop design is symmetrical — and where it breaks.

| Project | GitHub | Runs On | Integration |
|---|---|---|---|
| **MirrorSymmetry** | [YiranJing/MirrorSymmetry](https://github.com/YiranJing/MirrorSymmetry) | CPU only | SIFT-based bilateral symmetry detection. OpenCV + NumPy. Finds the symmetry axis. |

**Use case**: Character Lab / Weapon Lab / Prop Lab → "Check Symmetry" overlay. Draws the symmetry axis and highlights asymmetric areas. Useful for catching unintentional asymmetry in designs.

---

## Summary: The "No 5090 Needed" Toolkit

These 14 tools could ship as new Madison features tomorrow without any hardware requirements:

| # | Feature | Effort | Impact |
|---|---|---|---|
| 1 | Before/After slider | 1 hour | Fills a gap already on the roadmap |
| 2 | Art annotation/markup | Half day | Transforms art direction review |
| 3 | Composition auto-score | Half day | Adds objective critique to Creative Consultant |
| 4 | Duplicate detection | 2 hours | Keeps Generated Images library clean |
| 5 | SVG export | 2 hours | Production-ready vector handoff |
| 6 | Line art extraction | Half day | Clean linework for style guides |
| 7 | Smart crop thumbnails | 2 hours | Better library browsing |
| 8 | Contact sheet generator | 2 hours | One-click presentation layouts |
| 9 | Color grading / LUT | Half day | Unified color across projects |
| 10 | Font detection | 2 hours | "What font is this?" in UI Lab |
| 11 | Invisible watermark + EXIF | Half day | Protect and tag all exports |
| 12 | Batch format/resize | 2 hours | WebP/AVIF export, batch resize |
| 13 | Layer compositing | Half day | Combine character + environment concepts |
| 14 | Symmetry check | 2 hours | Catch asymmetry in character/weapon/prop designs |
