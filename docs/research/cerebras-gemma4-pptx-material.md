# Cerebras + Google DeepMind Gemma 4 — Pitch Deck Research Material

> Research compiled 2026-06-29 for the **Cerebras x Google Gemma 4 ($5,000) Hackathon**.
> Every claim below is tagged with a source URL. Items I could **not** independently verify are flagged **[UNVERIFIED]**. No numbers were invented.

---

## 0. The Hackathon (context)

- Event: **"Cerebras x Google Gemma 4: $5000 Hackathon"** — a 24-hour hackathon running **Sun June 28, 10:00 AM PT → Mon June 29, 10:00 AM PT, 2026**. Cerebras partnered with Google DeepMind (the team behind Gemma). Prize categories include Multiverse Agents ($2K), People's Choice ($2K), Enterprise Impact ($1K). Source: https://luma.com/cerebras-piwl
- Theme: Gemma 4 31B is **the first multimodal model and first Google DeepMind model** hosted on Cerebras Inference, running at **>1,500 tokens/sec**. Source: https://www.cerebras.ai/blog/gemma-4-on-cerebras-the-fastest-inference-is-now-multimodal

---

## 1. Cerebras (the company)

### What they do
Cerebras designs chips, hardware systems, and cloud services purpose-built for AI. Its flagship is the **Wafer-Scale Engine (WSE)** — the largest AI chip ever built — which powers the **CS-3** system and the **Cerebras Inference** cloud.
Sources: https://techcrunch.com/2025/09/30/a-year-after-filing-to-ipo-still-private-cerebras-systems-raises-1-1b/ • https://www.cerebras.ai/chip

### Company facts
| Fact | Value | Source |
|---|---|---|
| Founded | **2015** | https://en.wikipedia.org/wiki/Cerebras |
| Founders | **Andrew Feldman, Gary Lauterbach, Michael James, Sean Lie, Jean-Philippe Fricker** | https://en.wikipedia.org/wiki/Cerebras |
| HQ | **Sunnyvale, California, USA** | https://en.wikipedia.org/wiki/Cerebras |
| Prior company of founders | SeaMicro (sold to AMD, 2012, $334M) | https://techcrunch.com/2025/09/30/a-year-after-filing-to-ipo-still-private-cerebras-systems-raises-1-1b/ |
| Recognition | WSE-3 named to *Time*'s "Best Inventions of 2024" | https://en.wikipedia.org/wiki/Cerebras |

### Funding & IPO
- **Sept 2025:** Series G of **$1.1B** at a **$8.1B** valuation ($36.23/share). Source: https://techcrunch.com/2025/09/30/a-year-after-filing-to-ipo-still-private-cerebras-systems-raises-1-1b/
- **Jan 2026:** Series H of **$1.0B** ($89.01/share); investors incl. Benchmark ($225M), Alpha Wave ($100M), Fidelity ($100M). Source: https://techcrunch.com/2025/09/30/a-year-after-filing-to-ipo-still-private-cerebras-systems-raises-1-1b/
- **IPO — May 14, 2026:** Raised **$5.55B** (30M shares @ $185), opened on Nasdaq at **$350**, valuing the company at **~$95B** — the largest U.S. tech IPO since 2019. Source: https://techcrunch.com/2026/05/14/cerebras-raises-5-5b-kicking-off-2026s-ipo-season-with-a-bang/ • https://www.cnbc.com/2026/05/14/cerebras-ipo-mints-two-billionaires-sets-stage-for-potential-ai-wave
- IPO had earlier been delayed by a CFIUS review tied to a $335M investment from G42 (Abu Dhabi). Source: https://techcrunch.com/2025/09/30/a-year-after-filing-to-ipo-still-private-cerebras-systems-raises-1-1b/

### Q1 2026 financials (first quarter as a public company)
| Metric | Value | Source |
|---|---|---|
| GAAP revenue | **$193.4M** (+13% QoQ, **+94% YoY**) | https://www.globenewswire.com/news-release/2026/06/23/3316476/0/en/cerebras-systems-announces-strong-first-quarter-2026-results.html |
| Hardware revenue | $110.6M (+59% YoY) | (same) |
| Cloud & services revenue | $82.8M (**+178% YoY**) | (same) |
| GAAP gross margin | 45% | (same) |
| GAAP net loss | $(14.0)M | (same) |
| FY2026 guidance (core revenue) | $855–865M (+69% YoY) | (same) |
| Notable deal | **$20B+ multi-year deal with OpenAI** for 750 MW capacity | (same) |

### The Wafer-Scale Engine (WSE-3)
| Spec | Value | Source |
|---|---|---|
| Transistors | **4 trillion** | https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine |
| AI cores | **900,000** | (same) |
| On-chip SRAM | **44 GB** | (same) |
| Process node | **5nm (TSMC)** | (same) |
| Peak AI performance | **125 PetaFLOPs (FP16)** | (same) |
| Die size | **~215 mm per side** (uses nearly a full 300mm wafer; ~46,225 mm²) | https://en.wikipedia.org/wiki/Cerebras • https://spectrum.ieee.org/cerebras-chip-cs3 |
| Max model training size | up to 24 trillion parameters | https://www.cerebras.ai/press-release/cerebras-announces-third-generation-wafer-scale-engine |
| Cluster scale | up to 2,048 CS-3 systems | (same) |
| vs prior gen | 2× the performance of WSE-2 at same power/price | (same) |
| Size vs largest GPU | **57× larger than the largest GPU** | https://wccftech.com/cerebras-3rd-gen-wafer-scale-chip-ai-57x-larger-largest-gpu-900k-cores-4-trillion-transistors/ |

> **[UNVERIFIED — secondary source only]** "44GB on-chip SRAM with 21 PB/s memory bandwidth (7,000× H100)" and "900,000 cores" framing appear in third-party blogs (Introl, Spheron). The **44GB SRAM, 4T transistors, 900K cores, 125 PetaFLOPs** figures are confirmed by the Cerebras press release; the **21 PB/s bandwidth** and **7,000× H100 bandwidth** claims are from secondary sources only (https://www.spheron.network/blog/cerebras-vs-nvidia-h100-inference-2026/) — use with a caveat or cite as "~7,000× memory bandwidth of an H100."

### Cerebras Inference — headline speed numbers
| Model | Speed | Source |
|---|---|---|
| Llama 3.1-70B | **2,100 tokens/sec** (a 3× boost; "16× faster than the fastest GPU solution") | https://www.cerebras.ai/blog/cerebras-inference-3x-faster |
| Llama 3.1-405B | **969 tokens/sec** | https://www.cerebras.ai/press-release/cerebras-inference-llama-405b |
| Llama 3.1-8B | **1,800 tokens/sec** (secondary source) | https://introl.com/blog/cerebras-wafer-scale-engine-cs3-alternative-ai-architecture-guide-2025 |
| **Gemma 4 31B** | **>1,500 tokens/sec** | https://www.cerebras.ai/blog/gemma-4-on-cerebras-the-fastest-inference-is-now-multimodal |

### Cerebras vs NVIDIA H100 / GPU latency
- Full request completes in **~0.4 sec vs 1.1–4.2 sec on GPU**. Source: https://www.cerebras.ai/blog/cerebras-inference-3x-faster
- Per-user output speed: **68× faster than hyperscale clouds, 4–8× faster than other AI accelerators**. Source: (same)
- **Nuance for credibility:** At batch 1, WSE-3 delivers ~3× the tokens/sec of a single H100, but at high concurrency (batch >8) a batched H100 (vLLM continuous batching) surpasses a single WSE-3 on aggregate throughput. Cerebras' advantage is **low-latency, single-stream (per-user) speed**, not raw aggregate throughput. Source: https://www.spheron.network/blog/cerebras-vs-nvidia-h100-inference-2026/

### Recent news (2025–2026)
- **AWS partnership** (announced ~March 2026): multi-year deal; disaggregated inference with AWS Trainium 3 doing prefill and Cerebras CS-3 doing decode; coming to Amazon Bedrock. Sources: https://siliconangle.com/2026/03/13/aws-will-bring-cerebras-wafer-size-wse-3-chip-cloud-platform/ • https://www.cerebras.ai/press-release/awscollaboration
- **OpenAI deal**: $20B+ multi-year, 750 MW capacity (disclosed in Q1 2026 results). Source: https://www.globenewswire.com/news-release/2026/06/23/3316476/0/en/cerebras-systems-announces-strong-first-quarter-2026-results.html

---

## 2. Cerebras Inference API specifics
Source for this entire section: **https://inference-docs.cerebras.ai** and its chat-completions reference page.

- **Base URL:** `https://api.cerebras.ai/v1`
- **OpenAI compatibility:** "We designed the Cerebras API to be mostly compatible with OpenAI's client libraries." Works with `client.chat.completions.create()` (messages + model params).
- **Streaming:** `stream: true` returns partial message deltas via Server-Sent Events.
- **`time_info` object** (returned in response):
  - `queue_time` — time in queue before processing (seconds)
  - `prompt_time` — time processing prompt/input tokens (seconds)
  - `completion_time` — time generating output tokens (seconds)
  - `total_time` — end-to-end request time (seconds)
  - `created` — Unix timestamp when `time_info` was recorded
- **`reasoning_effort` parameter** (model-dependent accepted values):
  - `gpt-oss-120b`: `low`, `medium` (default), `high`
  - `zai-glm-4.7`: `none` (disables reasoning)
  - **`gemma-4-31b`: `none` (default), `low`, `medium`, `high`**
- **Image input:** base64 data URI only — `data:image/{format};base64,{data}`; supported formats `png` and `jpeg`; **external image URLs are NOT supported**.
- **Structured outputs (`response_format`):** `{ "type": "json_schema", ... }` for schema-enforced output, and `{ "type": "json_object" }` for legacy JSON mode without schema enforcement.
- **Tool calling:** `tool_choice` ∈ `none` | `auto` (default) | `required`; `parallel_tool_calls: true` by default.
- **Rate limits:** **[UNVERIFIED]** The dedicated rate-limits page (`/resources/rate-limits`) returned HTTP 404 at research time; exact RPM/TPM tier numbers could not be confirmed from the docs. Flag this and check the live console (cloud.cerebras.ai) for current per-tier limits before quoting any number in the deck.

---

## 3. Gemma 4 / Gemma family (Google DeepMind)

> Gemma 4 is genuinely new (released ~April 2026; private preview on Cerebras June 18, 2026). Facts below are from Google's official model card and HuggingFace; benchmark numbers come from the model card.

- **What it is:** Gemma is Google DeepMind's family of open-weight models built from the same research/tech as Gemini. **Gemma 4 31B** is the flagship dense variant. Sources: https://ai.google.dev/gemma/docs/core/model_card_4 • https://huggingface.co/google/gemma-4-31B-it
- **Model id:** `gemma-4-31b` (HuggingFace: `google/gemma-4-31B` and instruction-tuned `google/gemma-4-31B-it`). Source: https://huggingface.co/google/gemma-4-31B-it
- **Parameters:** **30.7B** total (dense), 60 layers. Source: https://ai.google.dev/gemma/docs/core/model_card_4
- **Context length:** **256K tokens** (proportional RoPE for long-context). Source: (same)
- **Modalities:** **Text + Image** input → text output. Vision encoder **~550M params**; configurable visual token budgets of **70, 140, 280, 560, 1120** tokens (higher = better OCR/document parsing). Source: (same)
- **Architecture:** hybrid attention interleaving local sliding-window attention (1,024-token window) with full global attention. Source: (same)
- **License:** **Apache 2.0** (open-weight). Source: (same) • https://www.cerebras.ai/blog/gemma-4-on-cerebras-the-fastest-inference-is-now-multimodal
- **Languages:** 140+ languages; native "thinking" capability and function calling. Source: https://ai.google.dev/gemma/docs/core/model_card_4
- **Training cutoff:** January 2025. Source: (same)
- **Benchmarks (instruction-tuned), per the model card** — treat as vendor-reported:
  - MMLU Pro: **85.2%**
  - AIME 2026 (no tools): **89.2%**
  - GPQA Diamond: **84.3%**
  - Codeforces ELO: **2150**
  - MATH-Vision: **85.6%**
  - Source: https://ai.google.dev/gemma/docs/core/model_card_4
- **vs other open models / positioning:** On the Artificial Analysis Intelligence Index, **Gemma 4 31B scores 29 — effectively matching Claude Haiku at 30**, while running ~15× faster on Cerebras. Source: https://www.cerebras.ai/blog/gemma-4-on-cerebras-the-fastest-inference-is-now-multimodal

> **Note on confidence:** The model card numbers above are Google's own reported figures (vendor benchmarks). They are verified as *stated by the source*, not independently reproduced. There is also a MoE 26B variant referenced alongside the dense 31B. The "MoE 26B" detail is from the model-card summary — confirm on the live card if you cite it.

---

## 4. Image assets for the deck

All four assets below were **downloaded and verified** (HTTP 200 + valid image headers) into:
`C:\AGENT\Ekathvam-OmniSwarm\docs\research\assets\`

| File saved | What it is | Direct source URL (verified resolves) | License / note |
|---|---|---|---|
| `cerebras-logo.svg` | Cerebras wordmark logo (vector) | https://upload.wikimedia.org/wikipedia/commons/1/15/Cerebras_logo.svg | Wikimedia: below threshold of originality → public domain; **trademark** still applies |
| `cerebras-logo-1280.png` | Cerebras logo, 1280px raster (1280×564, transparent) | https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cerebras_logo.svg/1280px-Cerebras_logo.svg.png | same as above |
| `cerebras-wse3-press.jpg` | Official WSE-3 press image (1600×1600), from Cerebras' own CDN | https://cdn.sanity.io/images/e4qjo92p/production/8ab10c72853c7d5074adeec215c9e65274a82fe8-2160x2160.jpg | Cerebras-owned marketing image (the og:image on the WSE-3 press release); promotional use — credit Cerebras |
| `gemma-logo.svg` | Official Google DeepMind **Gemma** logo (vector, from Google's own CDN) | https://storage.googleapis.com/gdm-deepmind-com-prod-public/media/original_images/nav__dm__gemma__large.svg | Google brand asset — trademark of Google; follow Google brand guidelines |

### Additional verified image URLs (not downloaded, but resolve / are official sources)
- Cerebras HQ building photo (Wikimedia, freely licensed): https://upload.wikimedia.org/wikipedia/commons/0/01/1237_E._Arques_Avenue.jpg
- Higher-res Cerebras logo PNG (2560px): https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cerebras_logo.svg/3840px-Cerebras_logo.svg.png
- Gemma ecosystem icons (Google CDN, official SVGs): HuggingFace `gemma-ecosystem__hugging-face.svg`, Kaggle, Keras, Ollama, PyTorch variants under `https://storage.googleapis.com/gdm-deepmind-com-prod-public/media/original_images/`
- Brand asset portals (for official, guideline-compliant logos): Cerebras Brandfolder https://brandfolder.com/cerebras ; Brandfetch https://brandfetch.com/cerebras.ai and https://brandfetch.com/gemma.lt

> **Caveat:** A dedicated WSE-3 *bare-wafer* close-up was **not** found on a freely-licensed host (Wikimedia Commons only has the logo + an HQ building photo). The `cerebras-wse3-press.jpg` above is the official marketing hero image from Cerebras' own site CDN — use it as the chip visual and credit Cerebras. For the IEEE Spectrum / press-kit chip photos, request via Cerebras media channels to be safe for any public/published deck.

---

## Licensing reminder for the deck
- **Cerebras logo (Wikimedia):** public-domain rendering but a trademark — fine for an internal/hackathon pitch; attribute the company.
- **Cerebras WSE-3 press image:** Cerebras-owned; promotional use with credit.
- **Gemma logo (Google CDN):** Google trademark; abide by Google's brand guidelines (don't alter, don't imply endorsement beyond the hackathon partnership).
